import React from 'react';
import Carousel from './sub_comp/Carousel';

function Features({ title, mainImage, carouselImages }) {
  return (
    <div className='w-screen overflow-x-clip h-auto box-border flex flex-col items-center justify-center py-8 px-4 gap-4'>

      <h1 className='text-3xl poppins-extrabold gd-text'>
        {title}
      </h1>

      <div className='relative overflow-hidden rounded-md flex-grow w-[95vw] lg:max-h-[75vh] '>
        <img
          src={mainImage}
          alt={`Main visual for ${title}`}
          className='w-full h-full object-cover'
        />
      </div>

      <div className='w-[95vw] md:w-[95vw] overflow-hidden box-border'>
        <Carousel images={carouselImages} />
      </div>

    </div>
  );
}

export default Features;
