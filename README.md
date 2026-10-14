# Furnishing Packs — Website & Logo Concept

An alpha website by **Ghaith**, showing ideas to refresh the Furnishing Packs website and logo. It is a demonstration for company review and feedback.

Repository: <https://github.com/Syghx/furnishing-packs-alpha> (private; reviewers need access).

## My ideas for the current website

Starting point: [the existing Furnishing Packs website](https://furnishingpacks.co.uk/). This prototype shows how the following ideas could be integrated into it:

1. **An interactive landing page.** Visitors see the furniture packages immediately, explore room photographs and switch between packs from the opening section.
2. **Browsing for each customer type.** Homes to let, HMOs, serviced accommodation, student lets and social housing: the customer type sits in the price line, and one tap changes it, with that type's packs and prices. During integration, retain the existing sector pages, URLs and useful content as search entry points; Google rankings would need monitoring.
3. **A quote that builds step by step.** Choose a pack, see the quote, pick a delivery week and send it; each step leads to the next. Customers can change quantities, add or remove individual items and bring in pieces from another pack. A pack already in the quote is never offered twice, and every line adds up to a subtotal, VAT at 20% and a total. Item changes are recorded for the team to price and confirm.
4. **A furniture catalogue, page by page.** Every pack, every piece and every price, turned like a printed catalogue. Any photograph enlarges with a click, and each pack can be added to the quote from its own page.
5. **A refreshed logo.** The logo page explains the proposed mark, its design thinking and variations.

## What to try

- Switch packs on the opening photograph, then scroll into the pack below it.
- Tap the customer type in the price line (for example *home to let*) to see another type's packs.
- Add a pack, then follow **Next** through the four steps to the quote.
- Open **Catalogue** in the menu, turn the pages and click any photograph.

## Open the website locally

1. On GitHub, choose **Code → Download ZIP**, then extract it.
2. Open a terminal in the extracted folder containing `index.html` and this README. Install [Python 3](https://www.python.org/downloads/) if needed.
3. Start the preview using the command for your computer:

**Windows — PowerShell:**

```powershell
py -3 -m http.server 5181 --bind 127.0.0.1
```

If Windows recognises `python` instead of `py`, use `python -m http.server 5181 --bind 127.0.0.1`.

**macOS / Linux:**

```bash
python3 -m http.server 5181 --bind 127.0.0.1
```

Then open:

- **Website:** <http://127.0.0.1:5181/>
- **Logo and design explanation:** <http://127.0.0.1:5181/brand/logo.html>

Keep the terminal running while reviewing. Press **Ctrl+C** when finished. Use the local address above rather than double-clicking `index.html`, so the interactive JavaScript loads correctly.

## About this alpha

The **3D model was removed** because it added loading delays without enough useful value. This version focuses on room and product photographs. The small WebGL hero effect transitions between flat photographs; it does not display a 3D model.

Internet access is needed for externally hosted photographs and fonts. The quote form opens an email draft rather than submitting to a connected enquiry system. Item changes, prices and delivery arrangements remain subject to confirmation.

`main` holds the latest version. The first upload is preserved unchanged on the [original-alpha backup branch](https://github.com/Syghx/furnishing-packs-alpha/tree/original-alpha). Checks and changes are recorded in [docs/VALIDATION.md](docs/VALIDATION.md); reviewer access and the handover message are in [docs/COMPANY_HANDOVER.md](docs/COMPANY_HANDOVER.md).
