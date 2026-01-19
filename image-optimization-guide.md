# Image Optimization Guide

## Recommended Tools & Settings

### 1. Image Compression
- **Tool**: Squoosh.app (free, web-based)
- **Settings**: 
  - JPEG: Quality 80-85%
  - PNG: Compression level 6-8
  - WebP: Quality 75-80%

### 2. Responsive Images
Create multiple sizes:
- **Large**: 1920x1080 (desktop hero)
- **Medium**: 1200x675 (tablet)
- **Small**: 800x450 (mobile)
- **Thumb**: 400x225 (thumbnails)

### 3. Modern Formats
- **WebP**: 25-35% smaller than JPEG
- **AVIF**: 50% smaller than WebP (modern browsers)
- **Fallback**: JPEG for older browsers

### 4. Loading Strategy
```html
<!-- Modern browsers -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.avif" type="image/avif">
  <img src="image.jpg" alt="Description" loading="lazy">
</picture>

<!-- Simple version -->
<img src="image.webp" alt="Description" loading="lazy">
```

### 5. CDN Recommendation
- **Cloudinary**: Automatic optimization & CDN
- **Imgix**: Real-time image processing
- **GitHub Pages**: Use GitHub's built-in CDN

## File Size Targets
- **Hero images**: <500KB
- **Gallery images**: <200KB
- **Thumbnails**: <50KB
- **Icons**: <10KB
