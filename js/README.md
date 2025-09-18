# JavaScript File Structure

This directory contains the refactored JavaScript code, split into logical sections for better maintainability and organization.

## File Organization

### 1. `main.js`
- **Purpose**: Main application loader and initializer
- **Responsibilities**: 
  - Loads configuration from `config.json`
  - Orchestrates the initialization process
  - Calls all population and initialization functions

### 2. `theme.js`
- **Purpose**: Theme management functionality
- **Responsibilities**:
  - Applies color variables from theme configuration
  - Sets typography (font families)
  - Applies layout variables (radius, shadows, etc.)
  - Configures navigation styles

### 3. `populate.js`
- **Purpose**: Data population functions
- **Responsibilities**:
  - `populateNavigation()` - Sets up site title, logo, and navigation links
  - `populateHero()` - Populates hero section with title, tools, stats, and brands
  - `populateGraphics()` - Creates artwork grid from graphics data
  - `populateTestimonials()` - Builds testimonial carousel
  - `populateFaq()` - Creates FAQ accordion items
  - `populateWhyUs()` - Builds comparison boxes
  - `populateContact()` - Populates founder info and social links
  - `populateShortForm()` - Creates short form video carousel

### 4. `carousels.js`
- **Purpose**: All carousel functionality
- **Classes**:
  - `Carousel3D` - 3D video carousel with perspective effects
  - `Carousel2D` - 2D horizontal carousel with seamless looping
  - `TestimonialCarousel` - Auto-scrolling testimonial carousel
- **Functions**:
  - `initializeCarousels()` - Initializes all carousel instances

### 5. `interactions.js`
- **Purpose**: UI interactions and effects
- **Classes**:
  - `Navigation` - Mobile menu and scroll-based active link highlighting
  - `ArtworkFilter` - Filter functionality for artwork grid
  - `WaterEffect` - Poison water scroll effect
  - `StatsCounter` - Animated counter for statistics
- **Functions**:
  - `toggleFAQ()` - FAQ accordion toggle (global function)
  - `initializeInteractions()` - Initializes all interaction classes

### 6. `initialize.js`
- **Purpose**: Page initialization coordination
- **Responsibilities**:
  - `initializePage()` - Main initialization function that sets up carousels and interactions

## Loading Order

The scripts are loaded in the following order to ensure proper dependency resolution:

1. `theme.js` - Theme setup (no dependencies)
2. `populate.js` - Data population functions (no dependencies)
3. `carousels.js` - Carousel classes and functions (no dependencies)
4. `interactions.js` - UI interaction classes (no dependencies)
5. `initialize.js` - Initialization coordination (depends on carousels and interactions)
6. `main.js` - Main application loader (depends on all other modules)

## Benefits of This Structure

1. **Modularity**: Each file has a single, clear responsibility
2. **Maintainability**: Easy to find and modify specific functionality
3. **Reusability**: Classes and functions can be easily reused
4. **Debugging**: Easier to isolate issues to specific modules
5. **Team Development**: Multiple developers can work on different modules simultaneously
6. **Performance**: Better caching and loading optimization potential

## Migration from Original `script.js`

The original `script.js` file has been completely refactored into these modules. All functionality has been preserved, but the code is now:
- Better organized
- More maintainable
- Easier to understand
- More modular

