import React, { useState } from 'react';

import { supabase } from '/src/admin_components/supabaseClient'; 

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        message: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatusMessage('Submitting your registration...');

        try {
            // This is where the supabase object is used
            const { error } = await supabase.functions.invoke('contact-form', {
                body: formData,
            });

            if (error) {
                throw error;
            }

            setStatusMessage('You are successfully registered. We will contact you soon.');
            setFormData({ name: '', company: '', email: '', phone: '', message: '' });

        } catch (error) {
            setStatusMessage('Sorry, something went wrong. Please try again.');
            console.error('Error submitting registration:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div id="contact"  className="w-screen h-auto min-h-screen flex flex-col items-center justify-center dark-text-s light-text-s px-4 py-8">
            <div data-aos="fade-up" className="text-center max-w-xl">
                <h1 className="poppins-extrabold gd-text text-3xl">Get a Free Smart Home Consultation</h1>
                <p className="text-sm poppins-regular m-4 text-center dark-text-l light-text-l">
                    Please let us know how we can help you and one of our Smart Home experts will follow-up with you in the next 24 hours
                </p>
            </div>

            <div data-aos="fade-up" className="form glass w-[90vw] max-w-4xl mt-6 p-6 flex flex-col gap-5 justify-center items-center">
                <h1 className="poppins-extrabold text-xl text-center">Ready To Automate Your Home?</h1>

                <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        className="i-box"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="company"
                        placeholder="Enter your Company (Optional)"
                        className="i-box"
                        value={formData.company}
                        onChange={handleChange}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your Email"
                        className="i-box"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Enter your Phone Number"
                        className="i-box"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        rows="3"
                        name="message"
                        placeholder="Tell us about yourself"
                        className="i-box md:col-span-2"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    ></textarea>

                    <div className="md:col-span-2 text-center">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-700 hover:bg-indigo-600 text-white px-6 py-2 mt-2 rounded-md font-medium transition duration-300 hover:cursor-pointer disabled:bg-gray-500"
                        >
                            {isLoading ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                </form>
                
                {statusMessage && <p className="mt-4 text-center">{statusMessage}</p>}
            </div>
        </div>
    );
}

export default Contact;
