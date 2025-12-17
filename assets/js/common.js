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
        
        // Toggle Sidebar
        const toggleSidebar = () => {
            if (sidebar && overlay) {
                sidebar.classList.toggle('active');
                overlay.classList.toggle('active');
                document.body.classList.toggle('sidebar-active');
            }
        };
        
        // Toggle Profile Dropdown
        const toggleProfileDropdown = () => {
            if (dropdownMenu && profileDropdown) {
                dropdownMenu.classList.toggle('show');
                profileDropdown.classList.toggle('active');
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
                if (window.innerWidth <= 768) {
                    toggleSidebar();
                }
            });
        });
        
        // Initial sidebar state
        if (sidebar) {
            if (this.isMobile) {
                sidebar.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
                document.body.classList.remove('sidebar-active');
            } else {
                sidebar.classList.add('active');
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
                if (isNowMobile) {
                    // Mobile mode - close sidebar
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');
                    document.body.classList.remove('sidebar-active');
                } else {
                    // Desktop mode - open sidebar
                    sidebar.classList.add('active');
                    overlay.classList.remove('active');
                    document.body.classList.remove('sidebar-active');
                }
            }
            
            this.isMobile = isNowMobile;
        });
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