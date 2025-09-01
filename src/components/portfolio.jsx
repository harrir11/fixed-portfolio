import React from "react";

//import stock
import stock from "../img/egg_img.png";
import stock1 from "../img/a-png-red.png";
//import stock1 from "../img/gettyimages-2023785321-copy.jpg";
import stock2 from "../img/image3.jpg";
import stock3 from "../img/image4.jpg";
import stock4 from "../img/image5.jpg";
import stock5 from "../img/image6.jpg";

class Portfolio extends React.Component {
  render() {
    return (
      <section id="work" className="portfolio-mf sect-pt4 route">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="title-box text-center">
                <h3 className="title-a">Portfolio</h3>
                <div className="line-mf"></div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="work-box">
                {/* Lightbox should point to an image and wrap only the image */}
                <a href={stock} data-lightbox="gallery-vmarine" data-title="Egg app screenshot">
                  <div className="work-img">
                    <img src={stock} alt="Egg app screenshot" className="img-fluid" />
                  </div>
                </a>

                <div className="work-content">
                  <div className="row">
                    <div className="col-sm-8">
                      <h2 className="w-title">Egg tracker</h2>
                      <div className="w-more">
                        <span className="w-ctegory">Typescript HTML5 CSS ReactJS</span>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="w-like">
                        {/* Separate external link (no nesting inside the lightbox <a>) */}
                        <a
                                      className="btn btn-sm btn-outline-primary"
                                      href="https://egg-2qjr4c07m-rebecca-harris-projects.vercel.app/"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      aria-label="Open Egg tracker live site"
                                    >
                                      View Live
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>{/* .work-box */}
            </div>{/* .col-md-4 */}
          </div>{/* .row */}

          <div className="row">
            <div className="col-md-4">
              <div className="work-box">
                {/* Lightbox should point to an image and wrap only the image */}
                <a href={stock1} data-lightbox="gallery-vmarine" data-title="Reddit Tracker">
                  <div className="work-img">
                    <img src={stock1} alt="Egg app screenshot" className="img-fluid" />
                  </div>
                </a>

                <div className="work-content">
                  <div className="row">
                    <div className="col-sm-8">
                      <h2 className="w-title">Reddit Tracker</h2>
                      <div className="w-more">
                        <span className="w-ctegory">Flask React Python Pandas</span>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="w-like">
                        {/* Separate external link (no nesting inside the lightbox <a>) */}
                        <a
                                      className="btn btn-sm btn-outline-primary"
                                      href="https://github.com/harrir11/world_scrape"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      aria-label="Open Egg tracker live site"
                                    >
                                      View Code
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>{/* .work-box */}
            </div>{/* .col-md-4 */}
          </div>{/* .row */}

        </div>{/* .container */}
      </section>
    );
  }
}

export default Portfolio;
