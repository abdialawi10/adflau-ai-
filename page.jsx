"use client";

import { useState } from "react";

export default function Page() {
  // -------------------------
  // STATE
  // -------------------------
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("professional");
  const [ad, setAd] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [approvedAd, setApprovedAd] = useState(null);
  const [loading, setLoading] = useState(false);

  const tones = ["professional", "casual", "fun", "bold", "luxury"];

  // -------------------------
  // GENERATE AD
  // -------------------------
  async function generateAd(options = {}) {
    try {
      setLoading(true);

      const res = await fetch("/api/generate-ad", {
        method: "POST",
        body: JSON.stringify({
          prompt,
          tone,
          approvedAd,
          regenerate: options.regenerate || false,
          switchTone: options.switchTone || false,
        }),
      });

      if (!res.ok) {
        console.error("API error:", await res.text());
        setLoading(false);
        return;
      }

      const data = await res.json();

      setAd(data.ad);
      setImageUrl(data.imageUrl);
    } catch (err) {
      console.error("Request failed:", err);
    } finally {
      setLoading(false);
    }
  }

  // -------------------------
  // SAVE ANCHOR STYLE
  // -------------------------
  function approveAsAnchorStyle() {
    if (ad) {
      setApprovedAd(ad);
      alert("Ad style locked in as anchor for this session!");
    }
  }

  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="app-main">
      {/* LEFT PANEL — INPUT AREA */}
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title-group">
            <div className="panel-title">Ad Generator</div>
            <div className="panel-subtitle">
              Enter a business description
            </div>
          </div>
        </div>

        {/* PROMPT INPUT */}
        <div className="form-group">
          <div className="label-row">
            <label className="label">Business Prompt</label>
            <span className="label-hint">Describe your ad idea</span>
          </div>

          <textarea
            className="prompt-box"
            placeholder="Create an ad for..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        {/* TONE PICKER */}
        <div className="tone-section">
          <div className="tone-label">Tone / Style</div>

          <div className="tone-buttons">
            {tones.map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`tone-btn ${
                  tone === t ? "tone-selected" : ""
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="action-buttons">
          <button onClick={() => generateAd()} disabled={loading}>
            Generate Ad
          </button>

          <button onClick={() => generateAd({ regenerate: true })} disabled={loading}>
            Regenerate
          </button>

          <button onClick={() => generateAd({ switchTone: true })} disabled={loading}>
            Switch Tone
          </button>
        </div>

        <button
          className="anchor-btn"
          onClick={approveAsAnchorStyle}
          disabled={!ad}
        >
          Approve as Anchor Style
        </button>
      </div>

      {/* RIGHT PANEL — OUTPUT AREA */}
      <div className="output-panel">
        {!ad && !loading && (
          <div className="empty-state">Your ad will appear here…</div>
        )}

        {loading && (
          <div className="loading-state">Generating ad…</div>
        )}

        {!loading && ad && (
          <div className="ad-card">
            
            {/* IMAGE DISPLAY */}
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Generated Ad"
                className="ad-image"
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  marginBottom: "16px",
                }}
              />
            )}

            {/* TEXT CONTENT */}
            <div className="ad-tone">{tone}</div>
            <h2 className="ad-headline">{ad.headline}</h2>
            <h3 className="ad-subheadline">{ad.subheadline}</h3>
            <p className="ad-body">{ad.body}</p>

            <button className="ad-cta-btn">{ad.cta}</button>

            <div className="ad-tagline">{ad.tagline}</div>
          </div>
        )}
      </div>
    </div>
  );
}
