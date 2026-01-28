// Add this to your app.js to implement lazy loading for parallax images

// Lazy loading for parallax images
function implementLazyLoading() {
  const parallaxImages = document.querySelectorAll('.parallax');
  
  // Create intersection observer
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // If image has data-src, load it
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      }
    });
  });

  // Observe all parallax images
  parallaxImages.forEach(img => {
    imageObserver.observe(img);
  });
}

// Call after DOM is loaded
document.addEventListener('DOMContentLoaded', implementLazyLoading);

// Progressive loading - load critical images first
function loadCriticalImages() {
  const criticalImages = [
    'img/background.png',
    'img/mountain_1.png',
    'img/mountain_2.png'
  ];
  
  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

// Load critical images immediately
loadCriticalImages();