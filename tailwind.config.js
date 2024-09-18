/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./src/**/*.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1240px",
      "2xl": "1440px",
      "3xl": "1650px",
    },
    extend: {
      backgroundImage: {
        // teaser page
        "text-img-desktop": "url('./images/text-section/bg-desktop.webp')",
        "text-img-mobil": "url('./images/text-section/bg-mobil.webp')",
        "video-img-mobil": "url('./images/teaser-video-section/bg-mobil.webp')",
        "video-img-desktop":
          "url('./images/teaser-video-section/bg-desktop.webp')",
        // launch page
        "launch-hero-mobile": "url('./images/hero-mobile.webp')",
        "launch-hero-desktop": "url('./images/hero-desktop.webp')",
        "launch-video-img": "url('./images/girl-bg.webp')",
        "launch-img-text-desktop":
          "url('./images/image-text-section/bg-desktop.webp')",
        "launch-img-text-mobil":
          "url('./images/image-text-section/bg-mobil.webp')",
        // gradient
        "bronze-gradient":
          "linear-gradient(210.29deg, #966E45 10.99%, #D6B587 50%, #895A2E 89.01%)",
        "hero-gradient":
          "linear-gradient(180deg, #470407 0%, #E3101F 74.5%, #470407 100%)",
      },
      colors: {
        bronze: {
          100: "#977D57",
          200: "#A67F58",
          300: "#F5C65D",
        },
        blue: "#1D3671",
        red: "#A33735",
        gray: "#8993A9",
      },
      fontFamily: {
        acumin: ["AcuminProCondensed", "sans-serif"],
        agipo: ["AgipoBoldCondensed", "sans-serif"],
        netto: ["NettoProBold", "sans-serif"],
      },
      letterSpacing: {
        "8percent": "0.08em",
      },
    },
  },
  plugins: [],
};
