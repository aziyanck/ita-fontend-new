// Home.jsx
import ScrollDiv from './components/ScrollDiv';
import Navbar from './components/Navbar';
import featuresData from './components/sub_comp/features_data';
import { lazy, useEffect, Suspense } from 'react';

const Services = lazy(() => import('./components/Services'));
const Features = lazy(() => import('./components/Features'));
const LogoCaro = lazy(() => import('./components/LogoCaro'));
const Brands = lazy(() => import('./components/Brands'));
const WhyIta = lazy(() => import('./components/WhyIta'));
const Contact = lazy(() => import('./components/Contact'));
const Review = lazy(() => import('./components/Review'));
const Footer = lazy(() => import('./components/Footer'));

function Home() {

  useEffect(() => {
    // Trigger all components to load in the background
    import('./components/Services');
    import('./components/Features');
    import('./components/LogoCaro');
    import('./components/Brands');
    import('./components/WhyIta');
    import('./components/Contact');
    import('./components/Review');
    import('./components/Footer');
  }, []);

  return (
    <div className="overflow-x-clip">
      <Navbar />
      <ScrollDiv />

      <Suspense fallback={null}>
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

export default Home;
