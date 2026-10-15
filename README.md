# Furnishing Packs — Website Ideas (Early Alpha)

This is a **very early concept**, not a finished website. I've been exploring ways to make choosing furniture and requesting a quote more interactive. The team could use **individual ideas on the existing website** rather than replace it. I'd appreciate feedback on what's useful and what isn't.

## What's new in v2

- **One continuous stage:** the pack page and the order steps now feel like one page. Scroll on, or press **Next step**: the pack zooms out, its name travels into step 1, the bedroom settles into "Ready to let" and the living room becomes the backdrop.
- **Step 1 confirms the pack:** a tick on its photo, then **Add more packs** or **View the catalogue**.
- **VAT both ways:** every pack price shows "ex VAT · £1,980 inc VAT", for VAT-registered businesses and private landlords alike.
- **A quote you can keep and share:** it stays on your device for 30 days, can be saved as a PDF on letterhead, and shows delivery, assembly and packaging removal as £0.00 in the sums.
- **Smaller fixes:** nothing pops up over the page, quote lines read in full on phones, the confirmation says "Press send in your email", and each sofa appears once in the catalogue.

To view v2, choose the **v2** branch on GitHub before **Code → Download ZIP**. The first alpha remains on `main`.

## What I've explored

- **Homepage:** Show the packages straight away, with room photos and an easy way to switch between them. My idea is to make better use of the first screen.
- **Pack selection:** Change the property type and number of bedrooms while browsing, so customers can quickly find what's relevant.
- **Furniture catalogue:** Browse packs visually, turn pages and enlarge furniture photos. This could sit alongside the existing product pages.
- **Multiple packs and customisation:** Add several packages to one quote, change quantities and mix in individual pieces from other packs. The alpha shows indicative pack totals; item changes still need pricing confirmed.
- **Four-step quote journey:** **Pick a pack → Review the quote → Choose a preferred delivery week → Send the request.** Customers can **copy the whole quote**—including packages, furniture quantities and a reference number—rather than typing it out themselves. The aim is to make enquiries and follow-ups easier.
- **Logo:** A separate [logo concept](brand/logo.html) for feedback, and a [PDF of the logo](brand/Furnishing-Packs-logo.pdf) with the full name and the doorway mark on its own.

## How this might fit the current site

I understand the concern about protecting the site's **SEO and Google rankings**. I'm still learning that side of things, so this is my understanding, not a technical recommendation.

For example, the current **“Choose a package”** section explains what to do. I wondered if that space could also let customers start choosing a pack and move naturally towards a quote. **I'm not suggesting removing the useful wording, FAQs or existing pages.** The explanations could stay accessible alongside the interactive steps, with links to the original pages.

Someone finding the [HMO packages](https://furnishingpacks.co.uk/hmo-furniture-packages/) or [Malvern](https://furnishingpacks.co.uk/package/malvern/) through Google could still use those pages, then explore the same furniture through the catalogue. That's the idea: **keep what's working and improve the browsing experience**.

The alpha **has not preserved or tested the full site's SEO setup**, and I can't promise it would protect rankings. Any live changes would need the team's SEO review and testing.

## Ideas for a possible beta

- **Downloadable catalogue:** A PDF customers could save or share, with approved product details.
- **Actual, easy-to-update pricing:** Use the company's confirmed prices for packages and individual furniture items, so customisations update the quote accurately. I'd also explore a simple way for the team to maintain prices without having to change the website code each time.
- **Smoother pack-to-quote transition:** Explore whether the Chevron package view could flow into the quote steps in one continuous motion instead of feeling like separate sections.

Neither is built or agreed for development yet.

## How to view it

The [GitHub repository](https://github.com/Syghx/furnishing-packs-alpha) is public. Choose **Code → Download ZIP**, extract it, and open a terminal in the folder containing `index.html`.

**Windows (with Python installed):**
```powershell
py -m http.server 8000 --bind 127.0.0.1
```

**Mac / Linux:** use `python3` in place of `py`. Then open:

- Website: http://127.0.0.1:8000/
- Logo page: http://127.0.0.1:8000/brand/logo.html

If port 8000 is unavailable, try 8080 in both the command and address. Press **Ctrl+C** to stop the server. GitHub shows the source files; it does not automatically host a live preview.

**Please note:** This is for feedback only. The quote opens an email draft, not a live ordering system. The alpha's reference number is temporary, not a saved quote that the team can retrieve later. Prices, delivery options and changes to packs still need company confirmation. More technical detail is in the [validation notes](docs/VALIDATION.md).
