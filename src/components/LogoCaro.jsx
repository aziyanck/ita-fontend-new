import { useEffect, useState } from "react";
import './LogoCaro.css';
import { useMediaQuery } from "react-responsive";

function LogoCaro() {
  const [logos, setLogos] = useState([]);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    const imports = import.meta.glob("../assets/Brand_logos/*.{png,jpg,jpeg,svg}", {
      eager: true,
    });
    const paths = Object.values(imports).map((mod) => mod?.default || mod);
    setLogos(paths);
  }, []);

  const logosPerRow = isMobile ? 4 : 8;
  const rowsToShow = isMobile ? 4 : 2;
  const totalHeight = isMobile ? 300 : 260; // match CSS animation

  const rows = [];
  for (let i = 0; i < logos.length; i += logosPerRow) {
    rows.push(logos.slice(i, i + logosPerRow));
  }
  const visibleRows = rows.slice(0, rowsToShow);

  return (
    <div className="relative w-full flex flex-col items-center bg-transparent py-8 sm:py-12">
      <h1 className="text-2xl md:text-3xl font-extrabold gd-text poppins-extrabold mt-8 mb-2 text-center">
        Connected Experiences
      </h1>
      <p className="text-center text-base font-medium light-text-vl dark-text-l max-w-4xl mb-8 px-4">
        Our flexible platform can integrate diverse products from leading manufacturers.
      </p>

      {/* The main container for the logo carousel. It has a fixed height and hides overflow. */}
      <div className="logo-box bg-blue-100 group-[.dark-mode]:bg-[#313131]/30" style={{ height: `${totalHeight}px` }}>
        {/* The slider contains the logo rows and is animated vertically. */}
        <div className="logo-slider">
          {/* Render the first two rows of logos. */}
          {visibleRows.map((row, rowIndex) => (
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
          {visibleRows.map((row, rowIndex) => (
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