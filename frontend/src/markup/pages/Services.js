import React from 'react'
import ScheduleAppointment from '../components/sechdule/ScheduleAppointment'
import WhyChooseUs from '../components/whyChoose/WhyChooseUs'
import ServiceComponent from '../components/serviceComp/ServiceComponent'
import BottomBanner from '../components/BottomBanner/BottomBanner'

function Services() {
  return (
    <div>
        <BottomBanner></BottomBanner>
        <ServiceComponent></ServiceComponent>
        <WhyChooseUs></WhyChooseUs>
        <ScheduleAppointment></ScheduleAppointment>
    </div>
  )
}

export default Services