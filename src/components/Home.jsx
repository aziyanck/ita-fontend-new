import React, { useEffect, useRef } from 'react';

const frameCount = 148;

const currentFrame = (index) =>
  `https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/${index
    .toString()
    .padStart(4, '0')}.jpg`;

function Home() {
  const canvasRef = useRef(null);
  const imgRef = useRef(new Image());

  // Preload all images
  useEffect(() => {
    for (let i = 1; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const img = imgRef.current;

    canvas.width = 1158;
    canvas.height = 770;
    img.src = currentFrame(1);

    img.onload = () => {
      context.drawImage(img, 0, 0);
    };

    const updateImage = (index) => {
      img.src = currentFrame(index);
      img.onload = () => context.drawImage(img, 0, 0);
    };

    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
      const scrollFraction = scrollTop / maxScrollTop;
      const frameIndex = Math.min(frameCount - 1, Math.ceil(scrollFraction * frameCount));
      requestAnimationFrame(() => updateImage(frameIndex + 1));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative limit h-[500vh] bg-black">
      <canvas
        id="hero-lightpass"
        ref={canvasRef}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[100vw] max-h-[100vh]"
      />
    </div>
  );
}

export default Home;
