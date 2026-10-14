# GitHub access and future updates

Repository: <https://github.com/Syghx/furnishing-packs-alpha>.

Owner: **Syghx**. Visibility: **public**. The alpha is prepared for the `main` branch.

## Company reviewers

No GitHub account or invitation is needed. Open the public repository, choose **Code → Download ZIP**, extract it, and follow [the README](../README.md) to run the website and logo presentation locally. Reviewers do not need Git or GitHub CLI for the ZIP download route.

For access and a draft message to the company, see [Company handover](COMPANY_HANDOVER.md).

## Maintainer: update the existing repository from Windows

GitHub CLI was successfully authenticated as Syghx during setup. Its full executable path avoids the earlier PowerShell command lookup problem:

```powershell
& "C:\Program Files\GitHub CLI\gh.exe" auth status
git --version
```

Confirm that GitHub CLI reports **Syghx**. Git must also be installed; GitHub CLI and Git are separate tools. If Git is missing, install it from [git-scm.com](https://git-scm.com/downloads/win), then reopen your terminal.

If you have not cloned the published repository, open PowerShell in the parent folder where you want to keep it and run:

```powershell
git clone https://github.com/Syghx/furnishing-packs-alpha.git
cd furnishing-packs-alpha
```

If you already have that clone open in Claude Code, use its project terminal. Pull the latest changes before editing:

```powershell
git pull --ff-only
```

Edit `README.md` or the website files in that clone, then inspect your changes:

```powershell
git status --short
git diff
```

For a README-only change, run:

```powershell
git add README.md
git commit -m "Update alpha README"
git push
```

Run each command separately and check that it succeeds before continuing. For changes to other files, stage those intended files as well.

If Git requests an author identity, configure your actual name and preferred GitHub commit email for this repository, then repeat the commit:

```powershell
git config user.name "YOUR NAME"
git config user.email "YOUR GITHUB COMMIT EMAIL"
```

## Edit the README in the browser

You can add or update a README after the initial upload. In this repository, open `README.md`, choose the pencil/edit action, make your changes, review the preview and commit them. Future local work should pull those browser changes before editing.

## Verify access and publication

```powershell
& "C:\Program Files\GitHub CLI\gh.exe" repo view Syghx/furnishing-packs-alpha --json nameWithOwner,url,visibility,defaultBranchRef
& "C:\Program Files\GitHub CLI\gh.exe" repo view Syghx/furnishing-packs-alpha --web
```

Confirm the owner is Syghx, visibility is PUBLIC and the default branch is main. Check that the README renders and `index.html`, `js` and `brand` are present. Making the repository public lets anyone browse/download the source; it does not automatically host a working website. Only publish a browser preview separately if that is wanted.

References: [GitHub CLI authentication status](https://cli.github.com/manual/gh_auth_status), [repository viewing](https://cli.github.com/manual/gh_repo_view), and [Git configuration](https://git-scm.com/docs/git-config).
