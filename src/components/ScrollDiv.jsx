import React, { useRef, useEffect } from 'react';
import Typed from 'typed.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import mainBg from '../assets/mainBGImg.webp';

gsap.registerPlugin(ScrollTrigger);

function ScrollDiv() {
  const typedRef = useRef(null);
  const headlineRef = useRef(null);
  const subtitleRef = useRef(null);
  const typeRef = useRef(null);
  const parenRef = useRef(null);

  useEffect(() => {
    // Typed animation
    const typed = new Typed(typedRef.current, {
      strings: [
        "Initializing your smart space…",
        "Connecting your home to the future…",
        "Comfort is just seconds away…",
        "Warming up the lights and your lifestyle…",
        "Your home is syncing with your rhythm…",
        "Activating your intelligent lifestyle...",
        "Less effort. More living…",
        "Live simply. Live smart…"
      ],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 1000,
      loop: true,
      smartBackspace: true,
    });

    // GSAP animations
    gsap.from(headlineRef.current, {
      scrollTrigger: {
        trigger: headlineRef.current,
        start: 'top 80%',
        end: 'top 20%',
        toggleActions: 'play reverse play reverse',

      },
      x: 100,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    });

    gsap.from(subtitleRef.current, {
      scrollTrigger: {
        trigger: subtitleRef.current,
        start: 'top 85%',
        end: 'top 40%',
        toggleActions: 'play reverse play reverse',
      },
      y: -50,
      opacity: 0,
      duration: 1,
      delay: 0.3,
      ease: 'power2.out'
    });

    gsap.from(typeRef.current, {
      scrollTrigger: {
        trigger: typeRef.current,
        start: 'top 85%',
        end: 'top 40%',
        toggleActions: 'play reverse play reverse',
      },
      y: -50,
      opacity: 0,
      duration: 1,
      delay: 0.3,
      ease: 'power2.out'
    });

    gsap.to(parenRef.current, {
      scrollTrigger: {
        trigger: parenRef.current,
        start: 'bottom 80%',
        end: 'bottom 30%',
        toggleActions: 'play reverse play reverse',
        scrub: true,
      },
      opacity: 0,
      
      duration: 1,
      delay: 0.5,
      ease: 'power2.out',
    });

    return () => typed.destroy();
  }, []);

  return (
  <div
  ref={parenRef}
  className="relative h-[100vh] w-full flex flex-col justify-center items-end p-4 bg-cover bg-center"
  style={{ backgroundImage: `url(${mainBg})` }}
>

      {/* Background image layer */}
  
    <div className="absolute top-0 left-0 w-full h-screen z-10  bg-black/30 md:bg-gradient-to-l md:from-white md:group-[.dark-mode]:from-black md:via-white/70 md:group-[.dark-mode]:via-black/50 md:to-transparent" />


      {/* Black gradient overlay */}

      {/* Text Content */}
      <div className="relative mobile z-20 md:mr-16 dark-text-s md:text-[#161616] md:group-[.dark-mode]:text-white text-right">
        <h1
          ref={headlineRef}
          className="text-2xl md:text-5xl poppins-extrabold leading-relaxed pb-8"
        >
          When your home thinks with you,<br /> life just flows easier.
        </h1>

        <h2
          ref={subtitleRef}
          className="text-base md:text-xl poppins-bold pb-3"
        >
          “Let{" "}
          <span className="poppins-extrabold bg-gradient-to-r from-fuchsia-500 to-pink-500 md:from-red-800 md:to-orange-700 bg-clip-text text-transparent group-[.dark-mode]:from-fuchsia-500 group-[.dark-mode]:to-pink-500">
            IndusTech Automations
          </span>{" "}
          turn your everyday moments into extraordinary ones.”
        </h2>

        <h4
          ref={typeRef}
          className=" pt-18 text-lg  "
        >
          <span className='text-xl md:text-3xl poppins-bold' ref={typedRef}></span>
        </h4>
      </div>
    </div>
  );
}

export default ScrollDiv;
