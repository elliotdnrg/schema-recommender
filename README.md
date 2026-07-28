# Schema Recommender — Netlify Deployment

A self-contained schema markup recommendation tool that fetches and analyses client pages, classifies by type, and generates rich JSON-LD with Anthropic's Claude API.

## Features

- Manual URL paste or auto-crawl via sitemap.xml
- Rule-based page type detection, with AI fallback for unclear pages
- Filter results by recommended Schema.org type
- Per-page rich markup generator (fetches live page content via serverless backend)
- Export to CSV or DNRG-branded HTML report

## Repo Structure

```
netlify-deploy/
├── public/
│   └── schema-recommender.html      Static artifact
├── netlify/
│   └── functions/
│       └── fetch-page.js            Serverless function (CORS proxy)
├── netlify.toml                     Netlify config
├── .gitignore
└── README.md
```

## Quick Deploy to Netlify

### 1. Push to GitHub

```bash
cd netlify-deploy
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/schema-recommender.git
git push -u origin main
```

### 2. Connect to Netlify

1. Go to [netlify.com](https://netlify.com) and sign in with GitHub
2. Click **"Add new site"** → **"Import an existing project"**
3. Select your `schema-recommender` repository
4. Build settings should auto-fill:
   - **Build command:** (leave empty, it will use the default from netlify.toml)
   - **Publish directory:** `public`
5. Click **"Deploy site"**

Netlify will deploy in seconds. Your site will be live at something like `https://your-site-name.netlify.app`.

### 3. Configure environment variables (optional)

If you want to add rate limiting or request logging later, you can set env vars in the Netlify dashboard under **Site settings** → **Build & deploy** → **Environment**.

## How It Works

1. **User enters URLs** — paste manually or attempt auto-crawl from a root domain
2. **Pages are classified** — rules first (fast), AI fallback for ambiguous pages
3. **"Generate rich markup" button**:
   - Calls `/.netlify/functions/fetch-page` (serverless function)
   - Function fetches the page server-side (no CORS limits)
   - Extracts: title, meta description, OG tags, H1/H2, footer, body copy
   - User can review/edit before generating
   - Claude API generates rich, nested JSON-LD
4. **Filter by schema type** — view all Product pages, all Services, etc. at once
5. **Export** — CSV or DNRG-branded HTML report

## Fetching Pages

The serverless function in `netlify/functions/fetch-page.js`:

- Runs on Netlify's servers (no CORS limits)
- Fetches the requested URL with a User-Agent header
- Extracts: `<title>`, meta tags, H1/H2, footer, body copy
- Returns clean HTML to the artifact
- Handles errors gracefully (timeouts, 4xx/5xx, invalid URLs)

If a fetch fails (site blocks requests, times out, etc.), the tool falls back to manual paste. Nothing breaks.

## Using the Tool

1. **Paste URLs** — one per line, or paste a Screaming Frog export (tab-separated Address / Title)
2. **Classify pages** — rules and AI run automatically
3. **Filter by schema type** (optional) — select from dropdown to see all pages of one type
4. **Generate rich markup** (per page):
   - Click button → function fetches live page content
   - Review/edit the extracted content in the textarea
   - Click **Generate** → Claude produces nested, specific JSON-LD
   - Pages with generated markup get a "Rich (custom)" badge
5. **Export** — CSV with all JSON-LD, or DNRG-styled HTML report

## API Keys

The tool uses the **Anthropic Claude API**. Make sure you have:

- An Anthropic API key set up in your browser/environment
- The API calls are made *from the browser* (artifact code), not from the serverless function
- If you want to authenticate differently, you can modify the artifact to pass an API key and update the Netlify function to validate it

## Customisation

### Add more page type rules

Edit `public/schema-recommender.html`, find the `RULES` array around line 140, and add new rules:

```javascript
{
  key: 'new-type',
  label: 'New Page Type',
  urlKw: ['keyword1', 'keyword2'],
  titleKw: ['title keyword1'],
  schemaTypes: ['SomeSchema', 'AlternativeSchema'],
  notes: 'Implementation guidance...',
  example: (url, title) => ({...})
}
```

### Modify fetch extraction

Edit `netlify/functions/fetch-page.js` to pull additional page elements or modify how the HTML is parsed.

## Troubleshooting

**"Could not fetch this page"** — Most likely a CORS or timeout issue. The serverless function is working, but the target site is:
- Blocking the User-Agent
- Taking too long to respond (8-second timeout)
- Returning an error (check browser DevTools Network tab)

**No content extracted** — The page structure may not have standard elements (title, meta, H1/H2, footer). Paste details manually instead.

**Netlify deploy fails** — Check the deploy logs in the Netlify dashboard. Make sure `netlify.toml` is in the repo root and `public/` folder exists.

## Free Tier Limits

- Netlify Functions: 125,000 invocations/month free (more than enough)
- Each function call can fetch a page in ~1-2 seconds
- No database, no cost for storage or bandwidth

You're good to go forever on the free tier for agency use.
