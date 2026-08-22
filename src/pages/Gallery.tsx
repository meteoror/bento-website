import React, { useEffect, useState } from "react";
import "../styles.css";

interface GalleryItem {
  path: string;
  type: "drawing" | "message";
  timestamp: string;
  dataUrl?: string;
  textContent?: string;
  error?: boolean;
}

function formatTimestamp(raw: string): string {
  const match = raw.match(/(\d{4})-(\d{2})-(\d{2})_(\d{2})-(\d{2})-(\d{2})/);
  if (!match) return raw;
  const [, y, m, d, h, min, s] = match;

  // filename's numbers are UTC (Vercel's server clock)
  const utcDate = new Date(Date.UTC(
    parseInt(y), parseInt(m) - 1, parseInt(d),
    parseInt(h), parseInt(min), parseInt(s || "0")
  ));

  // browser convert that UTC instant into the viewer's local time
  return utcDate.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const Gallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "drawing" | "message">("all");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/gallery-data");
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }
        const data = await res.json();
        setItems(data.items || []);
      } catch (err) {
        console.error(err);
        setError(
          "Could not load the gallery. Check your Vercel env vars and function logs."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = items.filter((i) => filter === "all" || i.type === filter);

  return (
    <div className="portfolio-app">
      <header className="portfolio-header">
        <div className="container">
          <h1 className="matrix-title">
            gallery<span className="matrix-cursor">_</span>
          </h1>
          <p className="matrix-subtitle">my files!!!!</p>
        </div>
      </header>

      <main className="portfolio-main">
        <div className="container">
          <section className="portfolio-section">
            <div className="d-flex gap-2 mb-4 justify-content-center flex-wrap">
              {(["all", "drawing", "message"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`btn btn-sm ${
                    filter === f ? "btn-success" : "btn-outline-secondary"
                  }`}
                >
                  {f === "all" ? "all" : f === "drawing" ? "drawings" : "messages"}
                </button>
              ))}
            </div>

            {loading && <p className="content-text text-center">loading...</p>}

            {error && (
              <p
                className="content-text text-center"
                style={{ color: "#ff4444" }}
              >
                {error}
              </p>
            )}

            {!loading && !error && filtered.length === 0 && (
              <p className="content-text text-center">nothing here yet.</p>
            )}

            <div className="gallery-grid">
              {filtered.map((item) => (
                <div key={item.path} className="portfolio-box gallery-item">
                  {item.error ? (
                    <p className="content-text" style={{ color: "#ff4444" }}>
                      failed to load this item
                    </p>
                  ) : item.type === "drawing" ? (
                    <img
                      src={item.dataUrl}
                      alt={item.timestamp}
                      className="gallery-image"
                      loading="lazy"
                    />
                  ) : (
                    <pre className="gallery-message">{item.textContent}</pre>
                  )}
                  <small className="gallery-timestamp">
                    {formatTimestamp(item.timestamp)}
                  </small>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="portfolio-footer">
        <div className="container">
          <a href="/" className="social-link">
            <i className="bi bi-arrow-left me-1"></i> back home
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Gallery;
