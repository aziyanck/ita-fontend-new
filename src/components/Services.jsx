import React, { useEffect, useRef, useState } from 'react';
import ServiceCard from './sub_comp/ServiceCard';
import serviceData from './sub_comp/sevice_data';

function Services() {
    const scrollRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalCards = serviceData.length;

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const interval = setInterval(() => {
            let nextIndex = (currentIndex + 1) % totalCards;
            goToSlide(nextIndex);
        }, 3000); // Auto-scroll every 3 seconds

        return () => clearInterval(interval);
    }, [currentIndex]);

    const goToSlide = (index) => {
        const container = scrollRef.current;
        if (container) {
            const width = container.offsetWidth;
            container.scrollTo({
                left: index * width,
                behavior: 'smooth',
            });
            setCurrentIndex(index);
        }
    };

    const handleScroll = () => {
        const container = scrollRef.current;
        if (container) {
            const scrollLeft = container.scrollLeft;
            const width = container.offsetWidth;
            const index = Math.round(scrollLeft / width);
            setCurrentIndex(index);
        }
    };

    return (
        <div id="services" className="w-full h-auto pb-40 xl:pb-0 lg:h-screen overflow-hidden flex flex-col justify-center items-center">
            <h1 className="text-3xl poppins-extrabold  gd-text p-4">Services</h1>

            {/* Horizontal Scroll Container */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="relative w-screen h-auto overflow-x-auto scroll-smooth snap-x snap-mandatory whitespace-nowrap hide-scrollbar mask-gradient"
            >
                {serviceData.map((item, index) => (
                    <div
                        key={index}
                        className="inline-block snap-start w-screen px-0 box-border"
                    >
                        <div className="flex justify-center">
                            <ServiceCard
                                img={item.img}
                                title={item.title}
                                desc={item.desc}
                                reverse={index % 2 !== 0}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Dots */}
            <div className="flex gap-2 mt-4">
                {serviceData.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goToSlide(i)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            currentIndex === i ? 'bg-blue-600' : 'bg-gray-400'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}

export default Services;
