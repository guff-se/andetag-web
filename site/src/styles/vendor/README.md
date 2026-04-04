# Vendored third-party CSS

## `brevo-sib-styles.css`

- **Upstream:** `https://sibforms.com/forms/end-form/build/sib-styles.css` (Brevo / Sendinblue end-form styles).
- **Why vendored:** Deterministic build, no extra network request at runtime, and local patches (see header comment in the file) so defaults such as `.entry__field { background: #fff }` do not fight ANDETAG transparent wrappers.
- **Consumed by:** `WaitlistFormEmbed.astro` via `import` (bundled with the site CSS; **not** a separate `<link>` to the CDN).

To update: fetch the current upstream file, re-apply the patches documented in the file header, run `npm run build`, and verify the waitlist on `/en/berlin/` (or the page that embeds the form).
