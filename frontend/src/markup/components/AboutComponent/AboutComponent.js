import React from 'react'
import img3 from "../../../assets/images/custom/banner/banner1.jpg"
function AboutComponent() {
  return (
    <div>
         <section class="page-title" style={{ backgroundImage: `url(${img3})` }}>
        <div class="auto-container">
            <h2>About us</h2>
            <ul class="page-breadcrumb">
                <li><a href="/">home</a></li>
                <li>About us</li>
            </ul>
        </div>
        <h1 data-parallax='{"x": 200}'>Car Repairing</h1>
    </section>
    </div>
  )
}

export default AboutComponent