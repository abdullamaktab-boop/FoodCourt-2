# FoodCourt-2

Responsive restaurant menu website for **FoodCourt** with manager-only menu editing.

> Region target: **KRG, Iraq** (pricing should be shown in **IQD**).

## Included files
- `index.html`
- `styles.css`
- `script.js`

## Features
- Sectioned menu for:
  - Burger Factory
  - MeatMe Mexicano
  - Baristo
  - Tablos Bakery
  - Pizzaria
- Manager login
- Add / edit / delete menu items
- Upload item photos
- Mobile-friendly layout
- `localStorage` persistence
- IQD currency display

## Demo manager credentials
- Username: `manager`
- Password: `foodcourt123`

## Hosting (straightforward)
### Option A: GitHub Pages (fastest)
1. Push this project to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch `main` and folder `/ (root)`.
5. Save. Your website will be live in about 1–2 minutes.

### Option B: Netlify (drag-and-drop)
1. Open [https://app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag the project folder (`index.html`, `styles.css`, `script.js`) into the page.
3. Netlify gives you a live URL immediately.

## Important for production use
- Current manager login is **frontend-only** and not secure for real-world public use.
- For a fully secure manager workflow, add a backend (for example: Supabase/Firebase/Node API) with:
  - Real authentication
  - Database-backed menu items
  - Server-side protected image storage

## Why files may not appear on GitHub
If GitHub only shows `.gitkeep`, your local commits were likely not pushed to the remote default branch.

Use:

```bash
git remote add origin <your-repo-url>   # if origin is missing
git push -u origin work                 # pushes current branch
git push origin work:main               # updates main with this branch
```

Or open a Pull Request from `work` to `main` and merge.
