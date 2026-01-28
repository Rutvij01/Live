# Image Optimization Guide for Your Portfolio

## Current Issues
Your parallax images are likely 1-5MB each, causing slow loading.

## Solutions

### Option 1: Use Online Tools
1. **TinyPNG** (https://tinypng.com/)
   - Upload your PNG images
   - Download compressed versions (60-80% smaller)

2. **Squoosh** (https://squoosh.app/)
   - Convert to WebP format
   - Adjust quality settings

### Option 2: Use Command Line Tools
```bash
# Install ImageMagick
# For Ubuntu/Debian:
sudo apt-get install imagemagick

# For macOS:
brew install imagemagick

# Optimize images
mogrify -resize 1920x1080 -quality 85 -format webp img/*.png
```

### Option 3: Create Multiple Sizes
```html
<!-- Replace current img tags with responsive images -->
<img 
  src="img/mountain_1_small.webp" 
  srcset="img/mountain_1_small.webp 480w, 
          img/mountain_1_medium.webp 768w, 
          img/mountain_1_large.webp 1200w"
  sizes="(max-width: 480px) 480px, 
         (max-width: 768px) 768px, 
         1200px"
  alt="Mountain layer 1"
  loading="lazy"
/>
```

## Target Sizes
- **Hero images**: < 200KB each
- **Other images**: < 100KB each
- **Total page size**: < 2MB