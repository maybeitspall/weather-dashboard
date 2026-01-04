// ====================== //
// COMMON APP CONTROLLER  //
// ====================== //

class AppController {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.init();
    }
    
    init() {
        this.loadUserData();
        this.setupNavigation();
        this.setupThemeToggle();
        this.setupResizeHandler();
    }
    
    // Load and update user data across all elements
    loadUserData() {
        const userData = JSON.parse(localStorage.getItem('user')) || {
            name: 'Petani Nilam',
            email: 'petani@nilam.com',
            village: 'Desa Teuladan'
        };
        
        // Update profile elements
        document.querySelectorAll('.profile-name, .dropdown-info h4').forEach(el => {
            if (el.classList.contains('profile-name')) {
                el.textContent = userData.name;
            } else {
                el.textContent = userData.name;
            }
        });
        
        const emailElement = document.querySelector('.dropdown-info p');
        const userNameElement = document.querySelector('.user-details h4');
        const userVillageElement = document.querySelector('.user-details p');
        
        if (emailElement) emailElement.textContent = userData.email;
        if (userNameElement) userNameElement.textContent = userData.name;
        if (userVillageElement) userVillageElement.textContent = userData.village;
    }
    
    // Setup navigation (sidebar and profile dropdown)
    setupNavigation() {
        // Get elements
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const closeSidebar = document.getElementById('closeSidebar');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        const profileBtn = document.getElementById('profileBtn');
        const dropdownMenu = document.getElementById('dropdownMenu');
        const profileDropdown = document.getElementById('profileDropdown');
        
        // Toggle Sidebar with content shifting for desktop
        const toggleSidebar = () => {
            if (sidebar && overlay) {
                const isActive = sidebar.classList.contains('active');
                
                if (isActive) {
                    // Close sidebar
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');
                    document.body.classList.remove('sidebar-open');
                } else {
                    // Open sidebar
                    sidebar.classList.add('active');
                    if (this.isMobile) {
                        overlay.classList.add('active');
                        document.body.classList.add('sidebar-open');
                    } else {
                        // Desktop: shift content instead of overlay
                        document.body.classList.add('sidebar-open');
                    }
                }
                
                // Update hamburger button aria-expanded
                if (hamburgerBtn) {
                    hamburgerBtn.setAttribute('aria-expanded', !isActive);
                }
            }
        };
        
        // Toggle Profile Dropdown
        const toggleProfileDropdown = () => {
            if (dropdownMenu && profileDropdown && profileBtn) {
                if (dropdownMenu.classList.contains('show')) {
                    dropdownMenu.classList.remove('show');
                    profileDropdown.classList.remove('active');
                } else {
                    // Calculate position dynamically
                    const profileBtnRect = profileBtn.getBoundingClientRect();
                    dropdownMenu.style.position = 'fixed';
                    dropdownMenu.style.top = (profileBtnRect.bottom + 8) + 'px';
                    dropdownMenu.style.right = (window.innerWidth - profileBtnRect.right) + 'px';
                    dropdownMenu.style.left = 'auto';
                    
                    dropdownMenu.classList.add('show');
                    profileDropdown.classList.add('active');
                }
            }
        };
        
        // Event Listeners
        if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleSidebar);
        if (closeSidebar) closeSidebar.addEventListener('click', toggleSidebar);
        if (overlay) overlay.addEventListener('click', toggleSidebar);
        
        if (profileBtn) {
            profileBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleProfileDropdown();
            });
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (profileBtn && dropdownMenu && profileDropdown) {
                if (!profileBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                    dropdownMenu.classList.remove('show');
                    profileDropdown.classList.remove('active');
                }
            }
        });
        
        // Logout buttons
        const logoutBtns = document.querySelectorAll('#logoutBtn, #sidebarLogout');
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                if (confirm('Apakah Anda yakin ingin keluar?')) {
                    localStorage.removeItem('user');
                    window.location.href = '../auth/login.html';
                }
            });
        });
        
        // Close sidebar when clicking menu items on mobile
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                if (this.isMobile && sidebar) {
                    sidebar.classList.remove('active');
                    if (overlay) overlay.classList.remove('active');
                    document.body.classList.remove('sidebar-open');
                }
            });
        });
        
        // Initial sidebar state - always closed on page load
        if (sidebar) {
            sidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.classList.remove('sidebar-open');
            
            // Set initial aria-expanded state
            if (hamburgerBtn) {
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            }
        }
    }
    
    // Setup theme toggle functionality
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', function() {
                document.body.classList.toggle('dark-mode');
                const icon = this.querySelector('i');
                const text = this.querySelector('span');
                
                if (document.body.classList.contains('dark-mode')) {
                    icon.className = 'fas fa-sun';
                    text.textContent = 'Mode Terang';
                    localStorage.setItem('theme', 'dark');
                } else {
                    icon.className = 'fas fa-moon';
                    text.textContent = 'Mode Gelap';
                    localStorage.setItem('theme', 'light');
                }
            });
            
            // Load saved theme
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
                const icon = themeToggle.querySelector('i');
                const text = themeToggle.querySelector('span');
                if (icon && text) {
                    icon.className = 'fas fa-sun';
                    text.textContent = 'Mode Terang';
                }
            }
        }
    }
    
    // Setup responsive behavior
    setupResizeHandler() {
        window.addEventListener('resize', () => {
            const isNowMobile = window.innerWidth <= 768;
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('overlay');
            
            if (sidebar && overlay) {
                if (isNowMobile !== this.isMobile) {
                    // Screen size category changed
                    if (isNowMobile) {
                        // Switched to mobile - close sidebar and show overlay when needed
                        sidebar.classList.remove('active');
                        overlay.classList.remove('active');
                        document.body.classList.remove('sidebar-open');
                    } else {
                        // Switched to desktop - close sidebar initially
                        sidebar.classList.remove('active');
                        overlay.classList.remove('active');
                        document.body.classList.remove('sidebar-open');
                    }
                    
                    // Update hamburger button aria-expanded
                    const hamburgerBtn = document.getElementById('hamburgerBtn');
                    if (hamburgerBtn) {
                        hamburgerBtn.setAttribute('aria-expanded', 'false');
                    }
                }
            }
            
            this.isMobile = isNowMobile;
        });
    }
    
    // Safe localStorage operations with error handling
    safeLocalStorageGet(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn(`Error reading from localStorage key "${key}":`, error);
            return defaultValue;
        }
    }
    
    safeLocalStorageSet(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error writing to localStorage key "${key}":`, error);
            this.showNotification('Gagal menyimpan data. Periksa ruang penyimpanan browser.', 'error');
            return false;
        }
    }
    
    // Utility method for showing notifications
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        
        let icon = 'fa-info-circle';
        let bgColor = '#17a2b8';
        
        if (type === 'success') {
            icon = 'fa-check-circle';
            bgColor = '#28a745';
        } else if (type === 'warning') {
            icon = 'fa-exclamation-triangle';
            bgColor = '#ffc107';
        } else if (type === 'error') {
            icon = 'fa-times-circle';
            bgColor = '#dc3545';
        }
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            max-width: 300px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.appController = new AppController();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppController;
}


// ====================== //
// UTILITY FUNCTIONS      //
// ====================== //

// Show notification/toast message
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    const iconMap = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${iconMap[type] || iconMap.info}" aria-hidden="true"></i>
        </div>
        <div class="notification-content">
            <p>${message}</p>
        </div>
        <button class="notification-close" aria-label="Tutup notifikasi">
            <i class="fas fa-times" aria-hidden="true"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Close button handler
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.add('notification-exit');
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after duration
    setTimeout(() => {
        notification.classList.add('notification-exit');
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// Show loading state on element
function showLoading(element, message = 'Memuat...') {
    if (!element) return;
    
    element.classList.add('loading');
    element.setAttribute('aria-busy', 'true');
    
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.setAttribute('role', 'status');
    loadingOverlay.setAttribute('aria-live', 'polite');
    loadingOverlay.innerHTML = `
        <div class="loading-spinner" aria-hidden="true"></div>
        <span class="loading-text">${message}</span>
    `;
    
    element.style.position = 'relative';
    element.appendChild(loadingOverlay);
}

// Hide loading state
function hideLoading(element) {
    if (!element) return;
    
    element.classList.remove('loading');
    element.removeAttribute('aria-busy');
    
    const loadingOverlay = element.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

// Validate form field
function validateField(field, rules = {}) {
    const value = field.value.trim();
    const errors = [];
    
    // Required validation
    if (rules.required && !value) {
        errors.push('Field ini wajib diisi');
    }
    
    // Min length validation
    if (rules.minLength && value.length < rules.minLength) {
        errors.push(`Minimal ${rules.minLength} karakter`);
    }
    
    // Max length validation
    if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`Maksimal ${rules.maxLength} karakter`);
    }
    
    // Email validation
    if (rules.email && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errors.push('Format email tidak valid');
        }
    }
    
    // Number validation
    if (rules.number && value) {
        if (isNaN(value)) {
            errors.push('Harus berupa angka');
        }
    }
    
    // Min value validation
    if (rules.min !== undefined && parseFloat(value) < rules.min) {
        errors.push(`Nilai minimal ${rules.min}`);
    }
    
    // Max value validation
    if (rules.max !== undefined && parseFloat(value) > rules.max) {
        errors.push(`Nilai maksimal ${rules.max}`);
    }
    
    // Show/hide error
    if (errors.length > 0) {
        showFieldError(field, errors[0]);
        return false;
    } else {
        clearFieldError(field);
        return true;
    }
}

// Show field error
function showFieldError(field, message) {
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    
    // Remove existing error message
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
        <span>${message}</span>
    `;
    
    field.parentElement.appendChild(errorDiv);
    
    // Set aria-describedby
    const errorId = `error-${field.id || Math.random().toString(36).substring(2, 11)}`;
    errorDiv.id = errorId;
    field.setAttribute('aria-describedby', errorId);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('error');
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
    
    const errorMessage = field.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Format currency (Rupiah)
function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Format date
function formatDate(dateString, options = {}) {
    const defaultOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };
    
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { ...defaultOptions, ...options });
}

// Debounce function for search/filter
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export utilities
window.AppUtils = {
    showNotification,
    showLoading,
    hideLoading,
    validateField,
    showFieldError,
    clearFieldError,
    formatRupiah,
    formatDate,
    debounce
};
