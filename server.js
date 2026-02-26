const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ── Proxy endpoint: receives image + site from browser, calls Anthropic server-side ──
app.post('/api/search', async (req, res) => {
  const { imageBase64, imageType, site, notes } = req.body;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY environment variable is not set. Add it in Replit Secrets.' });
  }
  if (!imageBase64 || !site) {
    return res.status(400).json({ error: 'Missing imageBase64 or site in request.' });
  }

  let domain = site;
  try { domain = new URL(site).hostname.replace('www.', ''); } catch {}

  const notesLine = notes ? `\nUser hints (use these to refine): ${notes}` : '';

  const PROMPT = `You are a world-class AI product finder with web search. Find the product in this image on ${site}.
${notesLine}

=== PHASE 1: IMAGE ANALYSIS ===
Study every detail even if blurry or low resolution:
- Product category (shoe, phone, bag, shirt, etc.)
- Visible brand name, logo, trademark
- Colors, material, texture, finish
- Shape, design, distinctive features
- Any text, numbers, model codes visible
- Make your best guess at brand + product name

=== PHASE 2: WEB IDENTIFICATION ===
Use web search to confirm the product. Run multiple searches:
1. "[category] [color] [brand guess] [key feature]"
2. "[brand] [product line]"
3. Any text seen in the image
Confirm the exact product name and model.

=== PHASE 3: FIND ON ${domain} ===
Search the target website with multiple approaches:
1. "[confirmed product name] site:${domain}"
2. "[brand] [model] ${domain}"
3. "${domain} [product category] [brand]"

=== PHASE 4: EXTRACT ===
Collect all details from the listing.

Return ONLY raw valid JSON, no markdown, no backticks, no explanation:
{
  "productName": "full name as listed on the site",
  "brand": "brand name",
  "model": "model/variant",
  "description": "2-3 sentence description",
  "price": "current price e.g. $49.99 or ₦45,000",
  "originalPrice": "was/original price if on sale else null",
  "availability": "In Stock / Out of Stock / Limited",
  "rating": "e.g. 4.5/5 · 2341 ratings or null",
  "paymentOptions": ["all payment methods found on the site"],
  "productUrl": "direct URL to the product listing",
  "imageUrl": "product image URL from the site or null",
  "seller": "seller name if marketplace",
  "shipping": "shipping details",
  "keyFeatures": ["up to 5 key features"],
  "site": "${site}",
  "matchType": "Exact match / Closest match / Best available",
  "searchNote": "one sentence: what you identified and how you found it on ${domain}"
}`;

  try {
    const anthropicResp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-beta': 'web-search-2025-03-05',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: imageType || 'image/jpeg', data: imageBase64 } },
            { type: 'text', text: PROMPT }
          ]
        }]
      })
    });

    const data = await anthropicResp.json();

    // Pass Anthropic's response straight to the browser
    res.json(data);

  } catch (err) {
    console.error('Anthropic fetch error:', err);
    res.status(500).json({ error: err.message || 'Failed to reach Anthropic API' });
  }
});

// Catch-all: serve index.html for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Snapfind running on port ${PORT}`);
});
