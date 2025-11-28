/**
 * Global Branding Management
 * Applies corporate identity settings across the entire application
 */

/**
 * Initialize and Apply Branding on Page Load
 * This function should be called from index.html or main app initialization
 */
async function initializeApplicationBranding() {
    try {
        // Check if dataFunctions is available
        if (typeof dataFunctions === 'undefined') {
            console.warn('dataFunctions not available, skipping branding initialization');
            return;
        }
        
        // Load branding settings from database
        const settings = await dataFunctions.getSystemSettings();
        let settingsData = settings;
        if (settings && settings.data) {
            settingsData = settings.data;
        }
        
        if (!settingsData || !Array.isArray(settingsData)) {
            return;
        }
        
        // Get branding settings
        const primaryColor = settingsData.find(s => s.setting_key === 'branding_primary_color');
        const secondaryColor = settingsData.find(s => s.setting_key === 'branding_secondary_color');
        const logoUrl = settingsData.find(s => s.setting_key === 'branding_logo_url');
        const faviconUrl = settingsData.find(s => s.setting_key === 'branding_favicon_url');
        const displayName = settingsData.find(s => s.setting_key === 'branding_company_display_name');
        
        // Apply primary color
        if (primaryColor) {
            const color = typeof primaryColor.setting_value === 'string' 
                ? primaryColor.setting_value 
                : primaryColor.setting_value?.value;
            if (color && /^#[0-9A-Fa-f]{6}$/.test(color)) {
                applyBrandingColor(color, 'primary');
            }
        }
        
        // Apply secondary color
        if (secondaryColor) {
            const color = typeof secondaryColor.setting_value === 'string' 
                ? secondaryColor.setting_value 
                : secondaryColor.setting_value?.value;
            if (color && /^#[0-9A-Fa-f]{6}$/.test(color)) {
                applyBrandingColor(color, 'secondary');
            }
        }
        
        // Apply logo
        if (logoUrl) {
            const url = typeof logoUrl.setting_value === 'string' 
                ? logoUrl.setting_value 
                : logoUrl.setting_value?.url || logoUrl.setting_value?.value;
            if (url) {
                applyBrandingLogo(url);
            }
        }
        
        // Apply favicon
        if (faviconUrl) {
            const url = typeof faviconUrl.setting_value === 'string' 
                ? faviconUrl.setting_value 
                : faviconUrl.setting_value?.url || faviconUrl.setting_value?.value;
            if (url) {
                applyBrandingFavicon(url);
            }
        }
        
        // Apply company display name
        if (displayName) {
            const name = typeof displayName.setting_value === 'string' 
                ? displayName.setting_value 
                : displayName.setting_value?.value;
            if (name) {
                applyBrandingDisplayName(name);
            }
        }
        
    } catch (error) {
        console.error('Error initializing application branding:', error);
    }
}

/**
 * Apply Branding Color
 */
function applyBrandingColor(color, type) {
    const root = document.documentElement;
    
    if (type === 'primary') {
        root.style.setProperty('--primary-color', color);
        root.style.setProperty('--phoenix-primary', color);
        
        // Calculate RGB values
        const rgb = hexToRgb(color);
        if (rgb) {
            root.style.setProperty('--phoenix-primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
        }
        
        // Update navbar gradient
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            const secondaryColor = getComputedStyle(root).getPropertyValue('--phoenix-secondary') || '#6b7280';
            navbar.style.background = `linear-gradient(135deg, ${color}, ${secondaryColor})`;
        }
    } else if (type === 'secondary') {
        root.style.setProperty('--secondary-color', color);
        root.style.setProperty('--phoenix-secondary', color);
        
        // Calculate RGB values
        const rgb = hexToRgb(color);
        if (rgb) {
            root.style.setProperty('--phoenix-secondary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
        }
        
        // Update navbar gradient
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            const primaryColor = getComputedStyle(root).getPropertyValue('--phoenix-primary') || '#5CBDB4';
            navbar.style.background = `linear-gradient(135deg, ${primaryColor}, ${color})`;
        }
    }
}

/**
 * Apply Branding Logo
 */
function applyBrandingLogo(url) {
    // Update navbar logo if exists
    const navbarBrand = document.querySelector('.navbar-brand');
    if (navbarBrand) {
        // Check if logo img already exists
        let logoImg = navbarBrand.querySelector('img');
        if (!logoImg) {
            logoImg = document.createElement('img');
            logoImg.style.maxHeight = '40px';
            logoImg.style.marginRight = '10px';
            navbarBrand.insertBefore(logoImg, navbarBrand.firstChild);
        }
        logoImg.src = url;
        logoImg.alt = 'Company Logo';
    }
    
    // Update any other logo references in the page
    const logoElements = document.querySelectorAll('[data-branding-logo]');
    logoElements.forEach(el => {
        if (el.tagName === 'IMG') {
            el.src = url;
        } else {
            el.style.backgroundImage = `url(${url})`;
        }
    });
}

/**
 * Apply Branding Favicon
 */
function applyBrandingFavicon(url) {
    let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = url;
    document.getElementsByTagName('head')[0].appendChild(link);
}

/**
 * Apply Branding Display Name
 */
function applyBrandingDisplayName(name) {
    // Update navbar brand text if no logo
    const navbarBrand = document.querySelector('.navbar-brand');
    if (navbarBrand && !navbarBrand.querySelector('img')) {
        navbarBrand.textContent = name;
    }
    
    // Update page title
    const titleElement = document.querySelector('title');
    if (titleElement) {
        const currentTitle = titleElement.textContent;
        if (currentTitle.includes('iComply')) {
            titleElement.textContent = currentTitle.replace('iComply', name);
        }
    }
    
    // Update any elements with data attribute
    const nameElements = document.querySelectorAll('[data-branding-name]');
    nameElements.forEach(el => {
        el.textContent = name;
    });
}

/**
 * Convert Hex to RGB
 */
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Auto-initialize on DOM ready if dataFunctions is available
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // Wait a bit for dataFunctions to be available
        setTimeout(initializeApplicationBranding, 500);
    });
} else {
    // DOM already loaded
    setTimeout(initializeApplicationBranding, 500);
}

// Export for use in other modules
window.initializeApplicationBranding = initializeApplicationBranding;
window.applyBrandingColor = applyBrandingColor;
window.applyBrandingLogo = applyBrandingLogo;
window.applyBrandingFavicon = applyBrandingFavicon;
window.applyBrandingDisplayName = applyBrandingDisplayName;

