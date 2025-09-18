// Theme management functionality
function applyTheme(theme) {
    const root = document.documentElement;
    
    // Apply color variables
    if (theme.colors) {
        Object.entries(theme.colors).forEach(([key, value]) => {
            const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            root.style.setProperty(`--${cssVarName}`, value);
        });
    }
    
    // Apply typography
    if (theme.typography) {
        if (theme.typography.fontFamily) {
            document.body.style.fontFamily = theme.typography.fontFamily;
        }
        if (theme.typography.headingFont) {
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            headings.forEach(heading => {
                heading.style.fontFamily = theme.typography.headingFont;
            });
        }
    }
    
    // Apply layout variables
    if (theme.layout) {
        Object.entries(theme.layout).forEach(([key, value]) => {
            const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            root.style.setProperty(`--${cssVarName}`, value);
        });
    }
    
    // Apply navigation styles
    if (theme.navigation) {
        const header = document.querySelector('.header');
        if (header && theme.navigation.backgroundColor) {
            header.style.background = theme.navigation.backgroundColor;
        }
        if (header && theme.navigation.backdropFilter) {
            header.style.backdropFilter = theme.navigation.backdropFilter;
        }
        if (header && theme.navigation.borderColor) {
            header.style.borderColor = theme.navigation.borderColor;
        }
        if (header && theme.navigation.borderRadius) {
            header.style.borderRadius = theme.navigation.borderRadius;
        }
    }
}