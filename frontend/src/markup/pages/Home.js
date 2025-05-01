import React from 'react';
import { Link } from 'react-router-dom'; // Import the Link component for navigation
//import the background image
import backgroundImage from "../../assets/images/custom/banner/banner1.jpg";

import bg1 from "../../assets/images/background/bg2.png";
import serviceImage from "../../assets/images/custom/chris-liverani-HUJDz6CJEaM-unsplash.jpg";
import WhyChooseUs from '../components/whyChoose/WhyChooseUs';
import BottomBanner from '../components/BottomBanner/BottomBanner';
import ScheduleAppointment from '../components/sechdule/ScheduleAppointment';
import Experience from '../components/Experience/Experience';
import ServiceComponent from '../components/serviceComp/ServiceComponent';
import VideoSection from '../components/videoSection/VideoSection';

function Home() {
  return (
    <div>
      <div className="page-wrapper">
        {/* <div className="loader-wrap">
          <div className="preloader">
            <div className="preloader-close">Preloader Close</div>
          </div>
          <div className="layer layer-one"><span className="overlay"></span></div>
          <div className="layer layer-two"><span className="overlay"></span></div>
          <div className="layer layer-three"><span className="overlay"></span></div>
        </div> */}

        <VideoSection></VideoSection>

        <Experience></Experience>

        <ServiceComponent></ServiceComponent>

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
        <WhyChooseUs></WhyChooseUs>
        <BottomBanner></BottomBanner>

        <ScheduleAppointment></ScheduleAppointment>

      </div>
    </div>
  );
}

export default Home;