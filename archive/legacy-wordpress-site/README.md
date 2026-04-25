# Legacy WordPress migration mirror (archived)

Frozen **HTML and Markdown** snapshots of the pre-Astro **WordPress/Elementor** site, plus **`spider.py`** (the crawler that produced them). The live WordPress site no longer exists; this tree is **historical reference only**.

- **`site-html/`** — scraped pages, assets, and `sitemap.xml` from the old stack.
- **`site-md/`** — Markdown exports from the same crawl pipeline.
- **`spider.py`** — optional tooling if you ever need to re-run a crawl against another host (not part of normal site work).
- **`tests/`** — unit tests for spider helper functions (no network). From this directory:  
  `python3 -m venv .venv && .venv/bin/pip install -r requirements.txt && PYTHONPATH=. .venv/bin/python -m unittest discover -s tests`

Per-shell **title** and **meta description** for the live site live in **`site/src/data/page-shell-meta.json`** (curated in-repo). The **`site-html/`** tree here is a historical snapshot only, not a build input.
