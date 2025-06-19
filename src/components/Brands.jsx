import google from '../assets/google home.png'
import apple from '../assets/apple.png'
import alexa from '../assets/alexa.png'



function Brands() {
    return (
        <div className="snap-start w-full h-[auto]  text-center dark-text-s light-text-s ">
            <div className="flex flex-col justify-center items-center w-full">
                <h1 data-aos="fade-down" className="text-2xl md:text-3xl gd-text poppins-extrabold">Our System Works with</h1>

                <div className="m-4 flex flex-col w-full bg-blue-100 group-[.dark-mode]:bg-[#313131]/30 justify-center items-center">
                    <h1 data-aos="fade-up" data-aos-delay="100" className="mt-4 text-lg"></h1>

                    <div className="flex justify-around flex-wrap gap-6 p-4 [&>*]:md:w-34 w-full max-w-[500px]">
                        <img data-aos="fade-right" src={google} alt="Google" className="w-[100px] h-auto object-contain" />
                        <img data-aos="fade-up" src={apple} alt="Apple" className="w-[100px] h-auto object-contain" />
                        <img data-aos="fade-left" src={alexa} alt="Alexa" className="w-[100px] h-auto object-contain" />
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Brands;