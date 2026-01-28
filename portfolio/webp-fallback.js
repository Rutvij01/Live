// WebP support detection and fallback
(function() {
  // Check WebP support
  function supportsWebP() {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => resolve(webP.height === 2);
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  // Replace WebP images with PNG fallbacks if WebP is not supported
  async function handleWebPFallback() {
    const supportsWebPFormat = await supportsWebP();
    
    if (!supportsWebPFormat) {
      console.log('WebP not supported, using PNG fallbacks');
      
      const webpImages = document.querySelectorAll('img[src*=".webp"]');
      webpImages.forEach(img => {
        const fallbackSrc = img.src.replace('img_optimized/', 'img/').replace('.webp', '.png');
        img.src = fallbackSrc;
      });
    }
  }

  // Run fallback check when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleWebPFallback);
  } else {
    handleWebPFallback();
  }
})();