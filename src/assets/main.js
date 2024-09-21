// Video section functionality
window.addEventListener("load", () => {
  const playButton = document.getElementById("custom-play-button");
  const video = document.getElementById("main-video");
  const thumbnail = document.getElementById("video-thumbnail");
  const videoSection = document.getElementById("video-section");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        thumbnail.classList.add("hidden");
        playButton.classList.add("hidden");
        video.classList.remove("hidden");
        video.muted = true;
        video.play();
      }
    });
  });

  observer.observe(videoSection);

  playButton.addEventListener("click", () => {
    thumbnail.classList.add("hidden");
    playButton.classList.add("hidden");
    video.classList.remove("hidden");
    video.muted = true;
    video.play();
  });
});

// 360 degree viewer
window.addEventListener("load", () => {
  const locale = window.locale === "it" ? "ITA" : "EU";
  const jsv = new JavascriptViewer({
    imageUrlFormat: `BARILLA AL BRONZO_MEZZI RIGATONI_${locale}_Fxxx.png`,
    totalFrames: 300,
    defaultProgressBar: false,
    speed: 40,
    reverse: true,
    license: "3acqozzwfopkkk7==2024/09/18--www.barilla.com",
    autoRotate: 1000,
    autoRotateSpeed: 10,
    autoRotateReverse: true,
  });

  jsv
    .start()
    .then(() => console.log("viewer started"))
    .catch((e) => console.log("failed loading 360 viewer: " + e));
});

// Lightbox initialization
const lightbox = GLightbox({
  plyr: {
    config: {
      ratio: "16:9",
      muted: false,
      hideControls: true,
      youtube: {
        noCookie: true,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
      },
      vimeo: {
        byline: false,
        portrait: false,
        title: false,
        speed: true,
        transparent: false,
      },
    },
  },
});

// Swiper initialization
document.addEventListener("DOMContentLoaded", () => {
  // Product Swiper
  const productProgressBar = document.querySelector(".progress");
  const productSwiper = new Swiper(".mySwiper", {
    init: false,
    slidesPerView: 1,
    spaceBetween: 10,
    lazy: true,
    pagination: false,
    navigation: {
      nextEl: ".custom-button-next",
      prevEl: ".custom-button-prev",
    },
    on: {
      init: updateProductProgressBar,
      slideChange: updateProductProgressBar,
    },
    breakpoints: {
      640: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });

  productSwiper.init();

  function updateProductProgressBar() {
    const totalSlides = productSwiper.slides.length;
    const currentIndex =
      productSwiper.activeIndex + productSwiper.params.slidesPerView;
    const progressPercentage = (currentIndex / totalSlides) * 100;
    productProgressBar.style.width = `${Math.min(progressPercentage, 100)}%`;
  }

  // Video Swiper
  const videoProgressBar = document.querySelector(".video-progress-bar");
  const videoSwiper = new Swiper(".videoSwiper", {
    init: false,
    slidesPerView: 1,
    spaceBetween: 10,
    lazy: true,
    pagination: false,
    navigation: {
      nextEl: ".custom-video-button-next",
      prevEl: ".custom-video-button-prev",
    },
    on: {
      init: updateVideoProgressBar,
      slideChange: updateVideoProgressBar,
    },
    breakpoints: {
      640: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });

  videoSwiper.init();

  function updateVideoProgressBar() {
    const totalSlides = videoSwiper.slides.length;
    const currentIndex =
      videoSwiper.activeIndex + videoSwiper.params.slidesPerView;
    const progressPercentage = (currentIndex / totalSlides) * 100;
    videoProgressBar.style.width = `${Math.min(progressPercentage, 100)}%`;
  }
});

// Logo fade-out functionality
function handleLogoFade() {
  const logo = document.querySelector(".bronzo-logo");
  const scrollThreshold = 10;

  window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY;

    if (scrollPosition > scrollThreshold) {
      logo.classList.add("fade-out");
    } else {
      logo.classList.remove("fade-out");
    }
  });
}

document.addEventListener("DOMContentLoaded", handleLogoFade);

document.addEventListener("DOMContentLoaded", () => {
  const scrollArrow = document.getElementById("scroll-arrow");

  if (scrollArrow) {
    scrollArrow.addEventListener("click", () => {
      const currentSection = scrollArrow.closest("section");
      if (currentSection) {
        const nextSection = currentSection.nextElementSibling;
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  }
});

let lastScrollTop = 0;
let snapDisabled = false;

function handleScroll() {
  const html = document.documentElement;
  const sections = document.querySelectorAll("section");
  const lastSection = sections[sections.length - 1];
  const lastSectionBottom = lastSection.offsetTop + lastSection.offsetHeight;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollPosition = scrollTop + window.innerHeight;

  // Determine scroll direction
  const scrollingDown = scrollTop > lastScrollTop;
  lastScrollTop = scrollTop;

  if (scrollingDown && scrollPosition > lastSectionBottom && !snapDisabled) {
    // Disable snap scrolling when scrolling down past the last section
    html.style.scrollSnapType = "none";
    snapDisabled = true;
  } else if (
    !scrollingDown &&
    scrollPosition <= lastSectionBottom &&
    snapDisabled
  ) {
    // Re-enable snap scrolling when scrolling up to or above the last section
    html.style.scrollSnapType = "y mandatory";
    snapDisabled = false;
  }
}

// Throttle function to limit how often handleScroll is called
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Add scroll event listener with throttling
window.addEventListener("scroll", throttle(handleScroll, 100));

// Initial call to set correct state on page load
handleScroll();
