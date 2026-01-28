#!/usr/bin/env python3
import re

# Read the HTML file
with open('index.html', 'r') as f:
    content = f.read()

# Define the image mappings
image_mappings = {
    'img/background.png': 'img_optimized/background.webp',
    'img/fog_7.png': 'img_optimized/fog_7.webp',
    'img/mountain_10.png': 'img_optimized/mountain_10.webp',
    'img/fog_6.png': 'img_optimized/fog_6.webp',
    'img/mountain_9.png': 'img_optimized/mountain_9.webp',
    'img/mountain_8.png': 'img_optimized/mountain_8.webp',
    'img/fog_5.png': 'img_optimized/fog_5.webp',
    'img/mountain_7.png': 'img_optimized/mountain_7.webp',
    'img/mountain_6.png': 'img_optimized/mountain_6.webp',
    'img/fog_4.png': 'img_optimized/fog_4.webp',
    'img/mountain_5.png': 'img_optimized/mountain_5.webp',
    'img/fog_3.png': 'img_optimized/fog_3.webp',
    'img/mountain_4.png': 'img_optimized/mountain_4.webp',
    'img/mountain_3.png': 'img_optimized/mountain_3.webp',
    'img/fog_2.png': 'img_optimized/fog_2.webp',
    'img/mountain_2.png': 'img_optimized/mountain_2.webp',
    'img/mountain_1.png': 'img_optimized/mountain_1.webp',
    'img/sun_rays.png': 'img_optimized/sun_rays.webp',
    'img/black_shadow.png': 'img_optimized/black_shadow.webp',
    'img/fog_1.png': 'img_optimized/fog_1.webp'
}

# Replace all image paths and add loading="lazy" to parallax images
for old_path, new_path in image_mappings.items():
    # Pattern to match img tags with the old path
    pattern = rf'<img\s+src="{re.escape(old_path)}"([^>]*?)class="parallax([^"]*?)"([^>]*?)/?>'
    
    def replacement(match):
        attrs_before = match.group(1)
        parallax_classes = match.group(2)
        attrs_after = match.group(3)
        
        # Add loading="lazy" if not already present
        if 'loading=' not in attrs_before + attrs_after:
            attrs_after += '\n          loading="lazy"'
        
        return f'<img\n          src="{new_path}"{attrs_before}class="parallax{parallax_classes}"{attrs_after}\n        />'
    
    content = re.sub(pattern, replacement, content)

# Write the updated content back
with open('index.html', 'w') as f:
    f.write(content)

print("✅ Updated all parallax images to optimized WebP versions with lazy loading!")