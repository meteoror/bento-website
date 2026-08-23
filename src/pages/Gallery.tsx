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

const SESSION_KEY = "gallery-password";

function formatTimestamp(raw: string): string {
  const match = raw.match(/(\d{4})-(\d{2})-(\d{2})_(\d{2})-(\d{2})-(\d{2})/);
  if (!match) return raw;
  const [, y, m, d, h, min, s] = match;

  const utcDate = new Date(Date.UTC(
    parseInt(y), parseInt(m) - 1, parseInt(d),
    parseInt(h), parseInt(min), parseInt(s || "0")
  ));

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "drawing" | "message">("all");

  const [authed, setAuthed] = useState(false);
  const [checkingSavedPassword, setCheckingSavedPassword] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  const loadGallery = async (password: string) => {
    setLoading(true);
    setError("");
    setAuthError("");

    try {
      const res = await fetch("/api/gallery-data", {
        headers: { "x-gallery-password": password },
      });

      if (res.status === 401) {
        setAuthed(false);
        setAuthError("Wrong password.");
        sessionStorage.removeItem(SESSION_KEY);
        return;
      }

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      setItems(data.items || []);
      setAuthed(true);
      sessionStorage.setItem(SESSION_KEY, password);
    } catch (err) {
      console.error(err);
      setError(
        "Could not load the gallery. Check your Vercel env vars and function logs."
      );
    } finally {
      setLoading(false);
    }
  };

  // On first load, try a password saved earlier this browser session
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      loadGallery(saved).finally(() => setCheckingSavedPassword(false));
    } else {
      setCheckingSavedPassword(false);
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;
    loadGallery(passwordInput);
  };

  const filtered = items.filter((i) => filter === "all" || i.type === filter);

  return (
    <div className="portfolio-app">
      <header className="portfolio-header">
        <div className="container">
          <h1 className="matrix-title">
            gallery<span className="matrix-cursor">_</span>
          </h1>
          <p className="matrix-subtitle">everything sent in, newest first</p>
        </div>
      </header>

      <main className="portfolio-main">
        <div className="container">
          {checkingSavedPassword ? (
            <p className="content-text text-center">loading...</p>
          ) : !authed ? (
            <section className="portfolio-section">
              <div className="portfolio-box" style={{ maxWidth: "360px", margin: "0 auto" }}>
                <form onSubmit={handlePasswordSubmit} className="d-flex flex-column">
                  <label className="content-text mb-2" htmlFor="gallery-password">
                    password required
                  </label>
                  <input
                    id="gallery-password"
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="form-control mb-3"
                    placeholder="enter password"
                    autoFocus
                  />
                  {authError && (
                    <p className="mb-3" style={{ color: "#ff4444" }}>
                      {authError}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={loading || !passwordInput.trim()}
                    className="btn btn-success"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        checking...
                      </>
                    ) : (
                      "unlock"
                    )}
                  </button>
                </form>
              </div>
            </section>
          ) : (
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
          )}
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
