# Furnishing Packs — Website Improvement Concepts

**VERY EARLY ALPHA · CONCEPT FOR REVIEW · NOT A FINISHED WEBSITE**

Created by **Ghaith** to explore ideas for the [existing Furnishing Packs website](https://furnishingpacks.co.uk/). This is an early, experimental prototype: its layout, interactions, content and technical implementation are **not final**. It is intended to show design thinking, invite feedback and help decide what—if anything—should move forward.

**The intention is to build on the existing website, not discard it.** Furnishing Packs already has package listings, customer-sector pages and a quotation service. These concepts look at making the journey from exploring a pack to requesting a quote more visual, flexible and connected.

## What's new in this alpha — and why

| Concept demonstrated | Purpose | How it builds on the existing website |
| --- | --- | --- |
| **Interactive landing page** | Make the available packages visible immediately, with room imagery and quick switching between packs. | Goes beyond a conventional introduction and package listing by inviting customers to explore from the opening screen. |
| **Customer-type and bedroom selection** | Let visitors change their property type and bedroom count while exploring relevant packs and indicative prices. | Brings choices closer to the package itself; the current site's valuable HMO, landlord, serviced-accommodation, student and social-housing pages would still be retained. |
| **Customisable package and quote** | Explore changing quantities, adding or removing individual items, and combining pieces while seeing an indicative subtotal, VAT and total. | Makes possible adjustments visible during the journey rather than relying solely on contacting the team to discuss changes. |
| **Guided quote journey** | Present the chosen pack, quote summary, preferred delivery week and enquiry action as understandable steps. | Builds on the existing choose-a-pack → request-a-quote → arrange-delivery process by giving customers a clearer visual overview. A chosen week is **a preference, not a confirmed booking**. |
| **Visual furniture catalogue** | Let customers browse packages, inspect individual furniture photographs and move from the catalogue into a quote. | Adds a more exploratory, close-up product experience alongside the existing package pages. |
| **Logo and identity exploration** | Show one possible direction for a refreshed visual identity. | A design proposal only—not a replacement or an approved rebrand. |

These are **alpha demonstrations, not finished features or measured improvements**. Pricing, catalogue information, interactions and the customer journey would all need review before commercial use.

## What reviewers can try

1. Switch packages on the opening screen and change the customer type or bedroom count.
2. Explore a package, adjust its contents and follow the quote steps.
3. Open the catalogue, turn its pages and enlarge the furniture photographs.
4. Visit the [logo concept page](brand/logo.html).

Feedback is most useful on **clarity, ease of navigation, package presentation and whether the ideas would genuinely help customers**.

## What I'm planning to do next — possible beta idea

**A direction to explore later, not something built in this alpha.**

This idea connects the **Chevron package view** and the **quote journey**, which currently appear as separate parts of the experience.

One possible future improvement is a **single, continuous transition** between them. After a customer selects *Add to quote*, the Chevron package presentation could smoothly move and settle into the **lower-left area of the quote layout**, while the quote summary and preferred delivery-week steps appear around it. Instead of feeling like a jump to another page, the two stages would feel like **one connected motion**.

This is only the initial idea. The animation, positioning, mobile behaviour, accessibility and performance implications have **not been designed or resolved**. Company feedback may change the approach completely.

### Possible next steps — subject to feedback

1. **Review the alpha:** Identify which concepts are useful, confusing or unnecessary.
2. **Refine the strongest ideas:** Confirm accurate product data, responsive design, usability and accessibility.
3. **Scope any beta:** Consider the seamless package-to-quote transition and real enquiry/quote integrations only if worthwhile.
4. **Protect what already works:** Preserve existing customer-sector content, useful URLs and search visibility; any SEO impact would need evaluation rather than assumptions.

**No final scope, delivery date or implementation approach has been agreed.**

## How to open the prototype

1. With repository access, choose **Code → Download ZIP** on GitHub and extract it.
2. Open a terminal in the extracted folder containing `index.html`.
3. Run the command for your operating system.

**Windows (PowerShell):**

```powershell
py -m http.server 8000 --bind 127.0.0.1
```

**macOS / Linux:**

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

If Python is not installed, see [python.org](https://www.python.org/downloads/). On Windows, if `python` works but `py` does not, replace `py` with `python`. If port 8000 is blocked, try 8080 and use that port in the address.

Open **http://127.0.0.1:8000/** in your browser. The [logo concept](brand/logo.html) is also available from the site. Keep the terminal open while reviewing; press **Ctrl+C** to stop the server.

## Important alpha limitations

- **Not live or production-ready.** The quotation action prepares an email draft; it does not submit to a connected enquiry or ordering system.
- **Prices and availability are not guaranteed.** Package contents, customisations, VAT calculations and delivery arrangements need company validation and confirmation.
- **Visuals are for exploration.** The 3D furniture model was removed due to loading costs; the prototype uses product/room photography and a lightweight visual transition instead.
- Some photographs and fonts need an internet connection. Full cross-device testing, accessibility review and performance assessment are still outstanding.

This repository is **private**; reviewers need GitHub access. The untouched first upload remains on the [original-alpha branch](https://github.com/Syghx/furnishing-packs-alpha/tree/original-alpha). More detailed checks are in [validation notes](docs/VALIDATION.md) and reviewer instructions in [company handover](docs/COMPANY_HANDOVER.md).

**The purpose of this alpha is to start a useful discussion about possibilities—not to present a completed solution.**
