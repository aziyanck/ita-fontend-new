function WhyIta() {
    return (
        <div className="flex justify-center items-center w-full h-auto dark-text-s light-text-s p-4">
            <div className="flex flex-col justify-center items-center w-full max-w-6xl">
                <h1 data-aos="fade-down" className="text-2xl md:text-3xl gd-text poppins-extrabold p-4 mt-8 text-center">
                    Why Choose ITA?
                </h1>
                <p className="pb-4 light-text-vl dark-text-l text-center text-sm md:text-base max-w-xl">
                    Industry-leading security solutions backed by years of experience
                </p>

                <div className="w-full flex flex-wrap justify-center items-stretch gap-6 p-4">
                    <div data-aos="fade-up" className="card-v flex flex-col items-center md:w-[30vw] sm:w-[300px] bg-white/5 rounded-xl shadow p-4 transition-all hover:scale-105 hover:shadow-md ease-in-out duration-300">
                        <div className="w-[80px] h-[80px] m-4 rounded-full flex justify-center items-center l-bg">
                            <i className="fa-solid fa-shield i-text text-xl"></i>
                        </div>
                        <p className="text-lg text-center poppins-extrabold">Professional Installation</p>
                        <p className="text-sm mt-2 text-center poppins-regular">
                            Certified technicians ensure proper setup and integration of all security systems
                        </p>
                    </div>

                    <div data-aos="fade-up" className="card-v flex flex-col items-center md:w-[30vw] sm:w-[300px] bg-white/5 rounded-xl shadow p-4 transition-all hover:scale-105 hover:shadow-md ease-in-out duration-300">
                        <div className="w-[80px] h-[80px] m-4 rounded-full flex justify-center items-center l-bg">
                            <i className="fa-solid fa-user-plus i-text text-xl"></i>
                        </div>
                        <p className="text-lg text-center poppins-extrabold">24/7 Support</p>
                        <p className="text-sm mt-2 text-center poppins-regular">
                            Round-the-clock monitoring and emergency response to keep you protected
                        </p>
                    </div>

                    <div data-aos="fade-up" className="card-v flex flex-col items-center md:w-[30vw] sm:w-[300px] bg-white/5 rounded-xl shadow p-4 transition-all hover:scale-105 hover:shadow-md ease-in-out duration-300">
                        <div className="w-[80px] h-[80px] m-4 rounded-full flex justify-center items-center l-bg">
                            <i className="fa-solid fa-check-to-slot i-text text-xl"></i>
                        </div>
                        <p className="text-lg text-center poppins-extrabold">Proven Track Record</p>
                        <p className="text-sm mt-2 text-center poppins-regular">
                            Over 10 years in building home automation with satisfied customers
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WhyIta;
