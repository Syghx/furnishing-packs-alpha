# Handover verification

Checked on **14 October 2026** against the supplied `f.zip` archive.

## Scope

The current `furnishing-packs-rooms` application was copied into the repository root. Its existing HTML, JavaScript, SVG assets, logo reference page and crawl metadata are preserved byte for byte. Changes in this package are documentation and `.gitignore`.

The earlier `furnishing-packs-3d` and `furnishing-packs-site` experiments, machine-specific Claude launch configuration and design-tool caches are excluded. The original uploaded archive was not modified.

## Completed checks

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

The preview uses the standard-library command documented in the README. Its Windows `py -3` launcher spelling was not run on Windows in this environment.

## Verification limits

A browser executable is not installed in this execution environment. A Playwright launch was attempted and could not start for that reason. Desktop/mobile appearance, browser interactions, WebGL rendering and externally hosted asset availability have **not** been freshly verified here. No claim of a complete browser QA pass or measured performance improvement is made.

Source inspection confirms that quote submission builds a `mailto:` URL and holds quote selections in memory. No enquiry email was sent. The company handover message is a draft.

## Original snapshot on GitHub

Repository: <https://github.com/Syghx/furnishing-packs-alpha> (private).

The `original-alpha` branch points to commit `5d58fccbcc92c7a9333f4427bfaa443317af0126`. All 11 files from the supplied `furnishing-packs-rooms` folder, including its original README, were uploaded and checked against their Git blob hashes. All hashes match, with no additional or missing files.

The `main` handover uses those same 10 application/asset/metadata files, with a shorter company-facing README and separate handover documentation. Its uploaded tree is checked again after the main branch is updated. These file-integrity checks establish source preservation; they do not constitute a browser QA pass.

The company's reviewer identities have not been supplied, so repository invitations and the handover message remain pending.
