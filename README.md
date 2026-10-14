# Furnishing Packs — early website ideas

I've put together an early version of a few ideas I have for the [Furnishing Packs website](https://furnishingpacks.co.uk/). **This is an alpha, not a finished redesign.** I'm sharing it to show what could be possible and get feedback before deciding what to work on next.

The aim isn't to replace everything on the current site. There are things worth keeping, especially the pages for landlords, HMOs and other customer types. I want to make finding a pack, looking through the furniture and putting together a quote feel easier and more interactive.

## What I've explored

- **A more interactive homepage.** Instead of making visitors search around for the packages, they can see and switch between them straight away. The furniture is the focus from the first screen.
- **Packages for different property types.** Visitors can choose the type of property and number of bedrooms while looking at a pack. The idea is to make the choices feel more connected without losing the original site's useful pages or search visibility.
- **More freedom to customise a pack.** Customers can experiment with quantities, remove items or add furniture from another pack and see an indicative price. They get a clearer idea of what they want before speaking to the team.
- **A clearer quote journey.** After choosing a pack, customers can review the items, costs and preferred delivery week in a step-by-step flow. It should be easier to follow than jumping between different bits of information. Delivery is not booked by choosing a week.
- **A furniture catalogue.** This lets people browse the packs like a catalogue, turn pages and enlarge individual furniture photos, rather than only seeing a package overview.
- **A logo concept.** I've also included a [separate page showing the logo idea](brand/logo.html) and how it might look in different places. It's just another direction to discuss.

These are ideas shown through a working prototype, not features ready to be added to the live website. I'd particularly like feedback on whether they make the customer journey simpler.

## An idea for a possible beta

One thing I'm thinking about for later is how the **Chevron package page** connects to the quote.

Right now, clicking **Add to quote** takes you into a separate quote section. I'd like to explore making that feel like one continuous movement instead: the Chevron package image and page could shift into the lower-left part of the quote layout, while the price, selected items and delivery-week options appear alongside it.

I haven't worked out the animation or layout yet, and it might change after feedback. **It's a possible future beta idea, not something that's finished or part of this alpha.**

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
