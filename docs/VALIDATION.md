# Handover verification

Checked on **14 October 2026**: first against the supplied `f.zip` archive, then again in a browser for the latest update.

## Scope

The current `furnishing-packs-rooms` application is at the repository root: its HTML, JavaScript, SVG assets, logo reference page and crawl metadata. The earlier `furnishing-packs-3d` and `furnishing-packs-site` experiments, machine-specific Claude launch configuration and design-tool caches are excluded. The original uploaded archive was not modified.

## Latest update

Before this update, all 10 application, asset and metadata files on `main` were byte-identical to the working preview (Git blob hashes compared).

Running the repository copy in a browser found one script error, which is fixed in `js/main.js` (three lines). The catalogue read its page position by dividing by its own width. When the page loads while it is not displayed (as happened in a hidden browser pane), that width is zero, so the catalogue stopped before sizing itself. It now keeps its place until it has a width. No other application file differs from the `original-alpha` branch.

| Check | Result |
| --- | --- |
| Local files | Served locally, every local file returned HTTP 200: scripts, logo SVGs, logo page, `robots.txt` and `sitemap.xml`; no image failed to load |
| Script errors | One found and fixed (above); none after the fix, including when the catalogue is hidden and the window resized |
| Quote | Malvern, one-bedroom apartment: £1,650.00 + £330.00 VAT = £1,980.00; adding it again does not add a second line, and the catalogue's button reads "In your quote" |
| Catalogue | Cover and contents, then nine packs; turning to Malvern names Oliver as the next pack; all 86 photographs open the enlarged view on the matching picture |
| Delivery week | 54 choices; choosing one updates step 4 and its hint |
| Logo page | Loads with all 13 logo images and no console messages |

## First upload checks

| Check | Result |
| --- | --- |
| JavaScript syntax | Passed for `js/data.js`, `js/main.js` and `js/hero-gl.js` using Node.js 24.19.0 |
| Local source preservation | All 10 retained application/asset/metadata files match the supplied rooms version |
| HTML references | Every local `src`, file `href` and fragment target in the main page resolves |
| Data module loading | Passed; nine ranges and five sectors load, and sector pack IDs resolve |
| Sample base price | Malvern, one-bedroom apartment: £1,650 + £330 VAT = £1,980 |
| Model files | No `.glb`, `.gltf`, `.fbx`, `.obj` or `.blend` assets are included |
| Local preview | Python 3.12 served the documented folder on `127.0.0.1:5181` |
| HTTP responses | Main page, JavaScript, local brand assets and crawl metadata returned HTTP 200 with the expected bytes |
| Obvious credential patterns | No GitHub token, common API-key or private-key marker was found in the retained source |

The Windows `py -3` launcher spelling in the README was not run.

## Verification limits

The browser checks ran in a Chromium-based browser pane  while it was narrow and hidden, so animation smoothness and visual appearance were not judged in that pass. The 86-photograph check ran on the identical working files at 1614 px wide. Safari, Firefox and real phones were not tested, and no performance was measured.

Quote submission builds a `mailto:` email draft and holds quote selections in memory. No enquiry email was sent. The company handover message is a draft.

## Original snapshot on GitHub

Repository: <https://github.com/Syghx/furnishing-packs-alpha> (public as of 15 October 2026).

The `original-alpha` branch points to commit `5d58fccbcc92c7a9333f4427bfaa443317af0126` and is unchanged. Its 11 files from the supplied `furnishing-packs-rooms` folder, including its original README, were checked against their Git blob hashes when uploaded.

The repository is public, so invitations are no longer required to view or download the source. The company handover message remains a draft.
