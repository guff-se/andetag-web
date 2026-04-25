"""Unit tests for crawl snapshot diff and changelog helpers (no network)."""

import tempfile
import unittest
from pathlib import Path

from spider import (
    categorize_tree_diff,
    format_migration_changelog,
    load_manifest,
    save_manifest,
)


class TestManifest(unittest.TestCase):
    def test_load_missing(self):
        with tempfile.TemporaryDirectory() as td:
            m = load_manifest(Path(td))
            self.assertEqual(m["versions"], [])

    def test_roundtrip(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            save_manifest(root, {"versions": [{"id": "a1", "created_at": "x"}]})
            m = load_manifest(root)
            self.assertEqual(len(m["versions"]), 1)
            self.assertEqual(m["versions"][0]["id"], "a1")


class TestTreeDiff(unittest.TestCase):
    def test_added_removed_modified(self):
        with tempfile.TemporaryDirectory() as old_d, tempfile.TemporaryDirectory() as new_d:
            old, new = Path(old_d), Path(new_d)
            (old / "keep.txt").write_text("same\n", encoding="utf-8")
            (old / "gone.txt").write_text("bye\n", encoding="utf-8")
            (old / "change.txt").write_text("v1\n", encoding="utf-8")
            (new / "keep.txt").write_text("same\n", encoding="utf-8")
            (new / "change.txt").write_text("v2\n", encoding="utf-8")
            (new / "fresh.txt").write_text("new\n", encoding="utf-8")

            d = categorize_tree_diff(old, new)
            self.assertIn("keep.txt", d["unchanged"])
            self.assertIn("gone.txt", d["removed"])
            self.assertIn("fresh.txt", d["added"])
            self.assertIn("change.txt", d["modified"])

    def test_changelog_contains_summary(self):
        with tempfile.TemporaryDirectory() as old_d, tempfile.TemporaryDirectory() as new_d:
            old, new = Path(old_d), Path(new_d)
            (new / "a.html").write_text("<p>x</p>", encoding="utf-8")
            text = format_migration_changelog(
                previous_id=None,
                new_id="20260101T000000Z",
                base_url="https://example.test",
                html_diff=categorize_tree_diff(old, new),
                md_diff=categorize_tree_diff(old, new),
            )
            self.assertIn("20260101T000000Z", text)
            self.assertIn("first archived crawl", text.lower())
            self.assertIn("Added", text)


if __name__ == "__main__":
    unittest.main()
