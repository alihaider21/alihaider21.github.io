# Ali Haider — Portfolio

A single-page portfolio site in plain HTML, CSS and JavaScript. It has no build step or dependencies, so any static host can serve it.

```
index.html              ← all page content
css/style.css           ← styles (light + dark theme tokens at the top)
js/main.js              ← theme toggle, mobile menu, scroll effects, copy-email
favicon.svg
assets/
  img/ali-haider.webp / .jpg          ← hero portrait
  img/og-image.jpg                    ← preview image for LinkedIn/WhatsApp/X shares
  img/apple-touch-icon.png
  og-template.html                    ← source used to render og-image.jpg
```

## Preview locally

```bash
cd ~/Documents/portfolio
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

The site is hosted on GitHub Pages from the public repo `alihaider21/alihaider21.github.io` and is live at **https://alihaider21.github.io**.

To publish changes, commit and push to `main`. Pages redeploys within a minute or two:

```bash
git add -A && git commit -m "Update portfolio" && git push
```

If the site ever stops updating, check **Settings → Pages** in the repo and make sure the source is the `main` branch, `/ (root)`.

The full URLs in the `<head>` of `index.html` (`canonical`, `og:url`, `og:image`) point at `alihaider21.github.io`. Update them if you move to a custom domain.

> The original photo (`3ef4e494-….jpeg`) and resume in the folder root are listed in `.gitignore`, so they stay on your computer and are never pushed to the public repo.

## Updating content

- **Text** (experience, projects, skills): edit `index.html`. Each section is marked with a `<!-- ==== SECTION ==== -->` comment.
- **Resume**: the three resume buttons link to the PDF on Google Drive. To update it, open the file in Drive and use **Manage versions → Upload new version**, which keeps the same link. If you share a new file instead, replace the Drive URL in `index.html` (it appears 3 times).
- **Photo**: replace both `assets/img/ali-haider.webp` and `.jpg`, using a 4:5 portrait. The green face box sits over the face in the current photo, so adjust `.bbox` (`left`, `top`, `width`, `height`) in `css/style.css` for a new one.
- **Colours**: change the tokens at the top of `css/style.css`. `--accent` and `--box` are the green.
