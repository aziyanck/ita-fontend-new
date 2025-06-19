import { useEffect, lazy, Suspense } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from './components/Navbar';
import ScrollDiv from './components/ScrollDiv';
import featuresData from './components/sub_comp/features_data';

// Lazy Load Components
const Services = lazy(() => import('./components/Services'));
const Brands = lazy(() => import('./components/Brands'));
const WhyIta = lazy(() => import('./components/WhyIta'));
const Contact = lazy(() => import('./components/Contact'));
const Review = lazy(() => import('./components/Review'));
const Features = lazy(() => import('./components/Features'));
const Footer = lazy(() => import('./components/Footer'));
const LogoCaro = lazy(() => import('./components/LogoCaro'));

function App() {

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
    });
  }, []);

  return (
    <div className='overflow-x-clip'>
      <Navbar />
     
      <ScrollDiv />

  
      <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
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
        <div className='md:h-screen flex flex-col justify-center items-center'>
          <Brands />
          <WhyIta />
        </div>
        <Contact />
        <Review />
        <Footer />
      </Suspense>
    </div>
  );
}

export default App;
