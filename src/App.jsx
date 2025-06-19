import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from './components/Navbar'

import Services from './components/Services'
import ScrollDiv from './components/ScrollDiv';
import Brands from './components/Brands'
import WhyIta from './components/WhyIta'
import Contact from './components/Contact'
import Review from './components/Review';
import Features from './components/Features';
import Footer from './components/Footer';

import LogoCaro from './components/LogoCaro'


import featuresData from './components/sub_comp/features_data';





function App() {

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,

    })

  }, []);


  return (
    <div className=' overflow-x-clip'>
      <Navbar />
      <ScrollDiv />
      <Services />
      
      {featuresData.map((section, index) => (
        <Features
          key={index}
          title={section.title}
          mainImage={section.mainImage}
          carouselImages={section.carouselImages}
        />
      ))}
      <LogoCaro />
      <div className=' md:h-screen  flex flex-col justify-center items-center'>
        <Brands />
        <WhyIta />
      </div>
      <Contact />
      <Review />
      <Footer />


    </div>
  )
}

export default App
