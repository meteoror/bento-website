import React, { useEffect, useState } from "react";
import ResponseBox from "../components/ResponseBox";
import DrawingBox from "../components/DrawingBox";

const App: React.FC = () => {
  const [statusMessage, setStatusMessage] = useState("");

  // hide submission feedback after a short delay
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const handleMessageSent = (message: string) => {
    setStatusMessage(message);
  };

  // use the same page feedback for drawings and messages
  const handleDrawingSaved = (message: string) => {
    setStatusMessage(message);
  };

  return (
    <div className="portfolio-app">
      {/* page introduction */}
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

      {/* profile and visitor features */}
      <main className="portfolio-main">
        <div className="container">
          {/* personal introduction */}
          <section className="portfolio-section">
            <h2 className="section-title">about</h2>
            <div className="content-text">
              <p>
                some medias i enjoy areeee. blocktales, outlast trials,
                and transformers... i produce music pretty much exclusively in my free time (though i rap sometimes too)
                and i like computers and pretty much anything related to them as well :-)
                im objectum very proudly and also think of myself as
                computer-robot-dog ish but i'm not really one for labels and
                don't care to really look into it too much. my music taste fluctuates a lot – my{" "}
                <a
                  href="https://www.last.fm/user/meteoror"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="matrix-link"
                >
                  last.fm
                </a>{" "} has more accurate stats!!
              </p>
              <p>
                i like griefer (blocktales) and broker
                (phighting!) a Normal amount. i am kind of insane about them
                on socials sometimes. Heh.  
                i also like bumblebee (transformers) subspace (phighting) and 007n7 (myth community)... 
                among others i cant b assed to remember right now!! i will prob moot u up if you like any of
                those medias (except phighting sorry the community sucks so ass 90% of the time)
              </p>
            </div>
          </section>

          {/* creative interests */}
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

          {/* visitor message form */}
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

      {/* social links */}
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

      {/* show feedback after a visitor submits content */}
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
