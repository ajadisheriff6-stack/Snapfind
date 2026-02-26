import { useState, useRef, useCallback } from "react";

const STEPS = [
  "▶ Reading visual details from image...",
  "▶ Identifying brand, model & category...",
  "▶ Running deep web search queries...",
  "▶ Finding listing on your chosen store...",
  "▶ Extracting price & payment info...",
  "▶ Compiling full product details...",
];

const QUICK_SITES = [
  { label: "Amazon", url: "https://amazon.com" },
  { label: "Walmart", url: "https://walmart.com" },
  { label: "eBay", url: "https://ebay.com" },
  { label: "Target", url: "https://target.com" },
  { label: "AliExpress", url: "https://aliexpress.com" },
  { label: "Jumia NG", url: "https://jumia.com.ng" },
  { label: "Konga", url: "https://konga.com" },
  { label: "Jiji NG", url: "https://jiji.ng" },
];

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0a0c; --surf: #111114; --bdr: #1e1e24; --bdr2: #2e2e3a;
    --amber: #f5a623; --amber-dim: #a86e12; --amber-glow: rgba(245,166,35,0.10);
    --text: #e8e8f0; --muted: #5a5a72; --green: #3ddc97; --red: #ff5f5f; --r: 6px;
  }
  body { background: var(--bg); color: var(--text); font-family: 'Segoe UI', system-ui, sans-serif; min-height: 100vh; }

  /* HEADER */
  header { display:flex; align-items:center; justify-content:space-between; padding:16px 28px; border-bottom:1px solid var(--bdr); background:rgba(10,10,12,0.95); position:sticky; top:0; z-index:50; backdrop-filter:blur(10px); }
  .logo { font-size:22px; font-weight:800; letter-spacing:2px; color:var(--amber); font-family:Georgia,serif; cursor:pointer; }
  .logo span { color:var(--text); }
  .tagline { font-family:monospace; font-size:11px; color:#3a3a4a; letter-spacing:1.5px; text-transform:uppercase; }
  .hdr-btn { background:transparent; border:1px solid var(--bdr2); color:var(--muted); font-size:11px; padding:7px 14px; border-radius:var(--r); cursor:pointer; font-family:monospace; letter-spacing:1px; text-transform:uppercase; transition:all 0.15s; }
  .hdr-btn:hover { border-color:var(--amber); color:var(--amber); }

  /* MAIN */
  main { max-width:940px; margin:0 auto; padding:44px 20px 80px; }

  /* HERO */
  .hero { text-align:center; margin-bottom:44px; }
  .hero h1 { font-size:clamp(44px,9vw,88px); font-weight:800; line-height:1.05; letter-spacing:-1px; }
  .hero em { color:var(--amber); font-style:normal; }
  .hero p { margin-top:12px; color:var(--muted); font-size:15px; }

  /* CARD */
  .card { background:var(--surf); border:1px solid var(--bdr); border-radius:12px; overflow:hidden; }
  .card-hdr { padding:16px 24px; border-bottom:1px solid var(--bdr); display:flex; align-items:center; gap:10px; }
  .badge { font-family:monospace; font-size:10px; color:var(--amber); background:var(--amber-glow); border:1px solid var(--amber-dim); padding:3px 10px; border-radius:20px; }
  .card-title { font-size:13px; color:var(--muted); }
  .form-grid { display:grid; grid-template-columns:1fr 1fr; }
  @media(max-width:600px){ .form-grid { grid-template-columns:1fr; } }

  /* UPLOAD */
  .upload-zone { border-right:1px solid var(--bdr); padding:28px 22px; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:260px; cursor:pointer; transition:background 0.2s; position:relative; }
  @media(max-width:600px){ .upload-zone { border-right:none; border-bottom:1px solid var(--bdr); } }
  .upload-zone:hover, .upload-zone.drag { background:var(--amber-glow); }
  .upload-zone input { position:absolute; inset:0; opacity:0; cursor:pointer; width:100%; height:100%; }
  .up-icon { width:50px; height:50px; border:2px dashed var(--bdr2); border-radius:10px; display:flex; align-items:center; justify-content:center; margin-bottom:14px; transition:border-color 0.2s; }
  .upload-zone:hover .up-icon { border-color:var(--amber); }
  .up-text { text-align:center; color:var(--muted); font-size:13px; line-height:1.7; }
  .up-text strong { color:var(--text); display:block; font-size:14px; font-weight:600; margin-bottom:2px; }
  .preview-img { max-width:150px; max-height:150px; object-fit:contain; border-radius:8px; border:1px solid var(--bdr); background:#fff; }
  .preview-name { font-family:monospace; font-size:11px; color:var(--green); margin-top:9px; text-align:center; }
  .change-hint { font-family:monospace; font-size:11px; color:var(--muted); margin-top:6px; }

  /* CONTROLS */
  .right-panel { padding:24px; display:flex; flex-direction:column; gap:18px; }
  label { display:block; font-family:monospace; font-size:11px; color:var(--muted); letter-spacing:1px; text-transform:uppercase; margin-bottom:7px; }
  input[type=url], input[type=text] { width:100%; background:var(--bg); border:1px solid var(--bdr2); color:var(--text); font-family:monospace; font-size:13px; padding:11px 13px; border-radius:var(--r); outline:none; transition:border-color 0.2s, box-shadow 0.2s; }
  input:focus { border-color:var(--amber); box-shadow:0 0 0 3px var(--amber-glow); }
  input::placeholder { color:var(--muted); }
  .quick-sites { display:flex; flex-wrap:wrap; gap:6px; margin-top:9px; }
  .qs { font-family:monospace; font-size:11px; color:var(--muted); border:1px solid var(--bdr2); padding:4px 10px; border-radius:20px; cursor:pointer; background:transparent; transition:all 0.15s; }
  .qs:hover { border-color:var(--amber); color:var(--amber); background:var(--amber-glow); }
  .search-btn { width:100%; padding:14px; border-radius:var(--r); border:none; cursor:pointer; font-size:18px; font-weight:800; letter-spacing:2px; font-family:Georgia,serif; background:var(--amber); color:#000; transition:all 0.2s; margin-top:auto; }
  .search-btn:hover:not(:disabled) { background:#f7b740; box-shadow:0 6px 20px rgba(245,166,35,0.3); transform:translateY(-1px); }
  .search-btn:disabled { background:var(--bdr2); color:var(--muted); cursor:not-allowed; transform:none; box-shadow:none; }
  .search-btn.loading { background:var(--amber-dim) !important; cursor:wait !important; transform:none !important; }

  /* LOADER */
  .loader { margin-top:24px; background:var(--surf); border:1px solid var(--bdr); border-radius:12px; padding:40px 28px; display:flex; flex-direction:column; align-items:center; gap:16px; }
  .bar-wrap { width:100%; max-width:280px; height:2px; background:var(--bdr); border-radius:2px; overflow:hidden; }
  .bar { height:100%; background:linear-gradient(90deg,var(--amber-dim),var(--amber)); border-radius:2px; animation:scan 1.8s ease-in-out infinite; }
  .loader-txt { font-family:monospace; font-size:12px; color:var(--muted); }
  .loader-step { font-family:monospace; font-size:12px; color:var(--amber); animation:blink 1.2s ease-in-out infinite; }

  /* RESULT */
  .result-card { margin-top:24px; background:var(--surf); border:1px solid var(--bdr); border-radius:12px; overflow:hidden; }
  .res-head { background:linear-gradient(90deg,rgba(61,220,151,0.07),transparent); padding:16px 24px; border-bottom:1px solid var(--bdr); display:flex; align-items:center; justify-content:space-between; }
  .pdot { width:8px; height:8px; border-radius:50%; background:var(--green); display:inline-block; margin-right:9px; animation:pulse 1.5s infinite; }
  .res-head-txt { font-family:monospace; font-size:12px; color:var(--green); }
  .match-badge { font-family:monospace; font-size:10px; padding:3px 9px; border-radius:12px; border:1px solid var(--bdr2); color:var(--muted); }
  .res-body { padding:24px; }
  .res-grid { display:grid; grid-template-columns:170px 1fr; gap:24px; margin-bottom:20px; }
  @media(max-width:500px){ .res-grid { grid-template-columns:1fr; } }
  .res-img { width:170px; max-height:200px; object-fit:contain; border-radius:8px; border:1px solid var(--bdr); background:#fff; }
  .res-img-ph { width:170px; height:170px; border-radius:8px; border:1px solid var(--bdr); background:var(--bg); display:flex; align-items:center; justify-content:center; font-size:36px; }
  .res-name { font-size:19px; font-weight:700; line-height:1.3; margin-bottom:6px; }
  .res-meta { font-family:monospace; font-size:11px; color:var(--muted); margin-bottom:14px; }
  .res-price { font-family:Georgia,serif; font-size:44px; font-weight:800; color:var(--amber); line-height:1; }
  .res-orig { font-family:monospace; font-size:12px; color:var(--red); text-decoration:line-through; margin-top:3px; }
  .res-desc { font-size:13px; color:var(--muted); line-height:1.7; margin-top:10px; }
  .divider { border:none; border-top:1px solid var(--bdr); margin:18px 0; }
  .det-row { display:flex; gap:14px; padding:8px 0; border-bottom:1px solid var(--bdr); }
  .det-row:last-child { border-bottom:none; }
  .dk { font-family:monospace; font-size:11px; color:var(--muted); min-width:100px; flex-shrink:0; padding-top:1px; }
  .dv { font-size:13px; color:var(--text); line-height:1.6; }
  .dv.g { color:var(--green); }
  .dv.r { color:var(--red); }
  .pay-sect { margin-top:18px; }
  .sect-lbl { font-family:monospace; font-size:11px; color:var(--muted); text-transform:uppercase; letter-spacing:1.5px; margin-bottom:10px; }
  .tag-list { display:flex; flex-wrap:wrap; gap:7px; }
  .tag { border:1px solid var(--bdr2); padding:5px 12px; border-radius:var(--r); font-family:monospace; font-size:12px; color:var(--text); background:var(--bg); }
  .act-row { display:flex; gap:10px; margin-top:20px; flex-wrap:wrap; align-items:center; }
  .btn-view { background:var(--amber); color:#000; border:none; padding:11px 20px; font-family:monospace; font-size:13px; font-weight:700; border-radius:var(--r); cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; gap:7px; transition:all 0.2s; }
  .btn-view:hover { background:#f7b740; box-shadow:0 4px 16px rgba(245,166,35,0.3); }
  .btn-ghost { background:transparent; color:var(--muted); border:1px solid var(--bdr2); padding:11px 18px; font-family:monospace; font-size:12px; border-radius:var(--r); cursor:pointer; transition:all 0.2s; }
  .btn-ghost:hover { border-color:var(--amber); color:var(--amber); }
  .search-note { font-family:monospace; font-size:11px; color:var(--muted); margin-top:14px; padding-top:12px; border-top:1px solid var(--bdr); }

  /* ERROR */
  .err-box { margin-top:24px; background:rgba(255,95,95,0.05); border:1px solid rgba(255,95,95,0.2); border-radius:12px; padding:22px 26px; }
  .err-h { color:var(--red); font-size:15px; margin-bottom:10px; font-weight:600; }
  .err-code { font-family:monospace; font-size:11px; background:var(--bg); padding:10px 14px; border-radius:4px; margin-top:10px; color:var(--red); border:1px solid var(--bdr); word-break:break-all; white-space:pre-wrap; }
  .err-tips { margin-top:14px; padding-top:12px; border-top:1px solid rgba(255,95,95,0.15); font-size:12px; color:var(--muted); line-height:2.2; }

  /* HISTORY PANEL */
  .overlay { position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:190; backdrop-filter:blur(3px); }
  .hist-panel { position:fixed; top:0; right:0; height:100vh; width:320px; max-width:100vw; background:var(--surf); border-left:1px solid var(--bdr); z-index:200; display:flex; flex-direction:column; }
  .hp-hdr { padding:18px 20px; border-bottom:1px solid var(--bdr); display:flex; align-items:center; justify-content:space-between; }
  .hp-title { font-family:Georgia,serif; font-size:18px; font-weight:700; color:var(--amber); letter-spacing:1px; }
  .close-btn { background:none; border:none; color:var(--muted); cursor:pointer; font-size:18px; padding:4px; }
  .close-btn:hover { color:var(--text); }
  .hp-list { flex:1; overflow-y:auto; padding:12px; display:flex; flex-direction:column; gap:8px; }
  .hp-empty { text-align:center; color:var(--muted); font-family:monospace; font-size:12px; margin-top:60px; line-height:2.4; }
  .hp-item { background:var(--bg); border:1px solid var(--bdr); border-radius:8px; padding:12px 14px; cursor:pointer; transition:border-color 0.2s; }
  .hp-item:hover { border-color:var(--amber-dim); }
  .hp-nm { font-size:13px; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:2px; }
  .hp-site { font-family:monospace; font-size:11px; color:var(--muted); margin-bottom:3px; }
  .hp-price { font-family:monospace; font-size:14px; color:var(--amber); font-weight:600; }
  .hp-date { font-family:monospace; font-size:10px; color:var(--muted); margin-top:4px; }
  .hp-clr { margin:0 12px 12px; background:none; border:1px solid rgba(255,95,95,0.2); color:rgba(255,95,95,0.5); font-family:monospace; font-size:11px; padding:9px; border-radius:var(--r); cursor:pointer; transition:all 0.2s; }
  .hp-clr:hover { border-color:var(--red); color:var(--red); }

  footer { text-align:center; padding:24px; border-top:1px solid var(--bdr); font-family:monospace; font-size:11px; color:#3a3a4a; line-height:2.2; }

  @keyframes scan { 0%{width:0;margin-left:0} 50%{width:100%;margin-left:0} 100%{width:0;margin-left:100%} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.2} }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
`;

export default function App() {
  const [imgB64, setImgB64] = useState(null);
  const [imgType, setImgType] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [imgName, setImgName] = useState(null);
  const [site, setSite] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [showHist, setShowHist] = useState(false);
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sf_hist") || "[]"); } catch { return []; }
  });
  const fileRef = useRef();

  const processFile = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target.result;
      setImgSrc(src);
      setImgB64(src.split(",")[1]);
      setImgType(file.type || "image/jpeg");
      setImgName(file.name);
    };
    reader.readAsDataURL(file);
  }, []);

  const onDrop = (e) => {
    e.preventDefault(); setDragging(false);
    if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
  };

  const saveToHistory = (product) => {
    const updated = [{ ...product, _at: new Date().toISOString() }, ...history].slice(0, 50);
    setHistory(updated);
    try { localStorage.setItem("sf_hist", JSON.stringify(updated)); } catch {}
  };

  const canSearch = imgB64 && site.trim();

  const doSearch = async () => {
    if (!canSearch || loading) return;
    setLoading(true); setResult(null); setError(null); setStepIdx(0);

    let domain = site;
    try { domain = new URL(site).hostname.replace("www.", ""); } catch {}

    const timer = setInterval(() => setStepIdx(i => (i + 1) % STEPS.length), 2400);

    const notesLine = notes ? `\nUser hints (use these): ${notes}` : "";

    const PROMPT = `You are a world-class AI product finder with web search. Find the product in this image on ${site}.
${notesLine}

=== PHASE 1: IMAGE ANALYSIS ===
Study every detail even if blurry or low resolution. Extract ALL clues:
- Product category (shoe, phone, bag, shirt, electronics, etc.)
- Brand name, logo, trademark (even partial)
- Colors, materials, textures, finish
- Shape, design, distinctive features
- Any visible text, numbers, model codes
- Make your absolute best brand + product identification

=== PHASE 2: WEB IDENTIFICATION ===
Use web search to confirm identity. Run multiple searches:
1. "[category] [color] [brand guess] [key feature]"
2. "[brand] [product line]"
3. Any text or codes seen in the image

=== PHASE 3: FIND ON ${domain} ===
Search target website multiple ways:
1. "[product name] site:${domain}"
2. "[brand] [model] ${domain}"
3. "${domain} [category] [brand]"

=== PHASE 4: EXTRACT DETAILS ===
Get: name, brand, price, availability, payment options, shipping, rating, features, URL, image URL.

Return ONLY valid raw JSON, no markdown, no backticks:
{
  "productName": "full name as listed",
  "brand": "brand name",
  "model": "model/variant",
  "description": "2-3 sentence description",
  "price": "current price e.g. $49.99",
  "originalPrice": "was price if on sale else null",
  "availability": "In Stock / Out of Stock / Limited",
  "rating": "e.g. 4.5/5 · 2341 ratings or null",
  "paymentOptions": ["all payment methods found"],
  "productUrl": "direct URL to product listing",
  "imageUrl": "product image URL or null",
  "seller": "seller name if available",
  "shipping": "shipping details and delivery estimate",
  "keyFeatures": ["up to 5 features"],
  "site": "${site}",
  "matchType": "Exact match / Closest match / Best available",
  "searchNote": "what you identified and how you found it"
}`;

    try {
      // Call OUR proxy at /api/search — not Anthropic directly
      const resp = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: [{
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: imgType, data: imgB64 } },
              { type: "text", text: PROMPT },
            ],
          }],
        }),
      });

      const raw = await resp.json();

      if (raw.error) {
        throw new Error(
          raw.error.type === "authentication_error"
            ? "Invalid Anthropic API key. Check your ANTHROPIC_API_KEY in Vercel settings."
            : raw.error.type === "rate_limit_error"
            ? "Rate limit reached. Wait a moment and try again."
            : `API Error (${raw.error.type}): ${raw.error.message}`
        );
      }

      if (!raw.content?.length) throw new Error("Empty response. Please try again.");

      const text = raw.content.filter(b => b.type === "text").map(b => b.text).join("");
      if (!text.trim()) throw new Error("No text in response — the web search used all tokens. Please retry.");

      const clean = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
      const jS = clean.indexOf("{"), jE = clean.lastIndexOf("}");
      if (jS === -1 || jE === -1) throw new Error("Could not find JSON in response.\n\nModel said:\n" + text.slice(0, 400));

      let product;
      try { product = JSON.parse(clean.slice(jS, jE + 1)); }
      catch { product = JSON.parse(clean.slice(jS, jE + 1).replace(/,(\s*[}\]])/g, "$1")); }

      setResult(product);
      saveToHistory(product);

    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      clearInterval(timer);
      setLoading(false);
    }
  };

  const getDomain = (url) => {
    try { return new URL(url || "").hostname.replace("www.", ""); } catch { return url || ""; }
  };

  return (
    <>
      <style>{css}</style>

      {/* History Overlay */}
      {showHist && (
        <>
          <div className="overlay" onClick={() => setShowHist(false)} />
          <aside className="hist-panel">
            <div className="hp-hdr">
              <div className="hp-title">History</div>
              <button className="close-btn" onClick={() => setShowHist(false)}>✕</button>
            </div>
            <div className="hp-list">
              {history.length === 0
                ? <div className="hp-empty">No searches yet.<br />Results will appear here.</div>
                : history.map((item, i) => {
                    const d = new Date(item._at);
                    const ds = d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) + " " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
                    return (
                      <div key={i} className="hp-item" onClick={() => { setResult(item); setShowHist(false); }}>
                        <div className="hp-nm">{item.productName || "Unknown"}</div>
                        <div className="hp-site">{getDomain(item.site)}</div>
                        <div className="hp-price">{item.price || "—"}</div>
                        <div className="hp-date">{ds}</div>
                      </div>
                    );
                  })}
            </div>
            <button className="hp-clr" onClick={() => { if (window.confirm("Clear all history?")) { setHistory([]); try { localStorage.removeItem("sf_hist"); } catch {} } }}>
              Clear All History
            </button>
          </aside>
        </>
      )}

      {/* Header */}
      <header>
        <div className="logo">Snap<span>find</span></div>
        <div className="tagline">Visual Product Search</div>
        <button className="hdr-btn" onClick={() => setShowHist(true)}>⌛ History</button>
      </header>

      {/* Main */}
      <main>
        <div className="hero">
          <h1>Find Any<br /><em>Product</em></h1>
          <p>Upload an image · Pick a store · Get price, details &amp; payment options instantly</p>
        </div>

        {/* Search Card */}
        <div className="card">
          <div className="card-hdr">
            <span className="badge">STEP 1 &amp; 2</span>
            <span className="card-title">Upload a product image &amp; choose your store</span>
          </div>
          <div className="form-grid">
            {/* Upload */}
            <div
              className={`upload-zone${dragging ? " drag" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
                onChange={(e) => e.target.files[0] && processFile(e.target.files[0])} />
              {imgSrc ? (
                <>
                  <img src={imgSrc} alt="preview" className="preview-img" />
                  <div className="preview-name">✓ {imgName}</div>
                  <div className="change-hint">Click to change image</div>
                </>
              ) : (
                <>
                  <div className="up-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5a5a72" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <div className="up-text">
                    <strong>Drop image here</strong>
                    or click to browse<br />
                    <span style={{ fontSize: 11, opacity: 0.5 }}>JPG · PNG · WEBP</span>
                  </div>
                </>
              )}
            </div>

            {/* Controls */}
            <div className="right-panel">
              <div>
                <label>Website / Store URL</label>
                <input type="url" value={site} onChange={e => setSite(e.target.value)}
                  placeholder="https://amazon.com" />
                <div className="quick-sites">
                  {QUICK_SITES.map(q => (
                    <button key={q.url} className="qs" onClick={() => setSite(q.url)}>{q.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label>Extra context <span style={{ opacity: 0.4, fontSize: 10 }}>(optional — helps a lot!)</span></label>
                <input type="text" value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Nike, black, size 42, under $100" />
              </div>
              <button className={`search-btn${loading ? " loading" : ""}`}
                onClick={doSearch} disabled={!canSearch || loading}>
                {loading ? "SEARCHING…" : "FIND PRODUCT"}
              </button>
            </div>
          </div>
        </div>

        {/* Loader */}
        {loading && (
          <div className="loader">
            <div className="bar-wrap"><div className="bar" /></div>
            <div className="loader-txt">AI is analyzing your image and deep searching the web…</div>
            <div className="loader-step">{STEPS[stepIdx]}</div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="err-box">
            <div className="err-h">⚠ Search Failed</div>
            <div style={{ color: "#5a5a72", fontSize: 13 }}>Exact error details:</div>
            <div className="err-code">{error}</div>
            <div className="err-tips">
              <strong style={{ color: "#e8e8f0" }}>Quick fixes:</strong><br />
              💡 Add product hints in the "Extra context" box (brand, type, color)<br />
              🌐 Check the URL starts with https://<br />
              🔄 Try again — web search sometimes needs a retry<br />
              🔑 If you see "API key" error: re-check ANTHROPIC_API_KEY in Vercel settings
            </div>
          </div>
        )}

        {/* Result */}
        {result && !loading && (() => {
          const p = result;
          const avColor = (p.availability || "").toLowerCase().includes("out") ? "r" : "g";
          return (
            <div className="result-card">
              <div className="res-head">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span className="pdot" />
                  <span className="res-head-txt">FOUND ON {getDomain(p.site).toUpperCase()}</span>
                </div>
                {p.matchType && <span className="match-badge">{p.matchType}</span>}
              </div>
              <div className="res-body">
                <div className="res-grid">
                  <div>
                    {p.imageUrl
                      ? <img src={p.imageUrl} className="res-img" alt="product"
                          onError={e => { e.target.outerHTML = '<div class="res-img-ph">📦</div>'; }} />
                      : <div className="res-img-ph">📦</div>}
                  </div>
                  <div>
                    <div className="res-name">{p.productName || "Product Found"}</div>
                    <div className="res-meta">{[p.brand, p.model, p.seller].filter(Boolean).join(" · ")}</div>
                    <div className="res-price">{p.price || "Price N/A"}</div>
                    {p.originalPrice && <div className="res-orig">Was {p.originalPrice}</div>}
                    {p.description && <div className="res-desc">{p.description}</div>}
                  </div>
                </div>

                <hr className="divider" />

                <div>
                  {p.availability && <div className="det-row"><div className="dk">Availability</div><div className={`dv ${avColor}`}>{p.availability}</div></div>}
                  {p.shipping && <div className="det-row"><div className="dk">Shipping</div><div className="dv">{p.shipping}</div></div>}
                  {p.rating && <div className="det-row"><div className="dk">Rating</div><div className="dv">{p.rating}</div></div>}
                  {p.keyFeatures?.length > 0 && (
                    <div className="det-row" style={{ borderBottom: "none" }}>
                      <div className="dk">Features</div>
                      <div className="dv">{p.keyFeatures.map((f, i) => <div key={i}>• {f}</div>)}</div>
                    </div>
                  )}
                </div>

                {p.paymentOptions?.length > 0 && (
                  <div className="pay-sect">
                    <div className="sect-lbl">Payment Options</div>
                    <div className="tag-list">{p.paymentOptions.map((o, i) => <span key={i} className="tag">{o}</span>)}</div>
                  </div>
                )}

                <div className="act-row">
                  {p.productUrl && (
                    <a className="btn-view" href={p.productUrl} target="_blank" rel="noopener noreferrer">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      VIEW &amp; BUY ON SITE
                    </a>
                  )}
                  <button className="btn-ghost" onClick={doSearch}>🔄 Search Again</button>
                </div>

                {p.searchNote && <div className="search-note">🔍 {p.searchNote}</div>}
              </div>
            </div>
          );
        })()}
      </main>

      <footer>
        🔒 No signup required · No data collected · History stored locally in your browser only
      </footer>
    </>
  );
}
