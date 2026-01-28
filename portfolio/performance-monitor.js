// Performance monitoring script
// Add this to your app.js or run in browser console

function analyzePerformance() {
  // Wait for page to fully load
  window.addEventListener('load', () => {
    setTimeout(() => {
      console.log('🚀 PERFORMANCE ANALYSIS');
      console.log('========================');
      
      // Page load metrics
      const navigation = performance.getEntriesByType('navigation')[0];
      const loadTime = Math.round(navigation.loadEventEnd - navigation.fetchStart);
      const domContentLoaded = Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart);
      const firstPaint = Math.round(performance.getEntriesByName('first-paint')[0]?.startTime || 0);
      const firstContentfulPaint = Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0);
      
      console.log(`⏱️  Total Load Time: ${loadTime}ms`);
      console.log(`📄 DOM Content Loaded: ${domContentLoaded}ms`);
      console.log(`🎨 First Paint: ${firstPaint}ms`);
      console.log(`🖼️  First Contentful Paint: ${firstContentfulPaint}ms`);
      
      // Resource analysis
      const resources = performance.getEntriesByType('resource');
      const totalSize = resources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0);
      const imageResources = resources.filter(r => r.name.includes('.webp') || r.name.includes('.png') || r.name.includes('.jpg'));
      const imageSize = imageResources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0);
      
      console.log(`📦 Total Resources: ${resources.length}`);
      console.log(`💾 Total Size: ${Math.round(totalSize / 1024)}KB`);
      console.log(`🖼️  Image Size: ${Math.round(imageSize / 1024)}KB`);
      
      // Largest resources
      const largestResources = resources
        .filter(r => r.transferSize > 0)
        .sort((a, b) => b.transferSize - a.transferSize)
        .slice(0, 10)
        .map(r => ({
          name: r.name.split('/').pop(),
          size: Math.round(r.transferSize / 1024) + 'KB',
          time: Math.round(r.duration) + 'ms'
        }));
      
      console.log('📊 Largest Resources:');
      console.table(largestResources);
      
      // Performance score estimation
      let score = 100;
      if (loadTime > 3000) score -= 30;
      else if (loadTime > 2000) score -= 15;
      if (firstContentfulPaint > 2000) score -= 20;
      else if (firstContentfulPaint > 1500) score -= 10;
      if (totalSize > 3000000) score -= 20; // 3MB
      else if (totalSize > 2000000) score -= 10; // 2MB
      
      console.log(`🏆 Estimated Performance Score: ${Math.max(0, score)}/100`);
      
      // Recommendations
      console.log('💡 RECOMMENDATIONS:');
      if (loadTime > 3000) console.log('- ⚠️  Page load time is slow (>3s)');
      if (firstContentfulPaint > 2000) console.log('- ⚠️  First Contentful Paint is slow (>2s)');
      if (totalSize > 2000000) console.log('- ⚠️  Total page size is large (>2MB)');
      if (imageSize > 1000000) console.log('- ⚠️  Image size is large (>1MB)');
      
      console.log('========================');
    }, 1000);
  });
}

// Auto-run analysis
analyzePerformance();