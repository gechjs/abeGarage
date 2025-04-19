import React from 'react';
//import the background image
import backgroundImage from "../../assets/images/custom/banner/banner1.jpg";
//import image vban1
import vban1 from "../../assets/images/custom/misc/vban1.jpg";
//import image vban2
import vban2 from "../../assets/images/custom/misc/vban2.jpg";
import image4 from "../../assets/images/custom/additional-B9nihJ5u.jpg"
import bg1 from "../../assets/images/background/bg2.png";
//import image servericeImage
import serviceImage from "../../assets/images/custom/chris-liverani-HUJDz6CJEaM-unsplash.jpg";
    
function Home() {
  return (
    <div>
      <div className="page-wrapper">
        {/* <div className="loader-wrap">
    </section>      <div className="preloader">
            <div className="preloader-close">Preloader Close</div>
          </div>
          <div className="layer layer-one"><span className="overlay"></span></div>
          <div className="layer layer-two"><span className="overlay"></span></div>
          <div className="layer layer-three"><span className="overlay"></span></div>
        </div> */}

        <section className="video-section">
          <div
            data-parallax='{"y": 50}'
            className="sec-bg"
            //add it here
            style={{ backgroundImage: `url(${backgroundImage})` }}
          ></div>
          <div className="auto-container">
            <h5>Working since 1999</h5>
            <h2>Tuneup Your Car <br /> to Next Level</h2>
            <div className="video-box">
              <div className="video-btn">
                <a
                  href="https://www.youtube.com/watch?v=nfP5N9Yc72A&ampt=28s"
                  className="overlay-link lightbox-image video-fancybox ripple"
                >
                  <i className="flaticon-play"></i>
                </a>
              </div>
              <div className="text">Watch intro video <br /> about us</div>
            </div>
          </div>
        </section>

      
        <section className="about-section">
          <div className="auto-container">
            <div className="row">
              <div className="col-lg-5">
                <div className="image-box">
            
                    <div >
                        <img src={vban1} alt="" />
                        <img src={vban2} alt="" />
                  </div>
                  <div className="year-experience" data-parallax='{"y": 30}'>
                    <strong>24</strong> years <br />
                    Experience
                  </div>
                </div>
              </div>
              <div className="col-lg-7 pl-lg-5">
                <div className="sec-title">
                  <h5>Welcome to Our workshop</h5>
                  <h2>We have 24 years experience</h2>
                  <div className="text">
                    <p>
                      Bring to the table win-win survival strategies to ensure proactive domination. At the
                      end of the day, going forward, a new normal that has evolved from generation X is on
                      the runway heading towards a streamlined cloud solution. User generated content in
                      real-time will have multiple touchpoints for offshoring.
                    </p>
                    <p>
                      Capitalize on low hanging fruit to identify a ballpark value added activity to beta
                      test. Override the digital divide with additional clickthroughs from DevOps.
                      Nanotechnology immersion along the information highway will close the loop on
                      focusing.
                    </p>
                  </div>
                  <div className="link-btn mt-40">
                    <a href="about.html" className="theme-btn btn-style-one style-two">
                      <span>About Us <i className="flaticon-right"></i></span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        
        <section class="services-section">
            <div class="auto-container">
                <div class="sec-title style-two">
                    <h2>Our Featured Services</h2>
                    <div class="text">Bring to the table win-win survival strategies to ensure proactive domination. At
                        the end of the day, going forward, a new normal that has evolved from generation X is on the
                        runway heading towards a streamlined cloud solution. </div>
                </div>
                <div class="row">
                    <div class="col-lg-4 service-block-one">
                        <div class="inner-box hvr-float-shadow">
                            <h5>Service and Repairs</h5>
                            <h2>Performance Upgrade</h2>
                            <a href="#" class="read-more">read more +</a>
                            <div class="icon"><span class="flaticon-power"></span></div>
                        </div>
                    </div>
                    <div class="col-lg-4 service-block-one">
                        <div class="inner-box hvr-float-shadow">
                            <h5>Service and Repairs</h5>
                            <h2>Transmission Services</h2>
                            <a href="#" class="read-more">read more +</a>
                            <div class="icon"><span class="flaticon-gearbox"></span></div>
                        </div>
                    </div>
                    <div class="col-lg-4 service-block-one">
                        <div class="inner-box hvr-float-shadow">
                            <h5>Service and Repairs</h5>
                            <h2>Break Repair & Service</h2>
                            <a href="#" class="read-more">read more +</a>
                            <div class="icon"><span class="flaticon-brake-disc"></span></div>
                        </div>
                    </div>
                    <div class="col-lg-4 service-block-one">
                        <div class="inner-box hvr-float-shadow">
                            <h5>Service and Repairs</h5>
                            <h2>Engine Service & Repair</h2>
                            <a href="#" class="read-more">read more +</a>
                            <div class="icon"><span class="flaticon-car-engine"></span></div>
                        </div>
                    </div>
                    <div class="col-lg-4 service-block-one">
                        <div class="inner-box hvr-float-shadow">
                            <h5>Service and Repairs</h5>
                            <h2>Tyre & Wheels</h2>
                            <a href="#" class="read-more">read more +</a>
                            <div class="icon"><span class="flaticon-tire"></span></div>
                        </div>
                    </div>
                    <div class="col-lg-4 service-block-one">
                        <div class="inner-box hvr-float-shadow">
                            <h5>Service and Repairs</h5>
                            <h2>Denting & Painting</h2>
                            <a href="#" class="read-more">read more +</a>
                            <div class="icon"><span class="flaticon-spray-gun"></span></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

       
        <section className="features-section">
          <div className="auto-container">
            <div className="row">
              <div className="col-lg-6">
                <div className="inner-container">
                  <h2>Quality Service And <br /> Customer Satisfaction !!</h2>
                  <div className="text">
                    We utilize the most recent diagnostic equipment to ensure your vehicle is
                    fixed or adjusted appropriately and in a timely manner. We are a member of
                    Professional Auto Service, a top-class performance network, where independent service
                    facilities share common goals of being world-class automotive service centers.
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="image">
                 
                  <img src={serviceImage} alt="" />
                
              
                </div>
              </div>
            </div>
          </div>
        </section>
        <section class="why-choose-us">
            <div class="auto-container">
                <div class="row">
                    <div class="col-lg-6">
                        <div class="sec-title style-two">
                            <h2>Why Choose Us</h2>
                            <div class="text">Bring to the table win-win survival strategies to ensure proactive
                                domination. At the end of the day, going forward, a new normal that has evolved from
                                generation heading towards.</div>
                        </div>
                        <div class="icon-box">
                            <div class="icon"><span class="flaticon-mechanic"></span></div>
                            <h4>Certified Expert Mechanics</h4>
                        </div>
                        <div class="icon-box">
                            <div class="icon"><span class="flaticon-wrench"></span></div>
                            <h4>Fast And Quality Service</h4>
                        </div>
                        <div class="icon-box">
                            <div class="icon"><span class="flaticon-price-tag-1"></span></div>
                            <h4>Best Prices in Town</h4>
                        </div>
                        <div class="icon-box">
                            <div class="icon"><span class="flaticon-trophy"></span></div>
                            <h4>Awarded Workshop</h4>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="sec-title style-two">
                            <h2>Addtional Services</h2>
                        </div>
                        <div class="row">
                            <div class="col-md-5">
                                <div class="image"><img src={image4} alt=""/></div>
                            </div>
                            <div class="col-md-7">
                                <ul class="list">
                                    <li>General Auto Repair & Maintenance</li>
                                    <li>Transmission Repair & Replacement</li>
                                    <li>Tire Repair and Replacement</li>
                                    <li>State Emissions Inspection</li>
                                    <li>Break Job / Break Services</li>
                                    <li>Electrical Diagnostics</li>
                                    <li>Fuel System Repairs</li>
                                    <li>Starting and Charging Repair</li>
                                    <li>Steering and Suspension Work</li>
                                    <li>Emission Repair Facility</li>
                                    <li>Wheel Alignment</li>
                                    <li>Computer Diagaonstic Testing</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="video-section">
         
        <div 
  className="sec-bg"
  style={{ backgroundImage: `url(${bg1})` }}
></div>
            <div class="auto-container">
                <h5>Working since 1992</h5>
                <h2>We are leader <br/> in Car Mechanical Work</h2>
                <div class="video-box">
                    <div class="video-btn"><a href="https://www.youtube.com/watch?v=nfP5N9Yc72A&amp;t=28s"
                            class="overlay-link lightbox-image video-fancybox ripple"><i class="flaticon-play"></i></a>
                    </div>
                    <div class="text">Watch intro video <br/> about us</div>
                </div>
            </div>
        </section>

        <section className="cta-section">
          <div className="auto-container">
            <div className="wrapper-box">
              <div className="left-column">
                <h3>Schedule Your Appointment Today</h3>
                <div className="text">Your Automotive Repair & Maintenance Service Specialist</div>
              </div>
              <div className="right-column">
                <div className="phone">1800.456.7890</div>
                <div className="btn">
                  <a href="#" className="theme-btn btn-style-one">
                    <span>Appointment</span><i className="flaticon-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

    
      </div>
    </div>
  );
}

export default Home;