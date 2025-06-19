


function Footer() {
    return (
        <footer className="bg-black/5 group-[.dark-mode]:bg-black/40 text-white py-8">
            <div className="max-w-7xl text-ft mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                <div className="col-span-1">
                    <h3 className="text-lg font-semibold mb-4">About Us</h3>
                    <p className="text-gray-400 text-sm">
                        Industech Automations (ITA), established in 2015 in Madurai, offers smart automation and security solutions for homes and industries. Our expert team ensures seamless system design, integration, and control.
                    </p>
                </div>

                <div className="col-span-1">
                    <h3 className="text-lg font-semibold mb-4">Services</h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li>Security Systems</li>
                        <li>Smart Lighting</li>
                        <li>Video Surveillance</li>
                        <li>Smart Locks</li>
                        <li>Fire Detection</li>
                    </ul>
                </div>

                <div className="col-span-1">
                    <h3 className="text-lg font-semibold mb-4">Contact</h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li><i className="fa-solid fa-phone"></i> 9999 9999 99</li>
                        <li><i className="fa-solid fa-envelope"></i> hxkxbmabh.com</li>
                        <li><i className="fa-solid fa-location-dot"></i> Moonrumavadi</li>
                    </ul>
                </div>

                <div className="col-span-1">
                    <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li>Monday - Friday: 8:00 AM - 6:00 PM</li>
                        <li>Saturday: 9:00 AM - 4:00 PM</li>
                        <li>Sunday: Emergency calls only</li>
                        <li>24/7 Emergency Support</li>
                    </ul>
                </div>

            </div>
        </footer>
    )
}
export default Footer;