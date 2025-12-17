// ====================== //
// PROFILE SPECIFIC       //
// ====================== //

class ProfileController {
    constructor() {
        this.init();
    }
    
    init() {
        this.loadUserData();
        this.setupTabs();
        this.setupForms();
        this.setupEditProfile();
    }
    
    loadUserData() {
        const userData = JSON.parse(localStorage.getItem('user')) || {
            name: 'Petani Nilam',
            email: 'petani@nilam.com',
            phone: '0812-3456-7890',
            village: 'Desa Teuladan',
            joinDate: '2023-11-01'
        };
        
        // Update profile elements
        const userNameElement = document.getElementById('userName');
        const userEmailElement = document.getElementById('userEmail');
        const userPhoneElement = document.getElementById('userPhone');
        const userVillageElement = document.getElementById('userVillage');
        
        if (userNameElement) userNameElement.textContent = userData.name;
        if (userEmailElement) userEmailElement.textContent = userData.email;
        if (userPhoneElement) userPhoneElement.textContent = userData.phone;
        if (userVillageElement) userVillageElement.textContent = userData.village;
        
        // Update avatar with initials
        const avatar = document.getElementById('userAvatar');
        if (avatar && userData.name) {
            avatar.innerHTML = userData.name.charAt(0).toUpperCase();
            avatar.style.backgroundColor = this.getColorFromName(userData.name);
        }
        
        // Update form fields
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const villageInput = document.getElementById('village');
        
        if (nameInput) nameInput.value = userData.name;
        if (emailInput) emailInput.value = userData.email;
        if (phoneInput) phoneInput.value = userData.phone;
        if (villageInput) villageInput.value = userData.village;
    }
    
    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                
                // Update active tab
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Show corresponding content
                tabContents.forEach(c => c.classList.remove('active'));
                const targetContent = document.getElementById(tabId + 'Content');
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }
    
    setupForms() {
        // Settings form
        const settingsForm = document.getElementById('settingsForm');
        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveSettings();
            });
        }
        
        // Profile form
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProfile();
            });
        }
    }
    
    setupEditProfile() {
        const editProfileBtn = document.getElementById('editProfileBtn');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => this.editProfile());
        }
    }
    
    editProfile() {
        const isEditing = document.body.classList.contains('editing-profile');
        
        if (isEditing) {
            // Save changes
            this.saveProfile();
        } else {
            // Enable editing
            document.body.classList.add('editing-profile');
            const editBtn = document.getElementById('editProfileBtn');
            if (editBtn) {
                editBtn.innerHTML = '<i class="fas fa-save"></i> Simpan Perubahan';
            }
            
            // Enable form inputs
            const inputs = document.querySelectorAll('#profileContent input');
            inputs.forEach(input => input.disabled = false);
        }
    }
    
    saveProfile() {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const villageInput = document.getElementById('village');
        
        if (!nameInput || !emailInput || !phoneInput || !villageInput) return;
        
        const userData = {
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            village: villageInput.value,
            joinDate: JSON.parse(localStorage.getItem('user'))?.joinDate || '2023-11-01'
        };
        
        // Validate required fields
        if (!userData.name || !userData.email) {
            if (window.appController) {
                window.appController.showNotification('Nama dan email wajib diisi', 'warning');
            }
            return;
        }
        
        // Save to localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Update UI
        this.loadUserData();
        
        // Disable editing mode
        document.body.classList.remove('editing-profile');
        const editBtn = document.getElementById('editProfileBtn');
        if (editBtn) {
            editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit Profil';
        }
        
        // Disable form inputs
        const inputs = document.querySelectorAll('#profileContent input');
        inputs.forEach(input => input.disabled = true);
        
        if (window.appController) {
            window.appController.showNotification('Profil berhasil diperbarui!', 'success');
        }
    }
    
    saveSettings() {
        const themeSelect = document.getElementById('theme');
        const notificationsCheckbox = document.getElementById('notifications');
        const dataSharingCheckbox = document.getElementById('dataSharing');
        
        if (!themeSelect || !notificationsCheckbox || !dataSharingCheckbox) return;
        
        const theme = themeSelect.value;
        const notifications = notificationsCheckbox.checked;
        const dataSharing = dataSharingCheckbox.checked;
        
        // Apply theme
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        // Save to localStorage
        localStorage.setItem('theme', theme);
        localStorage.setItem('notifications', notifications);
        localStorage.setItem('dataSharing', dataSharing);
        
        if (window.appController) {
            window.appController.showNotification('Pengaturan berhasil disimpan!', 'success');
        }
    }
    
    getColorFromName(name) {
        const colors = [
            '#2d5a27', '#1e3f1a', '#3d6b35', '#28a745', 
            '#17a2b8', '#ffc107', '#dc3545', '#6c757d'
        ];
        
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        return colors[Math.abs(hash) % colors.length];
    }
    
    initializeSettings() {
        // Initialize theme from localStorage
        const savedTheme = localStorage.getItem('theme');
        const themeSelect = document.getElementById('theme');
        
        if (savedTheme && themeSelect) {
            themeSelect.value = savedTheme;
            
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
            }
        }
        
        // Initialize other settings
        const notifications = localStorage.getItem('notifications');
        const dataSharing = localStorage.getItem('dataSharing');
        
        const notificationsCheckbox = document.getElementById('notifications');
        const dataSharingCheckbox = document.getElementById('dataSharing');
        
        if (notifications !== null && notificationsCheckbox) {
            notificationsCheckbox.checked = notifications === 'true';
        }
        
        if (dataSharing !== null && dataSharingCheckbox) {
            dataSharingCheckbox.checked = dataSharing === 'true';
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.profileController = new ProfileController();
    window.profileController.initializeSettings();
});