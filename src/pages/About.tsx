import React from "react";

const App: React.FC = () => {
  return (
    // this page contains profile information without visitor forms
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

      {/* profile details */}
      <main className="portfolio-main">
        <div className="container">
          {/* personal introduction */}
          <section className="portfolio-section">
            <h2 className="section-title">about</h2>
            <div className="content-text">
              <p>
                you can find me on twitter (and some other social media)
                @91nevolt and on discord @91ninevolt for contact!
              </p>
              <p>
                some medias i enjoy areeee. blocktales and roblox in general,
                minecraft sometimes… i like mathematics a lot in the hobby way,
                and i like computers and pretty much anything related to them…
                heh. im objectum very proudly and also think of myself as
                computer-robot-dog ish but i'm not really one for labels and
                don't care to really look into it too much. i am me :-) i love
                music a lot, my taste fluctuates a lot –{" "}
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
                i like griefer (blocktales) clonelin (collinlock16) and broker
                (phighting!) a Normal amount. i dont rlly like saying im
                nonsharing but i do yume them and am kind of insane about them
                on socials sometimes, i will prob moot u up if you like any of
                those medias (except phighting sorry the community sucks so ass)
                i also like bumblebee (transformers) subspace (phighting) ire
                (grace) and 007n7 (myth community)... i'm very open to new
                medias :-)
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
                software, and a lot of other softwares very well (just ask.) my
                commissions are always open and i can really do anything save
                for actual 2d art!
              </p>
            </div>
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
    </div>
  );
};

export default App;
