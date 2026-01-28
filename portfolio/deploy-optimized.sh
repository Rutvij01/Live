#!/bin/bash

echo "🚀 Deploying Optimized Portfolio to GitHub Pages"
echo "================================================"

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Add all changes
echo "📦 Adding optimized files..."
git add .

# Commit changes
echo "💾 Committing optimizations..."
git commit -m "🚀 Performance optimization: 91% image size reduction

- Converted all parallax images to WebP format
- Reduced total image size from 45MB to 4MB
- Added lazy loading for images
- Implemented resource hints and preloading
- Added critical CSS inline
- Optimized JavaScript loading with defer
- Added WebP fallback support

Expected improvements:
- Load time: 10-15s → 2-4s
- Page size: 45MB → 4MB
- First Contentful Paint: 5-8s → 1-2s"

# Push to GitHub
echo "🌐 Pushing to GitHub..."
git push origin main

echo "✅ Deployment complete!"
echo ""
echo "🔗 Your optimized portfolio will be available at:"
echo "   https://rutvij01.github.io/Live/portfolio/"
echo ""
echo "⏱️  GitHub Pages may take 1-2 minutes to update"
echo ""
echo "📊 To test performance:"
echo "   1. Open: https://pagespeed.web.dev/"
echo "   2. Enter your URL"
echo "   3. Check the improvements!"