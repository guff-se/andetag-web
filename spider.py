#!/usr/bin/env python3
"""
Web spider to crawl andetag.museum and save content as markdown files.
"""

import os
import re
import time
import requests
from urllib.parse import urljoin, urlparse, urlunparse
from bs4 import BeautifulSoup
import html2text
from pathlib import Path
from datetime import datetime, timezone
from xml.sax.saxutils import escape

class AndetagSpider:
    def __init__(self, base_url, html_dir="site-html", md_dir="site-md"):
        self.base_url = base_url.rstrip('/')
        self.domain = urlparse(base_url).netloc
        self.html_dir = html_dir
        self.md_dir = md_dir
        self.visited = set()
        self.to_visit = {self.normalize_url(base_url)}
        self.crawled_pages = set()
        self.downloaded_assets = set()  # Track downloaded CSS/JS files
        
        # Create output directories
        Path(html_dir).mkdir(exist_ok=True)
        Path(md_dir).mkdir(exist_ok=True)
        
        # Configure html2text
        self.h = html2text.HTML2Text()
        self.h.ignore_links = False  # Keep links
        self.h.ignore_images = True  # Ignore images
        self.h.ignore_emphasis = False
        self.h.body_width = 0  # Don't wrap lines
        self.h.skip_internal_links = False
        
        # Session for requests
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })
    
    def is_internal_link(self, url):
        """Check if URL is within the same domain."""
        parsed = urlparse(url)
        return parsed.netloc == self.domain or parsed.netloc == ''
    
    def is_media_file(self, url):
        """Check if URL points to a media file (excluding CSS/JS which we want to download)."""
        media_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.svg', '.pdf', 
                          '.mp4', '.mp3', '.avi', '.mov', '.zip', '.webp',
                          '.woff', '.woff2', '.ttf', '.ico'}
        path = urlparse(url).path.lower()
        return any(path.endswith(ext) for ext in media_extensions)
    
    def is_asset_file(self, url):
        """Check if URL points to a CSS or JS file."""
        asset_extensions = {'.css', '.js'}
        path = urlparse(url).path.lower()
        return any(path.endswith(ext) for ext in asset_extensions)
    
    def normalize_url(self, url):
        """Normalize URL by removing fragments and query params."""
        parsed = urlparse(url)
        # Keep path but remove fragment and query
        normalized = urlunparse((
            parsed.scheme,
            parsed.netloc,
            parsed.path.rstrip('/') or '/',
            '',  # params
            '',  # query (removed for deduplication, but we'll keep in links)
            ''   # fragment
        ))
        return normalized
    
    def get_slug_from_url(self, url):
        """Extract a filename slug from URL."""
        parsed = urlparse(url)
        path = parsed.path.strip('/')
        
        if not path:
            return 'index'
        
        # Replace slashes with hyphens for nested paths
        slug = path.replace('/', '--')
        
        # Remove file extensions if present
        slug = re.sub(r'\.(html?|php|asp|aspx)$', '', slug, flags=re.IGNORECASE)
        
        # Clean up the slug
        slug = re.sub(r'[^\w\-]', '-', slug)
        slug = re.sub(r'-+', '-', slug)
        slug = slug.strip('-')
        
        return slug or 'index'
    
    def extract_links(self, soup, current_url):
        """Extract all internal links from the page."""
        links = set()
        
        for link in soup.find_all('a', href=True):
            href = link['href']
            
            # Make absolute URL
            absolute_url = urljoin(current_url, href)
            
            # Skip if media file
            if self.is_media_file(absolute_url):
                continue
            
            # Skip if external
            if not self.is_internal_link(absolute_url):
                continue
            
            # Normalize for deduplication
            normalized = self.normalize_url(absolute_url)
            links.add(normalized)
        
        return links
    
    def save_markdown(self, url, content):
        """Save page content as markdown file."""
        slug = self.get_slug_from_url(url)
        filename = f"{slug}.md"
        filepath = os.path.join(self.md_dir, filename)
        
        # Handle duplicate filenames
        counter = 1
        while os.path.exists(filepath):
            filename = f"{slug}-{counter}.md"
            filepath = os.path.join(self.md_dir, filename)
            counter += 1
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(f"# Source: {url}\n\n")
            f.write(content)
        
        print(f"Saved markdown: {filename}")
        return filepath
    
    def save_html(self, url, html_content):
        """Save original HTML file."""
        slug = self.get_slug_from_url(url)
        filename = f"{slug}.html"
        filepath = os.path.join(self.html_dir, filename)
        
        # Handle duplicate filenames
        counter = 1
        while os.path.exists(filepath):
            filename = f"{slug}-{counter}.html"
            filepath = os.path.join(self.html_dir, filename)
            counter += 1
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        print(f"Saved HTML: {filename}")
        return filepath
    
    def download_asset(self, asset_url):
        """Download and save CSS or JS file locally."""
        if asset_url in self.downloaded_assets:
            return
        
        try:
            # Make URL absolute if needed
            if not asset_url.startswith('http'):
                asset_url = urljoin(self.base_url, asset_url)
            
            # Skip if external
            if not self.is_internal_link(asset_url):
                return
            
            parsed = urlparse(asset_url)
            path = parsed.path.strip('/')
            
            if not path:
                return
            
            # Create subdirectories if needed
            filepath = os.path.join(self.html_dir, path)
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            
            # Download the asset
            response = self.session.get(asset_url, timeout=30)
            response.raise_for_status()
            
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            self.downloaded_assets.add(asset_url)
            print(f"Downloaded asset: {path}")
            
        except Exception as e:
            print(f"Error downloading asset {asset_url}: {e}")
    
    def download_page_assets(self, soup):
        """Download all CSS and JS files linked in the page."""
        # Download CSS files
        for link in soup.find_all('link', href=True):
            if link.get('rel') and 'stylesheet' in link.get('rel'):
                self.download_asset(link['href'])
        
        # Download JS files
        for script in soup.find_all('script', src=True):
            self.download_asset(script['src'])

    def save_sitemap(self):
        """Write sitemap.xml with every successfully crawled HTML page URL."""
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
            lines.extend([
                "  <url>",
                f"    <loc>{escape(page_url)}</loc>",
                f"    <lastmod>{timestamp}</lastmod>",
                "  </url>",
            ])

        lines.append("</urlset>")

        with open(sitemap_path, "w", encoding="utf-8") as sitemap_file:
            sitemap_file.write("\n".join(lines) + "\n")

        print(f"Saved sitemap: {sitemap_path}")
    
    def crawl_page(self, url):
        """Crawl a single page and extract content."""
        try:
            print(f"Crawling: {url}")
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            
            # Only process HTML content
            content_type = response.headers.get('content-type', '').lower()
            if 'html' not in content_type:
                print(f"Skipping non-HTML content: {content_type}")
                return
            
            # Save original HTML
            self.save_html(url, response.text)
            self.crawled_pages.add(url)
            
            # Parse HTML
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Download CSS and JS assets before removing them
            self.download_page_assets(soup)
            
            # Extract links for further crawling
            new_links = self.extract_links(soup, url)
            for link in new_links:
                if link not in self.visited:
                    self.to_visit.add(link)
            
            # Create a copy for markdown conversion
            soup_for_md = BeautifulSoup(response.text, 'html.parser')
            
            # Remove script and style elements for markdown version
            for element in soup_for_md(['script', 'style', 'noscript', 'iframe']):
                element.decompose()
            
            # Convert to markdown
            markdown_content = self.h.handle(str(soup_for_md))
            
            # Save the markdown version
            self.save_markdown(url, markdown_content)
            
        except requests.RequestException as e:
            print(f"Error crawling {url}: {e}")
        except Exception as e:
            print(f"Unexpected error for {url}: {e}")
    
    def crawl(self):
        """Main crawl loop."""
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
            
            # Be polite - add small delay between requests
            time.sleep(0.5)
        
        print("-" * 60)
        print(f"Crawl complete! Processed {len(self.visited)} pages.")
        print(f"HTML files saved in: {self.html_dir}/")
        print(f"Markdown files saved in: {self.md_dir}/")
        self.save_sitemap()

def main():
    spider = AndetagSpider("https://www.andetag.museum", html_dir="site-html", md_dir="site-md")
    spider.crawl()

if __name__ == "__main__":
    main()
