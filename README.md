# Furnishing Packs — early website ideas

I've put together an early version of a few ideas I have for the [Furnishing Packs website](https://furnishingpacks.co.uk/). **This is an alpha, not a finished redesign.** I'm sharing it to show what could be possible and get feedback before deciding what to work on next.

The team mentioned that it may be more practical to take **parts of this concept** and use them on the existing site, rather than rebuild the whole thing. That makes sense to me. There are things worth keeping, especially the pages for landlords, HMOs and other customer types. My aim is to show ways of making it easier to discover a pack, explore the furniture and put together a quote.

## What I've explored

- **A more interactive homepage.** Instead of making visitors search around for the packages, they can see and switch between them straight away. The furniture is the focus from the first screen.
- **Packages for different property types.** Visitors can choose the type of property and number of bedrooms while looking at a pack. The idea is to make the choices feel more connected without losing the original site's useful pages or search visibility.
- **More freedom to customise a pack.** Customers can experiment with quantities, remove items or add furniture from another pack and see an indicative price. They get a clearer idea of what they want before speaking to the team.
- **A clearer, four-step quote journey.** Instead of describing the process and then making visitors find the next action, the concept lets them **(1)** pick a package, **(2)** review their quote, **(3)** choose a preferred delivery week and **(4)** send the quote request. It's a step towards an enquiry, not an online checkout or confirmed delivery booking.
- **A furniture catalogue.** This lets people browse packs, turn pages and enlarge furniture photos, rather than only seeing a package overview. It could be added to the existing website as another way to explore the same products—not as a reason to remove their current product pages.
- **A logo concept.** I've also included a [separate page showing the logo idea](brand/logo.html) and how it might look in different places. It's just another direction to discuss.

These are ideas shown through a working prototype, not features ready to be added to the live website. I'd particularly like feedback on whether they make the customer journey simpler.

## How I think this could fit into the existing website

I understand the concern about changing the website and potentially affecting its Google rankings. The current site has clearly had a lot of work put into it, and I wouldn't want my ideas to undo any of that. **I have some understanding of SEO, but I'm still learning**, so this is just how I'm thinking about it. I'm more than happy to be corrected or learn how the team approaches it.

A good example is the current **“Choose a package”** section. On mobile, it explains what customers should do, but I wondered whether the same space could also let them *do it*. In my alpha, that idea becomes four steps: **choose a pack → see the quote → choose a preferred delivery week → send the quote request**.

I'm **not suggesting that the written information should disappear**. I know descriptions, headings, FAQs and other content may matter to visitors and to Google. My thought is that we could keep the helpful explanations, but place them alongside relevant choices, so customers can read what they need and keep moving towards an enquiry rather than scrolling through separate explanatory sections. The information would still be available to people, not hidden away just for search engines.

The catalogue is similar. I see it as **another way of browsing the same furniture**, not as a reason to remove the current product pages. Someone could still find the existing [HMO furniture packages](https://furnishingpacks.co.uk/hmo-furniture-packages/) or [Malvern package](https://furnishingpacks.co.uk/package/malvern/) through Google, read the useful information there and then choose to explore the furniture in a more visual catalogue. Existing page URLs and links could be kept as part of any integration, subject to the team's advice.

**One important distinction:** this early alpha demonstrates my layout and customer-journey ideas; it has **not** carried across or verified the live site's complete SEO setup. So I'm not claiming my version would keep the same rankings if it replaced the current site. That would need an SEO review, careful implementation and testing.

I don't know yet whether these changes would improve enquiries or customer engagement either. That's why I'm sharing them as ideas for feedback, not telling the team how the website should be built. My aim is simply to **keep what already works and explore how the experience could feel clearer and more useful for customers**.

## Possible ideas for a later beta

**A downloadable catalogue.** If the visual catalogue works well, one idea would be to let customers download a clear PDF version to share or look through offline. It would need accurate, approved product details and a way to keep it up to date. This isn't part of the current alpha.

**A smoother package-to-quote transition.** One thing I'm thinking about for later is how the **Chevron package page** connects to the quote.

Right now, clicking **Add to quote** takes you into a separate quote section. I'd like to explore making that feel like one continuous movement instead: the Chevron package image and page could shift into the lower-left part of the quote layout, while the price, selected items and delivery-week options appear alongside it.

I haven't worked out the animation or layout yet, and it might change after feedback. **Both beta ideas are only possibilities, not finished features or commitments.**

For now I'd rather hear what works, what doesn't and which ideas are actually worth taking further. Any future changes would also need proper testing, confirmed product information and care around the existing site's SEO.

## How to look around

You can [download the project from GitHub](https://github.com/Syghx/furnishing-packs-alpha) without signing in: select **Code → Download ZIP** and extract the folder.

In the folder containing `index.html`, open PowerShell and run:

```powershell
py -m http.server 8000 --bind 127.0.0.1
```

On a Mac or Linux computer, use `python3` instead of `py`. If needed, [install Python](https://www.python.org/downloads/). If port 8000 is unavailable, try port 8080 and change the browser address to match.

Open these addresses while the terminal is running:

- **Website:** http://127.0.0.1:8000/
- **Logo presentation:** http://127.0.0.1:8000/brand/logo.html

Press **Ctrl+C** in the terminal to stop the preview. The repository is public, but **the GitHub file link itself isn't a hosted website**; these local addresses only work on the computer running the preview.

## A few things to know

This is still at a very early stage. The quote button opens an email draft, not a connected ordering system. Prices, item changes and delivery arrangements would all need checking with the company. Some photos and fonts load from the internet, and the design still needs testing across devices.

I also removed the original 3D model because it slowed things down; this version uses room and furniture photos instead.

The [original alpha](https://github.com/Syghx/furnishing-packs-alpha/tree/original-alpha) is kept as a backup. There are also [validation notes](docs/VALIDATION.md) and [handover notes](docs/COMPANY_HANDOVER.md) if you want the extra detail.
