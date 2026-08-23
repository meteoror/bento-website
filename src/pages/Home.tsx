import React, { useState, useEffect } from "react";
import ResponseBox from "../components/ResponseBox";
import DrawingBox from "../components/DrawingBox";
import "../styles.css";

const App: React.FC = () => {
  const [statusMessage, setStatusMessage] = useState("");

  // Add Bootstrap icons
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css";
    document.head.appendChild(link);

    return () => {
      const existingLink = document.querySelector(`link[href="${link.href}"]`);
      if (existingLink) document.head.removeChild(existingLink);
    };
  }, []);

  // Clear status messages
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const handleMessageSent = (message: string) => {
    setStatusMessage(message);
  };

  const handleDrawingSaved = (message: string) => {
    setStatusMessage(message);
  };

  useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://storage.ko-fi.com/cdn/scripts/overlay-widget.js";
  script.async = true;

  script.onload = () => {
    if ((window as any).kofiWidgetOverlay) {
      (window as any).kofiWidgetOverlay.draw("91nevolt", {
        type: "floating-chat",
        "floating-chat.donateButton.text": "Support me",
        "floating-chat.donateButton.background-color": "#00ff88", // match your theme
        "floating-chat.donateButton.text-color": "#000"
      });
    }
  };

  document.body.appendChild(script);

  return () => {
    document.body.removeChild(script);
  };
}, []);

  return (
    <div className="portfolio-app">
      {/* Header */}
      <header className="portfolio-header">
        <div className="container">
          <h1 className="matrix-title">
            <span className="matrix-cursor">_</span>
          </h1>
          <p className="matrix-subtitle">
            hi! i'm 91nevolt but most people call me matrix
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="portfolio-main">
        <div className="container">
          {/* About Section */}
          <section className="portfolio-section">
            <h2 className="section-title">about</h2>
            <div className="content-text">
              <p>
                you can find me on twitter (and some other social media)
                @91nevolt and on discord @91ninevolt for contact!
              </p>
              <p>
                some medias i enjoy areeee. blocktales, outlast trials,
                and transformers... i produce music pretty much exclusively in my free time (though i rap sometimes too)
                and i like computers and pretty much anything related to them as well :-)
                im objectum very proudly and also think of myself as
                computer-robot-dog ish but i'm not really one for labels and
                don't care to really look into it too much. my music taste fluctuates a lot –{" "}
                <a
                  href="https://www.last.fm/user/meteoror"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="matrix-link"
                >
                  https://www.last.fm/user/meteoror
                </a>{" "}
                has more accurate stats!!
              </p>
              <p>
                i like griefer (blocktales) and broker
                (phighting!) a Normal amount. i am kind of insane about them
                on socials sometimes, i will prob moot u up if you like any of
                those medias (except phighting sorry the community sucks so ass)
                i also like bumblebee (transformers) subspace (phighting) and 007n7 (myth community)... among others i cant b assed to remember right now
              </p>
            </div>
          </section>

          {/* Skills Section */}
          <section className="portfolio-section">
            <h2 className="section-title">skills & interests</h2>
            <div className="content-text">
              <p>
                i enjoy music and art; specifically, web design and 3d modeling;
                and i've pretty much tried every internet-related thing out
                there that there is! i can use touchdesigner, video editing
                software, and a lot of other softwares very well. my
                commissions are always open and i can really do anything save
                for actual 2d art!
              </p>
            </div>
          </section>

          {/* Visitor Interaction Section */}
          <section className="portfolio-section">
            <h2 className="section-title">leave a message</h2>
            <ResponseBox onMessageSent={handleMessageSent} />
          </section>

          <section className="portfolio-section">
            <h2 className="section-title">draw something</h2>
            <DrawingBox onDrawingSaved={handleDrawingSaved} />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="portfolio-footer">
        <div className="container">
          <div className="social-links">
            <a
              href="https://twitter.com/91nevolt"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <i className="bi bi-twitter"></i> @91nevolt
            </a>
            <span className="separator">|</span>
            <span className="social-link">discord: @91ninevolt</span>
          </div>
        </div>
      </footer>

      {/* Status Toast */}
      {statusMessage && (
        <div
          className="toast-container position-fixed bottom-0 end-0 p-3"
          style={{ zIndex: 1050 }}
        >
          <div className="toast show matrix-toast" role="alert">
            <div className="toast-body d-flex align-items-center text-success">
              <i className="bi bi-check-circle me-2"></i>
              {statusMessage}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
