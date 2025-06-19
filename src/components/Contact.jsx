function Contact() {
    return (
        <div id="contact"  className=" w-screen h-auto min-h-screen flex flex-col items-center justify-center dark-text-s light-text-s px-4 py-8">
            <div data-aos="fade-up" className="text-center max-w-xl">
                <h1 className="poppins-extrabold gd-text text-3xl">Get a Free Smart Home Consultation</h1>
                <p className="text-sm poppins-regular m-4 text-center dark-text-l light-text-l">
                    Please let us know how we can help you and one of our Smart Home experts will follow-up with you in the next 24 hours
                </p>
            </div>

            <div data-aos="fade-up" className="form glass w-[90vw] max-w-4xl mt-6 p-6 flex flex-col gap-5 justify-center items-center">
                <h1 className="poppins-extrabold text-xl text-center">Ready To Automate Your Home?</h1>

                <form className="w-full grid grid-cols-1  md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Enter your name"
                        className="i-box"
                    />
                    <input
                        type="text"
                        placeholder="Enter your Company (Optional)"
                        className="i-box"
                    />


                    <input
                        type="email"
                        placeholder="Enter your Email"
                        className="i-box"
                    />

                    <input
                        type="tel"
                        placeholder="Enter your Phone Number"
                        className="i-box"
                    />

                    <textarea
                        rows="3"
                        placeholder="Tell us about yourself"
                        className="i-box md:col-span-2"
                    ></textarea>

                    <div className="md:col-span-2 text-center">
                        <button
                            className="bg-blue-700 hover:bg-indigo-600 text-white px-6 py-2 mt-2 rounded-md font-medium transition duration-300 hover:cursor-pointer"
                        >
                            Contact Us
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Contact;
