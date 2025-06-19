
import { useState, useEffect } from 'react';

import Loader from "../components/animations/Loader"

import TestimonialCard from '../components/sub_comp/TestimonialCard';
import testimonialData from '../components/sub_comp/testimonial_data';
import getCombinedReviews from '../components/sub_comp/combined_review';

function Review() {


    const [reviewData, setReviewData] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            const reviews = await getCombinedReviews();
            setReviewData(reviews.slice(0, 5)); // Show only the first 5 if needed
        };

        fetchReviews();
    }, []);


    return (
        <div className="review h-auto  w-screen z-[100] flex flex-col justify-center items-center gap-10">

            <div data-aos="fade-up" className="connect w-screen bg-blue-100 group-[.dark-mode]:bg-[#313131]/30 h-[auto] flex flex-col justify-center items-center gap-8">
                <h1 className="text-3xl poppins-extrabold gd-text p-4">Connect With Us</h1>
                <div className=" text-st w-screen md:h-[auto] pb-10 flex justify-center flex-wrap items-center gap-15 text-3xl ">
                    <a href="" className='hover:text-blue-400 hover-s-up'><i className="fa-brands fa-linkedin-in"></i></a>
                    <a href="" className='hover:text-pink-600 hover-s-up'><i className="fa-brands fa-instagram"></i></a>
                    <a href="" className='hover:text-blue-600 hover-s-up'><i className="fa-brands fa-facebook-f"></i></a>
                    <a href="" className='hover:text-green-500 hover-s-up'><i className="fa-brands fa-whatsapp"></i></a>
                    <a href="" className='hover:text-red-600 hover-s-up'><i className="fa-solid fa-envelope"></i></a>
                    <a href="tel:9447673262" className='hover:text-blue-500 hover-s-up'><i className="fa-solid fa-phone-volume"></i></a>
                </div>
            </div>

            <div className="review-div w-screen h-auto flex flex-col justify-around  md:flex-row items-center gap-8 ">
                <div className="left ">
                    <h1 data-aos="slide-right" className="text-3xl pl-8 ml-4 md:text-5xl poppins-extrabold gd-text p-4">Our Customer Review Says it All</h1>

                </div>
                <div className="right w-auto h-full">

                    <div data-aos="slide-up" className="p-6 md:p-10 flex flex-wrap gap-6 justify-center">
                        {reviewData.length === 0 ? (
                            <>

                                <Loader />
                            </>
                        ) : (
                            reviewData.map((review, index) => (
                                <TestimonialCard
                                    key={index}
                                    text={review.text}
                                    name={review.name}
                                    role={review.role}
                                    rating={review.rating}
                                    image={review.image}
                                />
                            ))
                        )}
                    </div>

                </div>


            </div>


        </div>
    )
}

export default Review;