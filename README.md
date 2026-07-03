# Lunex Displays website

Static site (HTML/CSS/JS). To run locally:

    python -m http.server 8123

Then open http://localhost:8123

## Before going live
- Replace `YOUR_WEB3FORMS_ACCESS_KEY` in index.html (get a free key at web3forms.com) so the quote + catalog forms email you.
- Replace placeholder phone `+16309406069`, email `info@lunexdisplays.com`, and social URLs.
- Set your real domain in sitemap.xml, robots.txt and the og:/schema tags (currently lunexdisplays.com).
- Paste GA4 + Meta Pixel IDs in the analytics block in each page's <head> and uncomment.

## Deploy (Netlify, free)
Drag this folder onto app.netlify.com/drop, or connect a Git repo. netlify.toml is included.
