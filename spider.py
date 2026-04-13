#!/usr/bin/env python3
"""
Web spider to crawl andetag.museum and save content as markdown files.

Versioned mode (default): each run writes an immutable snapshot under crawl-versions/<id>/
(html/ and md/ subtrees), writes MIGRATION_CHANGELOG.md in the new snapshot folder, updates
manifest.json, then copies the snapshot to site-html/ and site-md/ unless --no-promote.

Use --diff-against-canonical to compare the new crawl to the existing site-html/ and site-md/
trees without treating the prior archived snapshot as the baseline. Pair with --no-promote to
leave the workspace mirrors untouched.

Legacy mode (--legacy): deletes and recreates site-html/ and site-md/ only, no archive or diff.
"""

from __future__ import annotations

import argparse
import difflib
import hashlib
import json
import os
import re
import shutil
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlparse, urlunparse
from xml.sax.saxutils import escape

import html2text
import requests
from bs4 import BeautifulSoup

MANIFEST_NAME = "manifest.json"
MAX_DIFF_CONTEXT = 3
MAX_DIFF_LINES_TOTAL = 120
MAX_FILES_WITH_UNIFIED_DIFF = 40


def repo_root() -> Path:
    return Path(__file__).resolve().parent


def load_manifest(versions_dir: Path) -> dict:
    path = versions_dir / MANIFEST_NAME
    if not path.is_file():
        return {"versions": []}
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return {"versions": []}
    if not isinstance(data, dict):
        return {"versions": []}
    versions = data.get("versions")
    if not isinstance(versions, list):
        versions = []
    return {"versions": versions}


def save_manifest(versions_dir: Path, manifest: dict) -> None:
    versions_dir.mkdir(parents=True, exist_ok=True)
    path = versions_dir / MANIFEST_NAME
    path.write_text(
        json.dumps(manifest, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )


def new_version_id() -> str:
    return datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")


def iter_relative_files(root: Path) -> dict[str, Path]:
    if not root.is_dir():
        return {}
    out: dict[str, Path] = {}
    for p in root.rglob("*"):
        if p.is_file():
            rel = p.relative_to(root).as_posix()
            out[rel] = p
    return out


def file_sha256(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def is_probably_text(data: bytes) -> bool:
    if not data:
        return True
    if b"\0" in data[:8192]:
        return False
    try:
        data.decode("utf-8")
        return True
    except UnicodeDecodeError:
        return False


def categorize_tree_diff(old_root: Path, new_root: Path) -> dict[str, list[str]]:
    """Compare two directory trees; paths are posix relative strings."""
    old_files = iter_relative_files(old_root)
    new_files = iter_relative_files(new_root)
    old_set, new_set = set(old_files), set(new_files)

    added = sorted(new_set - old_set)
    removed = sorted(old_set - new_set)
    unchanged: list[str] = []
    modified: list[str] = []

    for rel in sorted(old_set & new_set):
        op, np = old_files[rel], new_files[rel]
        if file_sha256(op) == file_sha256(np):
            unchanged.append(rel)
        else:
            modified.append(rel)

    return {
        "added": added,
        "removed": removed,
        "modified": modified,
        "unchanged": unchanged,
    }


def unified_diff_snippet(old_path: Path, new_path: Path, rel: str, max_lines: int) -> str:
    old_b = old_path.read_bytes()
    new_b = new_path.read_bytes()
    if not is_probably_text(old_b) or not is_probably_text(new_b):
        return "(binary or non-UTF-8; diff omitted)\n"
    old_lines = old_b.decode("utf-8", errors="replace").splitlines(keepends=True)
    new_lines = new_b.decode("utf-8", errors="replace").splitlines(keepends=True)
    diff = list(
        difflib.unified_diff(
            old_lines,
            new_lines,
            fromfile=f"a/{rel}",
            tofile=f"b/{rel}",
            n=MAX_DIFF_CONTEXT,
        )
    )
    if len(diff) > max_lines:
        head = diff[: max_lines - 4]
        head.append(f"... ({len(diff) - max_lines + 4} more diff lines truncated)\n")
        diff = head
    return "".join(diff) if diff else "(no line-level diff)\n"


def format_migration_changelog(
    *,
    previous_id: str | None,
    new_id: str,
    base_url: str,
    html_diff: dict[str, list[str]],
    md_diff: dict[str, list[str]],
) -> str:
    lines: list[str] = [
        "# Crawl migration changelog",
        "",
        f"**New snapshot:** `{new_id}`",
        f"**Previous snapshot:** `{previous_id or '(none; first archived crawl)'}`",
        f"**Source:** `{base_url}`",
        f"**Generated (UTC):** {datetime.now(timezone.utc).isoformat()}",
        "",
        "Use this report to see what changed on the live site between crawls. "
        "Update the Astro migration (`site/`) to match modified or new sources under `site-html/` "
        "and `site-md/`, and remove or adjust content that maps to removed files.",
        "",
        "## Summary",
        "",
        "| Mirror | Added | Removed | Modified | Unchanged |",
        "|--------|-------|---------|----------|-----------|",
    ]

    def row(label: str, d: dict[str, list[str]]) -> str:
        return (
            f"| {label} | {len(d['added'])} | {len(d['removed'])} | "
            f"{len(d['modified'])} | {len(d['unchanged'])} |"
        )

    lines.append(row("HTML (`site-html/`)", html_diff))
    lines.append(row("Markdown (`site-md/`)", md_diff))
    lines.append("")

    def section(title: str, d: dict[str, list[str]], key: str) -> None:
        items = d.get(key, [])
        lines.append(f"## {title}")
        lines.append("")
        if not items:
            lines.append("(none)")
            lines.append("")
            return
        for p in items:
            lines.append(f"- `{p}`")
        lines.append("")

    lines.append("### HTML mirror paths")
    section("HTML: added files", html_diff, "added")
    section("HTML: removed files", html_diff, "removed")
    section("HTML: modified files", html_diff, "modified")

    lines.append("### Markdown mirror paths")
    section("Markdown: added files", md_diff, "added")
    section("Markdown: removed files", md_diff, "removed")
    section("Markdown: modified files", md_diff, "modified")

    lines.append("## Unified diffs (text files, truncated)")
    lines.append("")
    lines.append(
        f"Up to **{MAX_FILES_WITH_UNIFIED_DIFF}** modified text files per mirror; "
        f"each snippet capped at **{MAX_DIFF_LINES_TOTAL}** lines."
    )
    lines.append("")

    return "\n".join(lines)


def append_unified_diff_sections(
    lines: list[str],
    label: str,
    old_root: Path,
    new_root: Path,
    modified_rels: list[str],
) -> None:
    lines.append(f"### {label}")
    lines.append("")
    shown = 0
    for rel in modified_rels:
        if shown >= MAX_FILES_WITH_UNIFIED_DIFF:
            lines.append(
                f"*Further modified files omitted (limit {MAX_FILES_WITH_UNIFIED_DIFF} "
                "unified diffs per mirror). Run `diff -ru` on the two snapshot `html/` or `md/` "
                "trees for a full report.*"
            )
            lines.append("")
            break
        op, np = old_root / rel, new_root / rel
        if not op.is_file() or not np.is_file():
            continue
        snippet = unified_diff_snippet(op, np, rel, MAX_DIFF_LINES_TOTAL)
        if snippet.strip() == "(binary or non-UTF-8; diff omitted)".strip():
            lines.append(f"#### `{rel}`")
            lines.append("")
            lines.append(snippet.rstrip())
            lines.append("")
            shown += 1
            continue
        lines.append(f"#### `{rel}`")
        lines.append("")
        lines.append("```diff")
        lines.append(snippet.rstrip("\n"))
        lines.append("```")
        lines.append("")
        shown += 1


def write_migration_changelog_file(
    path: Path,
    *,
    previous_id: str | None,
    new_id: str,
    base_url: str,
    prev_html: Path,
    prev_md: Path,
    new_html: Path,
    new_md: Path,
) -> None:
    html_diff = categorize_tree_diff(prev_html, new_html)
    md_diff = categorize_tree_diff(prev_md, new_md)
    body_lines = format_migration_changelog(
        previous_id=previous_id,
        new_id=new_id,
        base_url=base_url,
        html_diff=html_diff,
        md_diff=md_diff,
    ).splitlines()
    lines = list(body_lines)
    append_unified_diff_sections(
        lines,
        "HTML mirror",
        prev_html,
        new_html,
        html_diff["modified"],
    )
    append_unified_diff_sections(
        lines,
        "Markdown mirror",
        prev_md,
        new_md,
        md_diff["modified"],
    )
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def replace_tree(src: Path, dest: Path) -> None:
    if dest.exists():
        shutil.rmtree(dest)
    shutil.copytree(src, dest)


def promote_snapshot_to_canonical(version_html: Path, version_md: Path, html_dir: Path, md_dir: Path) -> None:
    replace_tree(version_html, html_dir)
    replace_tree(version_md, md_dir)


class AndetagSpider:
    def __init__(self, base_url, html_dir="site-html", md_dir="site-md", *, reset_output: bool = True):
        self.base_url = base_url.rstrip("/")
        self.domain = urlparse(base_url).netloc
        self.html_dir = html_dir
        self.md_dir = md_dir
        self.visited = set()
        self.to_visit = {self.normalize_url(base_url)}
        self.crawled_pages = set()
        self.downloaded_assets = set()
        self.reset_output = reset_output

        if self.reset_output:
            self.reset_output_directories()

        Path(html_dir).mkdir(parents=True, exist_ok=True)
        Path(md_dir).mkdir(parents=True, exist_ok=True)

        self.h = html2text.HTML2Text()
        self.h.ignore_links = False
        self.h.ignore_images = True
        self.h.ignore_emphasis = False
        self.h.body_width = 0
        self.h.skip_internal_links = False

        self.session = requests.Session()
        self.session.headers.update(
            {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
            }
        )

    def reset_output_directories(self):
        for directory in (self.html_dir, self.md_dir):
            dir_path = Path(directory)
            if dir_path.exists() and dir_path.is_dir():
                shutil.rmtree(dir_path)
                print(f"Removed previous output directory: {directory}")

    def is_internal_link(self, url):
        parsed = urlparse(url)
        return parsed.netloc == self.domain or parsed.netloc == ""

    def is_media_file(self, url):
        media_extensions = {
            ".jpg",
            ".jpeg",
            ".png",
            ".gif",
            ".svg",
            ".pdf",
            ".mp4",
            ".mp3",
            ".avi",
            ".mov",
            ".zip",
            ".webp",
            ".woff",
            ".woff2",
            ".ttf",
            ".ico",
        }
        path = urlparse(url).path.lower()
        return any(path.endswith(ext) for ext in media_extensions)

    def is_asset_file(self, url):
        asset_extensions = {".css", ".js"}
        path = urlparse(url).path.lower()
        return any(path.endswith(ext) for ext in asset_extensions)

    def normalize_url(self, url):
        parsed = urlparse(url)
        normalized = urlunparse(
            (
                parsed.scheme,
                parsed.netloc,
                parsed.path.rstrip("/") or "/",
                "",
                "",
                "",
            )
        )
        return normalized

    def get_slug_from_url(self, url):
        parsed = urlparse(url)
        path = parsed.path.strip("/")

        if not path:
            return "index"

        slug = path.replace("/", "--")
        slug = re.sub(r"\.(html?|php|asp|aspx)$", "", slug, flags=re.IGNORECASE)
        slug = re.sub(r"[^\w\-]", "-", slug)
        slug = re.sub(r"-+", "-", slug)
        slug = slug.strip("-")

        return slug or "index"

    def extract_links(self, soup, current_url):
        links = set()

        for link in soup.find_all("a", href=True):
            href = link["href"]
            absolute_url = urljoin(current_url, href)

            if self.is_media_file(absolute_url):
                continue

            if not self.is_internal_link(absolute_url):
                continue

            normalized = self.normalize_url(absolute_url)
            links.add(normalized)

        return links

    def save_markdown(self, url, content):
        slug = self.get_slug_from_url(url)
        filename = f"{slug}.md"
        filepath = os.path.join(self.md_dir, filename)

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(f"# Source: {url}\n\n")
            f.write(content)

        print(f"Saved markdown: {filename}")
        return filepath

    def save_html(self, url, html_content):
        slug = self.get_slug_from_url(url)
        filename = f"{slug}.html"
        filepath = os.path.join(self.html_dir, filename)

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(html_content)

        print(f"Saved HTML: {filename}")
        return filepath

    def download_asset(self, asset_url):
        if asset_url in self.downloaded_assets:
            return

        try:
            if not asset_url.startswith("http"):
                asset_url = urljoin(self.base_url, asset_url)

            if not self.is_internal_link(asset_url):
                return

            parsed = urlparse(asset_url)
            path = parsed.path.strip("/")

            if not path:
                return

            filepath = os.path.join(self.html_dir, path)
            os.makedirs(os.path.dirname(filepath), exist_ok=True)

            response = self.session.get(asset_url, timeout=30)
            response.raise_for_status()

            with open(filepath, "wb") as f:
                f.write(response.content)

            self.downloaded_assets.add(asset_url)
            print(f"Downloaded asset: {path}")

        except Exception as e:
            print(f"Error downloading asset {asset_url}: {e}")

    def download_page_assets(self, soup):
        for link in soup.find_all("link", href=True):
            if link.get("rel") and "stylesheet" in link.get("rel"):
                self.download_asset(link["href"])

        for script in soup.find_all("script", src=True):
            self.download_asset(script["src"])

    def save_sitemap(self):
        if not self.crawled_pages:
            print("No HTML pages crawled, skipping sitemap generation.")
            return

        sitemap_path = os.path.join(self.html_dir, "sitemap.xml")
        timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

        lines = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ]

        for page_url in sorted(self.crawled_pages):
            lines.extend(
                [
                    "  <url>",
                    f"    <loc>{escape(page_url)}</loc>",
                    f"    <lastmod>{timestamp}</lastmod>",
                    "  </url>",
                ]
            )

        lines.append("</urlset>")

        with open(sitemap_path, "w", encoding="utf-8") as sitemap_file:
            sitemap_file.write("\n".join(lines) + "\n")

        print(f"Saved sitemap: {sitemap_path}")

    def crawl_page(self, url):
        try:
            print(f"Crawling: {url}")
            response = self.session.get(url, timeout=30)
            response.raise_for_status()

            content_type = response.headers.get("content-type", "").lower()
            if "html" not in content_type:
                print(f"Skipping non-HTML content: {content_type}")
                return

            self.save_html(url, response.text)
            self.crawled_pages.add(url)

            soup = BeautifulSoup(response.text, "html.parser")
            self.download_page_assets(soup)

            new_links = self.extract_links(soup, url)
            for link in new_links:
                if link not in self.visited:
                    self.to_visit.add(link)

            soup_for_md = BeautifulSoup(response.text, "html.parser")

            for element in soup_for_md(["script", "style", "noscript", "iframe"]):
                element.decompose()

            markdown_content = self.h.handle(str(soup_for_md))
            self.save_markdown(url, markdown_content)

        except requests.RequestException as e:
            print(f"Error crawling {url}: {e}")
        except Exception as e:
            print(f"Unexpected error for {url}: {e}")

    def crawl(self):
        print(f"Starting crawl of {self.base_url}")
        print(f"HTML output directory: {self.html_dir}")
        print(f"Markdown output directory: {self.md_dir}")
        print("-" * 60)

        while self.to_visit:
            url = self.to_visit.pop()

            if url in self.visited:
                continue

            self.visited.add(url)
            self.crawl_page(url)
            time.sleep(0.5)

        print("-" * 60)
        print(f"Crawl complete! Processed {len(self.visited)} pages.")
        print(f"HTML files saved in: {self.html_dir}/")
        print(f"Markdown files saved in: {self.md_dir}/")
        self.save_sitemap()


def run_versioned_crawl(
    base_url: str,
    *,
    root: Path,
    versions_dir_name: str,
    html_dir_name: str,
    md_dir_name: str,
    no_promote: bool = False,
    diff_against_canonical: bool = False,
) -> None:
    versions_dir = (root / versions_dir_name).resolve()
    manifest = load_manifest(versions_dir)
    versions = manifest.get("versions", [])
    previous_id = versions[-1]["id"] if versions else None

    new_id = new_version_id()
    snap = versions_dir / new_id
    version_html = (snap / "html").resolve()
    version_md = (snap / "md").resolve()

    print(f"Versioned crawl; snapshot id: {new_id}")
    print(f"Archive directory: {snap}")
    if previous_id:
        print(f"Diff baseline: {previous_id}")
    else:
        print("No previous snapshot (first run or empty manifest).")

    spider = AndetagSpider(
        base_url,
        html_dir=str(version_html),
        md_dir=str(version_md),
        reset_output=True,
    )
    spider.crawl()

    changelog_path = snap / "MIGRATION_CHANGELOG.md"
    canonical_html = (root / html_dir_name).resolve()
    canonical_md = (root / md_dir_name).resolve()

    if diff_against_canonical:
        if not canonical_html.is_dir() or not canonical_md.is_dir():
            raise SystemExit(
                f"Cannot diff against canonical: missing {html_dir_name}/ or {md_dir_name}/ "
                f"under {root}"
            )
        prev_label = f"canonical {html_dir_name}/ + {md_dir_name}/"
        write_migration_changelog_file(
            changelog_path,
            previous_id=prev_label,
            new_id=new_id,
            base_url=base_url,
            prev_html=canonical_html,
            prev_md=canonical_md,
            new_html=version_html,
            new_md=version_md,
        )
    elif previous_id:
        prev_snap = versions_dir / previous_id
        prev_html = prev_snap / "html"
        prev_md = prev_snap / "md"
        if not prev_html.is_dir() or not prev_md.is_dir():
            print(
                f"Warning: previous snapshot {previous_id} missing html/ or md/; "
                "changelog will treat missing side as empty."
            )
        write_migration_changelog_file(
            changelog_path,
            previous_id=previous_id,
            new_id=new_id,
            base_url=base_url,
            prev_html=prev_html if prev_html.is_dir() else Path("/nonexistent"),
            prev_md=prev_md if prev_md.is_dir() else Path("/nonexistent"),
            new_html=version_html,
            new_md=version_md,
        )
    else:
        html_diff = categorize_tree_diff(Path("/nonexistent"), version_html)
        md_diff = categorize_tree_diff(Path("/nonexistent"), version_md)
        text = format_migration_changelog(
            previous_id=None,
            new_id=new_id,
            base_url=base_url,
            html_diff=html_diff,
            md_diff=md_diff,
        )
        changelog_path.write_text(text + "\n", encoding="utf-8")

    if no_promote:
        print(
            f"Skipping promotion to {html_dir_name}/ and {md_dir_name}/ (--no-promote)."
        )
    else:
        print(f"Promoting snapshot to canonical {html_dir_name}/ and {md_dir_name}/ ...")
        promote_snapshot_to_canonical(version_html, version_md, canonical_html, canonical_md)

    entry = {
        "id": new_id,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "base_url": base_url.rstrip("/"),
        "changelog": "MIGRATION_CHANGELOG.md",
    }
    versions.append(entry)
    manifest["versions"] = versions
    save_manifest(versions_dir, manifest)

    print(f"Wrote migration changelog: {changelog_path}")
    print(f"Updated manifest: {versions_dir / MANIFEST_NAME}")


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Crawl andetag.museum into HTML + Markdown mirrors.",
    )
    p.add_argument(
        "--legacy",
        action="store_true",
        help="Write only site-html/ and site-md/ (no crawl-versions archive, diff, or changelog).",
    )
    p.add_argument(
        "--base-url",
        default="https://www.andetag.museum",
        help="Site origin to crawl (default: https://www.andetag.museum).",
    )
    p.add_argument(
        "--versions-dir",
        default="crawl-versions",
        help="Directory under repo root for versioned snapshots (default: crawl-versions).",
    )
    p.add_argument(
        "--html-dir",
        default="site-html",
        help="Canonical HTML output directory (default: site-html).",
    )
    p.add_argument(
        "--md-dir",
        default="site-md",
        help="Canonical Markdown output directory (default: site-md).",
    )
    p.add_argument(
        "--no-promote",
        action="store_true",
        help="Keep site-html/ and site-md/ unchanged; only write crawl-versions/<id>/ and manifest.",
    )
    p.add_argument(
        "--diff-against-canonical",
        action="store_true",
        help="Write MIGRATION_CHANGELOG.md vs existing --html-dir/--md-dir trees instead of the prior snapshot.",
    )
    return p.parse_args(argv)


def main(argv: list[str] | None = None) -> None:
    args = parse_args(argv)
    root = repo_root()

    if args.legacy:
        spider = AndetagSpider(
            args.base_url,
            html_dir=str((root / args.html_dir).resolve()),
            md_dir=str((root / args.md_dir).resolve()),
            reset_output=True,
        )
        spider.crawl()
        return

    run_versioned_crawl(
        args.base_url,
        root=root,
        versions_dir_name=args.versions_dir,
        html_dir_name=args.html_dir,
        md_dir_name=args.md_dir,
        no_promote=args.no_promote,
        diff_against_canonical=args.diff_against_canonical,
    )


if __name__ == "__main__":
    main()
