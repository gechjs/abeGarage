import React from 'react'

import WhyChooseUs from '../components/whyChoose/WhyChooseUs'
import BottomBanner from '../components/BottomBanner/BottomBanner'
import ScheduleAppointment from '../components/sechdule/ScheduleAppointment'
import Experience from '../components/Experience/Experience'
import AboutComponent from '../components/AboutComponent/AboutComponent'
function About() {
  return (
    <div>
       <AboutComponent></AboutComponent>
        <Experience></Experience>
        <WhyChooseUs></WhyChooseUs>
        <BottomBanner></BottomBanner>
        <ScheduleAppointment></ScheduleAppointment>
    </div>
  )
}

export default About