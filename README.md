# Furnishing Packs — early website ideas

I've put together an early version of a few ideas I have for the [Furnishing Packs website](https://furnishingpacks.co.uk/). **This is an alpha, not a finished redesign.** I'm sharing it to show what could be possible and get feedback before deciding what to work on next.

The team mentioned that it may be more practical to take **parts of this concept** and use them on the existing site, rather than rebuild the whole thing. That makes sense to me. There are things worth keeping, especially the pages for landlords, HMOs and other customer types. My aim is to show ways of making it easier to discover a pack, explore the furniture and put together a quote.

## What I've explored

- **A more interactive homepage.** Instead of making visitors search around for the packages, they can see and switch between them straight away. The furniture is the focus from the first screen.
- **Packages for different property types.** Visitors can choose the type of property and number of bedrooms while looking at a pack. The idea is to make the choices feel more connected without losing the original site's useful pages or search visibility.
- **More freedom to customise a pack.** Customers can experiment with quantities, remove items or add furniture from another pack and see an indicative price. They get a clearer idea of what they want before speaking to the team.
- **A clearer quote journey.** After choosing a pack, customers can review the items, costs and preferred delivery week in a step-by-step flow. It should be easier to follow than jumping between different bits of information. Delivery is not booked by choosing a week.
- **A furniture catalogue.** This lets people browse packs, turn pages and enlarge furniture photos, rather than only seeing a package overview. It could be added to the existing website as another way to explore the same products—not as a reason to remove their current product pages.
- **A logo concept.** I've also included a [separate page showing the logo idea](brand/logo.html) and how it might look in different places. It's just another direction to discuss.

These are ideas shown through a working prototype, not features ready to be added to the live website. I'd particularly like feedback on whether they make the customer journey simpler.

## How it could work with the current site

I know protecting the website's Google rankings is important. **I haven't worked with SEO in depth myself**, so this is my understanding of it rather than a technical recommendation, and I'd want someone with SEO experience to check it.

From what I understand, we don't necessarily need to remove existing pages to introduce new ways of browsing. For example, the **catalogue could sit alongside the current package pages**: customers could turn through the furniture visually and still follow normal links to the original package pages, which would keep their own addresses and useful information. The existing landlord, HMO and other sector pages could stay too. The catalogue would be an extra way in, not a replacement for pages that might already bring people from Google.

I'm also looking at how the space on the current homepage is used. To me, some areas feel quite open without immediately showing customers the actual furniture or giving them a clear next step. I'd like to use more of that first view to show the packages and let people interact with them straight away. The same goes for navigation: perhaps we can make the journey more direct instead of asking visitors to click through several places just to start exploring. **That's a design observation, not proof that the current site is losing customers**—it would need real visitor data and testing.

My interpretation is that changing the presentation doesn't have to mean throwing away the existing search structure. But keeping the same pages alone doesn't guarantee rankings either; the team would need to check performance, links, content and Google Search Console before making any live changes. [Google's guidance on JavaScript websites](https://developers.google.com/search/docs/fundamentals/get-started-developers) is a useful starting point.

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
