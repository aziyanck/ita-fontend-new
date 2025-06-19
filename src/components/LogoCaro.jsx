import { useEffect, useState } from "react";
import './LogoCaro.css';

/**
 * LogoCaro Component
 * * This component displays a continuously scrolling vertical carousel of brand logos.
 * It dynamically imports logo images from a specified directory.
 */
function LogoCaro() {
  const [logos, setLogos] = useState([]);
 
  // Effect to load logo images on component mount.
  // It uses import.meta.glob for vite-based projects to eagerly load all images from the assets folder.
  useEffect(() => {
    // Note: The path is relative to the component file. Adjust if your folder structure is different.
    const imports = import.meta.glob("../assets/Brand_logos/*.{png,jpg,jpeg,svg}", {
      eager: true,
    });
    const paths = Object.values(imports).map((mod) => mod?.default || mod);
    setLogos(paths);
  }, []);

  // Organize logos into rows. Each row will contain up to 7 logos.
  const rows = [];
  for (let i = 0; i < logos.length; i += 7) {
    rows.push(logos.slice(i, i + 7));
  }

  // We only want to display the first two rows in the carousel.
  const twoRows = rows.slice(0, 2);

  return (
    <div className="relative w-full flex flex-col items-center bg-transparent py-8 sm:py-12">
      <h1 className="text-2xl md:text-3xl font-extrabold gd-text poppins-extrabold mt-8 mb-2 text-center">
        Connected Experiences
      </h1>
      <p className="text-center text-base font-medium text-gray-600 dark:text-gray-300 max-w-4xl mb-8 px-4">
        Our flexible platform can integrate diverse products from leading manufacturers.
      </p>

      {/* The main container for the logo carousel. It has a fixed height and hides overflow. */}
      <div className="logo-box ">
        {/* The slider contains the logo rows and is animated vertically. */}
        <div className="logo-slider">
          {/* Render the first two rows of logos. */}
          {twoRows.map((row, rowIndex) => (
            <div key={rowIndex} className="logo-row">
              {row.map((logo, index) => (
                <img
                  key={`${rowIndex}-${index}`}
                  src={logo}
                  alt={`logo-${index}`}
                  className="logo-img"
                />
              ))}
            </div>
          ))}

          {/* Duplicate the same two rows to create the seamless looping effect for the animation. */}
          {twoRows.map((row, rowIndex) => (
            <div key={`duplicate-${rowIndex}`} className="logo-row">
              {row.map((logo, index) => (
                <img
                  key={`duplicate-${rowIndex}-${index}`}
                  src={logo}
                  alt={`logo-${index}`}
                  className="logo-img"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LogoCaro;
