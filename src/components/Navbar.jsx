import * as React from 'react';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import logo from '../assets/logo.png';
import logob from '../assets/logob.png';
import '../index.css';

import ButtonLogin from './animations/ButtonLogin'

function Navbar() {
    const [scrolled, setScrolled] = React.useState(false);
    const [isDarkMode, setDarkMode] = React.useState(false);
    const [isMenuOpen, setMenuOpen] = React.useState(false); //mobile menu

    // Scroll-based navbar styling
    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Dark mode initialization
    React.useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (storedTheme === "dark" || (!storedTheme && systemPrefersDark)) {
            setDarkMode(true);
            document.documentElement.classList.add("dark-mode");
        } else {
            setDarkMode(false);
            document.documentElement.classList.remove("dark-mode");
        }
    }, []);

    // Apply theme when toggled
    React.useEffect(() => {
        const root = document.documentElement;
        if (isDarkMode) {
            root.classList.add("dark-mode");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark-mode");
            localStorage.setItem("theme", "light");
        }
    }, [isDarkMode]);

    const toggleDarkMode = (checked) => {
        setDarkMode(checked);
    };

    return (
        <div
            className={` navbar flex justify-between w-screen items-center h-auto fixed top-0 left-0 z-[999] py-2 transition-all duration-300 px-6 ${scrolled ? 'bg-white/5 backdrop-blur-sm border-b border-grey-500 group-[.dark-mode]:border-white/10' : ''
                }`}
        >
            {/* Left logo */}
            <div className='flex items-center  gap-6'>

                <img className='w-[50px]' src={isDarkMode ? logo : logob} alt="logo" />
                <h1 className='hidden md:flex poppins-extrabold dark-text-s light-text-s text-3xl '>Industech Automations</h1>
            </div>

            {/* Right navigation */}
            <div className="flex flex-row-reverse md:flex-row items-center gap-6">
                {/* Desktop Menu */}
                <ul className='hidden md:flex gap-10 dark-text-s group-[.dark-mode]:[&>*]:hover:text-emerald-50 light-text-s [&>*]:hover:scale-105 [&>*]:hover:text-cyan-950 [&>*]:poppins-bold'>
                    <li><a href="#services" className='poppins-bold'>Services</a></li>
                    <li><a href="#about" className='poppins-bold'>About</a></li>
                    <li><a href="#contact" className='poppins-bold'>Contact</a></li>
                    <li><ButtonLogin /></li>

                </ul>

                {/* Mobile Menu */}
                <ul className='flex md:hidden gap-6 dark-text-s light-text-s'>
                    <li>
                        <i
                            className="cursor-pointer fa fa-outdent text-xl"
                            onClick={() => setMenuOpen(true)}
                        ></i>
                    </li>
                </ul>

                {/* Dark Mode Switch */}
                <DarkModeSwitch
                    checked={isDarkMode}
                    onChange={toggleDarkMode}
                    size={30}
                    className="ml-4"
                    sunColor="#020024"
                    moonColor="#fff"
                />

                {/* Mobile Menu Dropdown */}
                <div
                    className={`fixed md:hidden block top-0 right-0 h-screen w-[50vw] bg-white/60 group-[.dark-mode]:bg-black/60  border-b border-grey-500 group-[.dark-mode]:border-white/10 z-[9999] transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    <div className="flex justify-end p-6">
                        <i
                            className="fa fa-close text-2xl cursor-pointer dark-text-s light-text-s "
                            onClick={() => setMenuOpen(false)}
                        ></i>
                    </div>
                    <ul className='flex flex-col gap-6 items-start px-10 mt-10 text-lg dark-text-s light-text-s poppins-bold'>
                        <li><a href="#services" onClick={() => setMenuOpen(false)}>Services</a></li>
                        <li><a href="#about" onClick={() => setMenuOpen(false)}>About</a></li>
                        <li><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></li>
                        <li > <a href="#" onClick={() => setMenuOpen(false)}>LogIn</a></li>
                    </ul>

                </div>

                {/* Overlay for mobile menu */}
                {isMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/5 backdrop-blur-xs h-screen z-[9990]"
                        onClick={() => setMenuOpen(false)}
                    ></div>
                )}
            </div>
        </div>
    );
}

export default Navbar;
