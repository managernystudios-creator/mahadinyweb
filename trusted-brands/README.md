# Trusted Brands Module

This module contains all the code for the trusted brands section that displays a scrolling marquee of client brands.

## Structure

```
trusted-brands/
├── css/
│   └── trusted-brands.css    # All styles for the trusted brands section
├── js/
│   └── trusted-brands.js     # JavaScript functionality and class
├── html/
│   └── trusted-brands.html   # HTML template for the section
└── README.md                 # This documentation file
```

## Features

- **Scrolling Animation**: Smooth horizontal scrolling marquee effect
- **Hover Effects**: Interactive hover animations on brand items
- **Responsive Design**: Mobile-friendly layout and sizing
- **Dynamic Content**: Brands populated from configuration data
- **Modular Architecture**: Self-contained module with clean API

## Usage

### HTML Integration
Include the HTML template in your main page:
```html
<!-- Include the trusted brands section -->
<div id="trusted-brands-section">
    <!-- Content from trusted-brands.html goes here -->
</div>
```

### CSS Integration
Link the CSS file in your HTML head:
```html
<link rel="stylesheet" href="trusted-brands/css/trusted-brands.css"/>
```

### JavaScript Integration
Load the JavaScript file before your main scripts:
```html
<script src="trusted-brands/js/trusted-brands.js" defer></script>
```

### API Usage
```javascript
// Initialize with brand data
initTrustedBrands(brandData);

// Update brands data
updateTrustedBrands(newBrandData);

// Pause animation
pauseTrustedBrandsAnimation();

// Resume animation
resumeTrustedBrandsAnimation();

// Destroy instance
destroyTrustedBrands();
```

## Configuration

The module expects brand data in the following format:
```javascript
const brandData = [
    {
        name: "Brand Name",
        subs: "1.2M Subs",
        ytUrl: "https://youtube.com/@brand" // Optional
    },
    // ... more brands
];
```

## Styling

The module uses CSS custom properties for theming:
- `--background`: Background color
- `--card`: Card background color
- `--foreground`: Text color
- `--primary`: Primary accent color
- `--accent`: Secondary accent color
- `--glass-border`: Border color for glass effect

## Animation

The scrolling animation uses CSS keyframes with a 28-second duration for smooth, continuous scrolling. The animation can be paused/resumed programmatically.

## Responsive Breakpoints

- **Desktop**: Full layout with all effects
- **Mobile (≤768px)**: Reduced spacing and smaller elements
- **Tablet**: Intermediate sizing

## Dependencies

- No external JavaScript dependencies
- Uses modern CSS features (CSS Grid, Flexbox, Custom Properties)
- Compatible with modern browsers (ES6+)

