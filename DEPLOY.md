# Deploy to Netlify in 5 minutes

## Prerequisites

- GitHub account (free)
- Netlify account (free, sign up with GitHub)

## Steps

### 1. Create a GitHub repo

```bash
# Clone this repo folder locally, or download it as a ZIP
cd schema-recommender

# Initialize Git
git init
git add .
git commit -m "Schema recommender tool"

# Create a new repo on GitHub.com (don't initialise with README)
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/schema-recommender.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Netlify

1. Go to https://netlify.com, sign in with GitHub
2. Click **"Add new site"** → **"Import an existing project"**
3. Select your `schema-recommender` repo
4. Hit **Deploy**

Done. Your site is live at a `.netlify.app` URL.

### 3. Test it

1. Open your new Netlify site URL
2. Paste some URLs (e.g., from a Screaming Frog export)
3. Click **Classify pages**
4. Click **Generate rich markup** on a page
   - Should fetch the page and extract title, metas, H1, H2, footer, body
   - Review the content, click **Generate**
   - Claude creates the rich JSON-LD
5. Export CSV or report

## That's it!

The serverless function is live. Every time someone clicks "Generate rich markup", it calls `/.netlify/functions/fetch-page` on your Netlify site, which fetches the page server-side (no CORS issues), extracts the content, and sends it back to the artifact.

### Next steps (optional)

- **Add a custom domain** — Netlify dashboard → Site settings → Domain management
- **Set up CI/CD** — Push to GitHub, Netlify auto-deploys
- **Add authentication** — If you want to lock this down, add Netlify Identity or basic auth
- **Monitor function calls** — Netlify dashboard → Functions → Usage

### Costs

Everything runs on the Netlify free tier:
- Static site hosting: free
- 125,000 serverless function invocations/month: free
- No data transfer charges

You'll never hit the limits for agency use.

## Need help?

See README.md for full documentation.
