# Dream Square Properties — Multipage Website

Static HTML, CSS and JavaScript website for Dream Square Properties.

## Pages
- `index.html` — Home
- `projects.html` — All projects
- `project-details.html?id=...` — Reusable project detail page
- `about.html` — About the company
- `contact.html` — Contact and enquiry form
- `site-visit.html` — Site visit request form (opens WhatsApp; not a confirmed booking)
- `emi-calculator.html` — EMI estimate calculator

## Quick start
1. Extract the ZIP.
2. Open `index.html` in a browser. For best results, use VS Code + the Live Server extension.
3. Replace the sample logo in `assets/images/logo.png` if needed.
4. Edit `assets/js/projects.js` to add or update project details.
5. Update contact information in `assets/js/site-config.js`.
6. Add project photos to `assets/images/projects/` and brochure PDFs to `assets/brochures/`, then update the relevant paths in `projects.js`.

## Important setup before publishing
- Replace the sample phone number `919999999999` in `assets/js/site-config.js` with the real WhatsApp number, including country code and no `+` sign.
- Replace the placeholder address, email, phone, and social links.
- Replace sample testimonials and all sample project details with verified company information.
- The map is a placeholder search for Chennai. Update the embed URL in `contact.html` to the actual office or project location.
- Sample project prices, availability, amenities, distances, testimonials and brochure links are placeholders. Do not publish them as factual claims.
- No backend or database is included. Project management is intentionally file-based: edit `assets/js/projects.js`. This is easy to maintain, but updates require redeploying the website.
- Enquiry forms use WhatsApp as the destination; there is no email/database lead storage.
- Ensure you have permission to use every image, brochure, testimonial and claim.

## Hosting
Works on Netlify, GitHub Pages, Cloudflare Pages, or any static web host. If deploying to a static host, upload the contents of this folder or connect the repository.

## Brand colours
Royal blue `#123D9B`, sky blue `#078DD0`, red `#D71936`, yellow `#FFD323`, purple `#81518D`.
