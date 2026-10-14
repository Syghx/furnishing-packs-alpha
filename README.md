# Furnishing Packs — Website Alpha

A photo based website concept for **Furnishing Packs**, prepared by Ghaith for company review. The alpha demonstrates browsing furniture packs, comparing configurations and preparing a quote enquiry.

**Status:** alpha demonstration. The quote form prepares an email draft; it has no connected submission service, database or checkout. This repository contains the current `furnishing-packs-rooms` version from the supplied project.

**Repository:** <https://github.com/Syghx/furnishing-packs-alpha> (private; company reviewers need an invitation).

## Why the 3D model was removed

The 3D room/furniture model was intentionally removed because it added loading delays without providing enough useful value for this alpha. The current version focuses on room photographs, product images, clear pack selection and the quote journey.

The earlier `furnishing-packs-3d` experiment is excluded from this handover. The retained `js/hero-gl.js` file applies a WebGL transition to **2D photographs**; it does not load or display a 3D furniture model. No before/after performance benchmark is claimed.

## What the alpha demonstrates

- Nine furniture ranges: Malvern, Alba, Ives, Chevron, Hoxton, Madrid, Scandi, Leon and Oliver.
- Five customer sectors: landlords and letting, HMO, serviced accommodation, student lets, and social housing/supported living.
- Pack details, room galleries, product photographs and an interactive catalogue.
- Bedroom/configuration choices and multiple properties in a quote.
- Item additions/removals recorded for the company to price and confirm.
- Base pack subtotal, VAT at the configured 20% rate and total including VAT.
- A preferred delivery week, copyable quote and contact form that opens an email draft.
- Responsive layouts, keyboard controls and reduced-motion handling in the existing interface.

Prices and product data are a snapshot in `js/data.js`, whose source comments record a check on 12 October 2026. They are not fetched live. The company should confirm pricing, availability, delivery wording and product details before a public release.

## Run it on your computer

### Requirements

- A current desktop browser, such as Edge, Chrome, Firefox or Safari.
- **Python 3** for the simple local preview commands below. Download it from [python.org](https://www.python.org/downloads/) if needed. Any static HTTP server can also serve these files.
- Internet access for the externally hosted photographs, fonts and optional smooth-scroll library.

The site uses plain HTML, CSS and JavaScript modules. It needs no npm installation, build step, API keys, environment file or database.

### 1. Download the source

On the GitHub repository page, choose **Code → Download ZIP**, then extract it. Open a terminal in the extracted folder containing `index.html`, `js` and this README.

Accept the owner's GitHub invitation and sign in before downloading. Developers with Git installed can instead clone the repository:

```bash
git clone https://github.com/Syghx/furnishing-packs-alpha.git
cd furnishing-packs-alpha
```

### 2. Start a local web server

**Windows — PowerShell:**

```powershell
py -3 -m http.server 5181 --bind 127.0.0.1
```

If your Python installation provides `python` rather than `py`, use:

```powershell
python -m http.server 5181 --bind 127.0.0.1
```

**macOS / Linux — Terminal:**

```bash
python3 -m http.server 5181 --bind 127.0.0.1
```

### 3. Open the website

Open **<http://127.0.0.1:5181/>** in your browser. Keep the terminal running while reviewing. Press **Ctrl+C** in the terminal when finished.

Serve the folder over HTTP rather than opening `index.html` by double-clicking: the JavaScript files use browser modules. The preview server serves only this computer; it does not publish the website online.

## Suggested company review

1. Switch furniture ranges in the opening section and inspect a room gallery.
2. Change the customer sector and bedroom configuration; compare the displayed base price.
3. Add a pack to the quote, adjust the property quantity and inspect subtotal, VAT and total.
4. Add or remove a furniture piece. Check that the quote records the changes for confirmation; item changes do not have individually calculated prices.
5. Choose a preferred delivery week and try **Copy quote**.
6. Review the catalogue and resize the browser to a mobile width.

The contact form uses the company's actual email address. Submitting opens a draft in the reviewer's configured email application; the reviewer must send it themselves. A local mail application may not be configured. Copying the quote is an alternative.

## Alpha limitations

- **Email handoff:** there is no server-side enquiry handling, delivery confirmation or receipt tracking. The on-page confirmation cannot establish whether an email was sent.
- **Quote state:** selections are held in memory and reset on refresh. There is no saved customer account or order history.
- **Customisation:** item changes are described for review; the displayed total covers base packs before those changes.
- **Delivery selection:** choosing a week expresses a preference; it does not reserve stock or book delivery.
- **External assets:** photographs load from `cdn-furnishingpacks.b-cdn.net`, fonts from Google Fonts, and Lenis 1.1.13 from `unpkg.com`. Images are not bundled for offline use. The code includes native scrolling and a static hero-photo fallback.
- **Release configuration:** canonical URLs, structured data, `robots.txt` and `sitemap.xml` still refer to the company's existing domain. Review them for the eventual hosting destination before publishing.

## Project files

| File or folder | Purpose |
| --- | --- |
| `index.html` | Page markup, inline styles, metadata and dialogs |
| `js/data.js` | Furniture ranges, prices, sectors, image paths and data helpers |
| `js/main.js` | Navigation, galleries, catalogue, quote builder and email handoff |
| `js/hero-gl.js` | Photo transition renderer, with no 3D model |
| `brand/` | Local SVG brand assets and the supplied logo reference page |
| `robots.txt`, `sitemap.xml` | Existing crawl metadata |
| `docs/COMPANY_HANDOVER.md` | Access steps, review brief and message for the company |
| `docs/GITHUB_UPLOAD.md` | Maintainer's Windows upload instructions for Syghx |
| `docs/VALIDATION.md` | Checks performed and the limits of verification |

Edit content and base pricing in `js/data.js`. The form recipient is also hard-coded in `index.html` and `js/main.js`; changing the exported `CONTACT` object alone will not update every contact link.

## Troubleshooting

| Symptom | Action |
| --- | --- |
| Python command is not recognised | Install Python 3, reopen the terminal, and retry `py -3` or `python` on Windows |
| A directory listing appears | Stop the server and start it in the folder that directly contains `index.html` |
| Page appears but controls do not work | Use the HTTP address above, enable JavaScript, and check the browser console |
| Port 5181 is already in use | Replace `5181` with `5182` in the server command and browser address |
| Photographs or fonts are missing | Check internet access and whether the asset domains are blocked |
| No email draft opens | Use Copy quote, or configure the computer's default email application |

Local-server reference: [Python `http.server` documentation](https://docs.python.org/3/library/http.server.html).
