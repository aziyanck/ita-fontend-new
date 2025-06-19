import React from 'react';
import './Carousel.css';

const Carousel = ({ images }) => {
  return (
    <div className="carousel" data-mask>
      {images.map((imgSrc, index) => (
        <article key={index} style={{ '--i': index }}>
          <img src={imgSrc} alt={`carousel-${index}`} />
        </article>
      ))}
    </div>
  );
};

export default Carousel;
