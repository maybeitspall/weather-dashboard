/**
 * Weather API Integration for NILAMTRACE
 * Menggunakan OpenWeatherMap API untuk data cuaca real-time
 */

class WeatherService {
    constructor() {
        this.apiKey = 'b4f5dd7410bc890252e2a46622687060';
        this.lat = 5.382703;
        this.lon = 95.634936;
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
        this.locationName = 'Desa Teuladan, Aceh';
    }

    /**
     * Fetch current weather data
     */
    async getCurrentWeather() {
        try {
            const url = `${this.baseUrl}/weather?lat=${this.lat}&lon=${this.lon}&appid=${this.apiKey}&units=metric&lang=id`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return this.processWeatherData(data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            return this.getFallbackWeatherData();
        }
    }

    /**
     * Fetch 5-day forecast data
     */
    async getForecast() {
        try {
            const url = `${this.baseUrl}/forecast?lat=${this.lat}&lon=${this.lon}&appid=${this.apiKey}&units=metric&lang=id`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return this.processForecastData(data);
        } catch (error) {
            console.error('Error fetching forecast data:', error);
            return null;
        }
    }

    /**
     * Process current weather data
     */
    processWeatherData(data) {
        return {
            temperature: Math.round(data.main.temp),
            tempMax: Math.round(data.main.temp_max),
            tempMin: Math.round(data.main.temp_min),
            description: this.capitalizeFirst(data.weather[0].description),
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            pressure: data.main.pressure,
            visibility: data.visibility / 1000, // Convert to km
            icon: data.weather[0].icon,
            weatherCode: data.weather[0].id,
            location: this.locationName,
            timestamp: new Date().toLocaleString('id-ID')
        };
    }

    /**
     * Process forecast data
     */
    processForecastData(data) {
        const dailyForecasts = {};
        
        data.list.forEach(item => {
            const date = new Date(item.dt * 1000).toDateString();
            if (!dailyForecasts[date]) {
                dailyForecasts[date] = {
                    date: date,
                    temps: [],
                    descriptions: [],
                    icons: []
                };
            }
            
            dailyForecasts[date].temps.push(item.main.temp);
            dailyForecasts[date].descriptions.push(item.weather[0].description);
            dailyForecasts[date].icons.push(item.weather[0].icon);
        });

        return Object.values(dailyForecasts).slice(0, 5).map(day => ({
            date: day.date,
            tempMax: Math.round(Math.max(...day.temps)),
            tempMin: Math.round(Math.min(...day.temps)),
            description: day.descriptions[0],
            icon: day.icons[0]
        }));
    }

    /**
     * Get weather icon class based on OpenWeatherMap icon code
     */
    getWeatherIcon(iconCode, weatherCode) {
        console.log(`Getting weather icon for code: ${iconCode}, weather: ${weatherCode}`);
        
        // Map OpenWeatherMap icons to Font Awesome icons
        const iconMap = {
            '01d': 'fas fa-sun',           // clear sky day - langit cerah
            '01n': 'fas fa-moon',          // clear sky night - langit cerah malam
            '02d': 'fas fa-cloud-sun',     // few clouds day - sedikit berawan
            '02n': 'fas fa-cloud-moon',    // few clouds night - sedikit berawan malam
            '03d': 'fas fa-cloud',         // scattered clouds - awan tersebar
            '03n': 'fas fa-cloud',         // scattered clouds night
            '04d': 'fas fa-cloud',         // broken clouds - awan mendung/berawan
            '04n': 'fas fa-cloud',         // broken clouds night - awan mendung malam
            '09d': 'fas fa-cloud-rain',    // shower rain - hujan rintik
            '09n': 'fas fa-cloud-rain',    // shower rain night
            '10d': 'fas fa-cloud-sun-rain', // rain day - hujan siang
            '10n': 'fas fa-cloud-moon-rain', // rain night - hujan malam
            '11d': 'fas fa-bolt',          // thunderstorm - badai petir
            '11n': 'fas fa-bolt',          // thunderstorm night
            '13d': 'fas fa-snowflake',     // snow - salju
            '13n': 'fas fa-snowflake',     // snow night
            '50d': 'fas fa-smog',          // mist/fog - kabut
            '50n': 'fas fa-smog'           // mist/fog night
        };

        const selectedIcon = iconMap[iconCode] || 'fas fa-seedling';
        console.log(`Selected icon class: ${selectedIcon} for weather: ${this.getWeatherDescription(iconCode, weatherCode)}`);
        return selectedIcon;
    }

    /**
     * Get Indonesian weather description mapping
     */
    getWeatherDescription(iconCode, weatherCode) {
        const descriptionMap = {
            '01d': 'Cerah',
            '01n': 'Cerah (Malam)',
            '02d': 'Cerah Berawan',
            '02n': 'Cerah Berawan (Malam)',
            '03d': 'Berawan',
            '03n': 'Berawan (Malam)',
            '04d': 'Mendung',
            '04n': 'Mendung (Malam)',
            '09d': 'Hujan Rintik',
            '09n': 'Hujan Rintik (Malam)',
            '10d': 'Hujan',
            '10n': 'Hujan (Malam)',
            '11d': 'Badai Petir',
            '11n': 'Badai Petir (Malam)',
            '13d': 'Salju',
            '13n': 'Salju (Malam)',
            '50d': 'Berkabut',
            '50n': 'Berkabut (Malam)'
        };

        return descriptionMap[iconCode] || 'Tidak Diketahui';
    }

    /**
     * Get fallback weather data when API fails
     */
    getFallbackWeatherData() {
        return {
            temperature: 28,
            tempMax: 32,
            tempMin: 16,
            description: 'Cerah Berawan',
            humidity: 75,
            windSpeed: 2.5,
            pressure: 1013,
            visibility: 10,
            icon: '02d',
            weatherCode: 801,
            location: this.locationName,
            timestamp: new Date().toLocaleString('id-ID'),
            isFallback: true
        };
    }

    /**
     * Test if icon matches description
     */
    testIconDescriptionMatch() {
        console.log('🧪 TESTING ICON-DESCRIPTION MATCH');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const testCases = [
            { icon: '01d', expectedDesc: 'Cerah', expectedIcon: 'fas fa-sun' },
            { icon: '02d', expectedDesc: 'Cerah Berawan', expectedIcon: 'fas fa-cloud-sun' },
            { icon: '03d', expectedDesc: 'Berawan', expectedIcon: 'fas fa-cloud' },
            { icon: '04d', expectedDesc: 'Mendung', expectedIcon: 'fas fa-cloud' },
            { icon: '09d', expectedDesc: 'Hujan Rintik', expectedIcon: 'fas fa-cloud-rain' },
            { icon: '10d', expectedDesc: 'Hujan', expectedIcon: 'fas fa-cloud-sun-rain' },
            { icon: '11d', expectedDesc: 'Badai Petir', expectedIcon: 'fas fa-bolt' },
            { icon: '50d', expectedDesc: 'Berkabut', expectedIcon: 'fas fa-smog' }
        ];
        
        let allMatch = true;
        
        testCases.forEach(test => {
            const actualDesc = this.getWeatherDescription(test.icon, 800);
            const actualIcon = this.getWeatherIcon(test.icon, 800);
            
            const descMatch = actualDesc === test.expectedDesc;
            const iconMatch = actualIcon === test.expectedIcon;
            
            const status = (descMatch && iconMatch) ? '✅' : '❌';
            
            console.log(`${status} ${test.icon}:`);
            console.log(`   Description: ${actualDesc} ${descMatch ? '✓' : '✗ Expected: ' + test.expectedDesc}`);
            console.log(`   Icon: ${actualIcon} ${iconMatch ? '✓' : '✗ Expected: ' + test.expectedIcon}`);
            
            if (!descMatch || !iconMatch) allMatch = false;
        });
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(allMatch ? '✅ ALL TESTS PASSED!' : '❌ SOME TESTS FAILED!');
        
        return allMatch;
    }

    /**
     * Verify current weather icon matches description
     */
    async verifyCurrentWeather() {
        console.log('🔍 VERIFYING CURRENT WEATHER ICON & DESCRIPTION');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        try {
            const weatherData = await this.getCurrentWeather();
            
            const iconElement = document.getElementById('weatherIcon');
            const descElement = document.getElementById('weatherStatus');
            
            if (!iconElement || !descElement) {
                console.error('❌ Elements not found!');
                return false;
            }
            
            const currentIconClass = iconElement.className;
            const currentDescription = descElement.textContent;
            
            const expectedIcon = this.getWeatherIcon(weatherData.icon, weatherData.weatherCode);
            const expectedDesc = this.getWeatherDescription(weatherData.icon, weatherData.weatherCode);
            
            console.log('📊 Current State:');
            console.log('   Icon Code:', weatherData.icon);
            console.log('   Icon Class:', currentIconClass);
            console.log('   Description:', currentDescription);
            
            console.log('\n🎯 Expected State:');
            console.log('   Icon Class:', expectedIcon);
            console.log('   Description:', expectedDesc);
            
            const iconMatch = currentIconClass === expectedIcon;
            const descMatch = currentDescription === expectedDesc;
            
            console.log('\n📋 Verification:');
            console.log(`   Icon Match: ${iconMatch ? '✅ YES' : '❌ NO'}`);
            console.log(`   Description Match: ${descMatch ? '✅ YES' : '❌ NO'}`);
            
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            
            if (iconMatch && descMatch) {
                console.log('✅ VERIFICATION PASSED: Icon matches description!');
                return true;
            } else {
                console.log('❌ VERIFICATION FAILED: Icon does NOT match description!');
                return false;
            }
        } catch (error) {
            console.error('❌ Verification error:', error);
            return false;
        }
    }

    /**
     * Test different weather icons (for debugging)
     */
    testWeatherIcons() {
        const testConditions = [
            { icon: '01d', description: 'Clear Sky (Day)' },
            { icon: '01n', description: 'Clear Sky (Night)' },
            { icon: '02d', description: 'Few Clouds (Day)' },
            { icon: '02n', description: 'Few Clouds (Night)' },
            { icon: '03d', description: 'Scattered Clouds' },
            { icon: '04d', description: 'Broken Clouds' },
            { icon: '09d', description: 'Shower Rain' },
            { icon: '10d', description: 'Rain (Day)' },
            { icon: '10n', description: 'Rain (Night)' },
            { icon: '11d', description: 'Thunderstorm' },
            { icon: '13d', description: 'Snow' },
            { icon: '50d', description: 'Mist' }
        ];

        let currentIndex = 0;
        
        const cycleIcons = () => {
            const condition = testConditions[currentIndex];
            const testData = {
                temperature: 25 + Math.floor(Math.random() * 10),
                tempMax: 30 + Math.floor(Math.random() * 5),
                tempMin: 15 + Math.floor(Math.random() * 5),
                description: condition.description,
                icon: condition.icon,
                weatherCode: 800,
                location: this.locationName
            };
            
            this.updateWelcomeCard(testData);
            console.log(`Testing weather condition: ${condition.description} (${condition.icon})`);
            
            currentIndex = (currentIndex + 1) % testConditions.length;
        };

        // Cycle through different weather conditions every 3 seconds
        console.log('Starting weather icon test cycle...');
        cycleIcons(); // Show first condition immediately
        return setInterval(cycleIcons, 3000);
    }

    /**
     * Test cloudy weather conditions specifically
     */
    testCloudyConditions() {
        const cloudyConditions = [
            { icon: '02d', description: 'Cerah Berawan (Siang)', temp: 28 },
            { icon: '02n', description: 'Cerah Berawan (Malam)', temp: 24 },
            { icon: '03d', description: 'Berawan (Siang)', temp: 26 },
            { icon: '03n', description: 'Berawan (Malam)', temp: 22 },
            { icon: '04d', description: 'Mendung (Siang)', temp: 25 },
            { icon: '04n', description: 'Mendung (Malam)', temp: 21 }
        ];

        let currentIndex = 0;
        
        const cycleCloudy = () => {
            const condition = cloudyConditions[currentIndex];
            const testData = {
                temperature: condition.temp,
                tempMax: condition.temp + 3,
                tempMin: condition.temp - 5,
                description: condition.description,
                icon: condition.icon,
                weatherCode: condition.icon.startsWith('04') ? 804 : (condition.icon.startsWith('03') ? 803 : 801),
                location: this.locationName
            };
            
            this.updateWelcomeCard(testData);
            console.log(`Testing cloudy condition: ${condition.description} (${condition.icon})`);
            console.log(`Icon class: ${this.getWeatherIcon(condition.icon, testData.weatherCode)}`);
            
            currentIndex = (currentIndex + 1) % cloudyConditions.length;
        };

        console.log('Starting cloudy weather conditions test...');
        cycleCloudy();
        return setInterval(cycleCloudy, 4000);
    }

    /**
     * Capitalize first letter of string
     */
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Get current weather info for debugging
     */
    async debugCurrentWeather() {
        console.log('=== WEATHER DEBUG INFO ===');
        console.log('API Key:', this.apiKey);
        console.log('Coordinates:', { lat: this.lat, lon: this.lon });
        
        try {
            const url = `${this.baseUrl}/weather?lat=${this.lat}&lon=${this.lon}&appid=${this.apiKey}&units=metric&lang=id`;
            console.log('API URL:', url);
            
            const response = await fetch(url);
            const data = await response.json();
            
            console.log('Raw API Response:', data);
            console.log('Weather Icon Code:', data.weather[0].icon);
            console.log('Weather ID:', data.weather[0].id);
            console.log('Weather Main:', data.weather[0].main);
            console.log('Weather Description (ID):', data.weather[0].description);
            console.log('Mapped Icon Class:', this.getWeatherIcon(data.weather[0].icon, data.weather[0].id));
            console.log('Our Description:', this.getWeatherDescription(data.weather[0].icon, data.weather[0].id));
            
            // Check if it's cloudy conditions
            if (data.weather[0].icon.startsWith('03') || data.weather[0].icon.startsWith('04')) {
                console.log('🌥️ CLOUDY CONDITIONS DETECTED:');
                console.log('- Icon 03x = Scattered Clouds (Berawan)');
                console.log('- Icon 04x = Broken Clouds (Mendung)');
                console.log('- Current condition:', data.weather[0].icon.startsWith('04') ? 'MENDUNG' : 'BERAWAN');
            }
            
            return data;
        } catch (error) {
            console.error('Debug weather fetch error:', error);
        }
    }

    /**
     * Update welcome card with weather data
     */
    updateWelcomeCard(weatherData) {
        try {
            console.log('🔄 Updating welcome card with weather data:', weatherData);
            
            // Update temperature
            const mainTemp = document.getElementById('mainTemp');
            if (mainTemp) {
                mainTemp.textContent = `${weatherData.temperature}°`;
            }

            // Update temperature range
            const tempRange = document.getElementById('tempRange');
            if (tempRange) {
                tempRange.textContent = `H:${weatherData.tempMax}° L:${weatherData.tempMin}°`;
            }

            // Update location
            const locationDisplay = document.getElementById('locationDisplay');
            if (locationDisplay) {
                locationDisplay.textContent = weatherData.location;
            }

            // Update weather status/description
            const weatherStatus = document.getElementById('weatherStatus');
            if (weatherStatus) {
                // Use our Indonesian description mapping
                const description = this.getWeatherDescription(weatherData.icon, weatherData.weatherCode);
                weatherStatus.textContent = description;
                console.log('📝 Weather description updated to:', description);
            }

            // Update current weather icon (top-right)
            const currentWeatherIcon = document.getElementById('weatherIcon');
            const iconContainer = document.getElementById('weatherIconContainer');
            
            if (currentWeatherIcon) {
                const iconClass = this.getWeatherIcon(weatherData.icon, weatherData.weatherCode);
                currentWeatherIcon.className = iconClass;
                console.log('🎨 Weather icon updated to:', iconClass);
                console.log('✅ Icon matches description:', this.getWeatherDescription(weatherData.icon, weatherData.weatherCode));
            } else {
                console.error('❌ Weather icon element not found');
            }
            
            if (iconContainer) {
                console.log('✅ Weather icon container found and visible');
                iconContainer.style.display = 'flex'; // Force display
            } else {
                console.error('❌ Weather icon container not found');
            }

            console.log('✅ Weather data updated successfully');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        } catch (error) {
            console.error('❌ Error updating welcome card:', error);
        }
    }

    /**
     * Add indicator showing data source (DISABLED)
     */
    /*
    addDataSourceIndicator(isFallback) {
        const welcomeCard = document.querySelector('.welcome-card');
        if (welcomeCard) {
            // Remove existing indicator
            const existingIndicator = welcomeCard.querySelector('.weather-source');
            if (existingIndicator) {
                existingIndicator.remove();
            }

            // Add new indicator
            const indicator = document.createElement('div');
            indicator.className = 'weather-source';
            indicator.style.cssText = `
                position: absolute;
                top: 8px;
                left: 8px;
                font-size: 0.7rem;
                opacity: 0.7;
                z-index: 4;
                background: rgba(0,0,0,0.2);
                padding: 2px 6px;
                border-radius: 4px;
            `;
            indicator.textContent = isFallback ? 'Data Lokal' : 'Live Weather';
            welcomeCard.appendChild(indicator);
        }
    }
    */

    /**
     * Initialize weather service
     */
    async init() {
        console.log('Initializing weather service...');
        
        // Check if Font Awesome is loaded
        this.checkFontAwesome();
        
        // Show loading state
        this.showLoadingState();
        
        // Fetch and update weather data
        const weatherData = await this.getCurrentWeather();
        this.updateWelcomeCard(weatherData);
        
        // Hide loading state
        this.hideLoadingState();
        
        // Set up integration with dashboard refresh button
        this.setupDashboardRefreshIntegration();
        
        // Set up auto-refresh every 10 minutes
        setInterval(() => {
            this.refreshWeatherData();
        }, 10 * 60 * 1000);
    }

    /**
     * Check if Font Awesome is loaded
     */
    checkFontAwesome() {
        const testIcon = document.createElement('i');
        testIcon.className = 'fas fa-sun';
        testIcon.style.position = 'absolute';
        testIcon.style.left = '-9999px';
        document.body.appendChild(testIcon);
        
        const computedStyle = window.getComputedStyle(testIcon, ':before');
        const content = computedStyle.getPropertyValue('content');
        
        document.body.removeChild(testIcon);
        
        if (content && content !== 'none' && content !== '""') {
            console.log('Font Awesome is loaded');
        } else {
            console.warn('Font Awesome may not be loaded properly');
        }
    }

    /**
     * Test refresh button synchronization
     */
    testRefreshButtonSync() {
        console.log('=== TESTING REFRESH BUTTON SYNCHRONIZATION ===');
        
        const refreshBtn = document.getElementById('refreshBtn');
        if (!refreshBtn) {
            console.error('❌ Refresh button not found!');
            return false;
        }
        
        console.log('✅ Refresh button found');
        
        // Check if event listener is attached
        const events = getEventListeners ? getEventListeners(refreshBtn) : null;
        if (events && events.click && events.click.length > 0) {
            console.log('✅ Click event listeners attached:', events.click.length);
        } else {
            console.log('⚠️ Cannot verify event listeners (use Chrome DevTools)');
        }
        
        // Test the refresh functionality
        console.log('🔄 Testing weather refresh...');
        this.refreshWeatherData().then(() => {
            console.log('✅ Weather refresh completed successfully');
        }).catch(error => {
            console.error('❌ Weather refresh failed:', error);
        });
        
        return true;
    }

    /**
     * Setup integration with dashboard refresh button
     */
    setupDashboardRefreshIntegration() {
        // Instead of adding another event listener, integrate with existing dashboard refresh
        if (typeof window.refreshDashboard === 'function') {
            console.log('✅ Found existing refreshDashboard function, integrating weather refresh...');
            
            // Store the original function
            const originalRefreshDashboard = window.refreshDashboard;
            
            // Override with enhanced version that includes weather refresh
            window.refreshDashboard = async () => {
                console.log('🔄 Enhanced dashboard refresh triggered (includes weather)...');
                
                // Call original dashboard refresh
                await originalRefreshDashboard();
                
                // Add weather refresh
                await this.refreshWeatherData();
            };
            
            console.log('✅ Weather refresh integrated with existing dashboard refresh function');
        } else {
            // Fallback: add direct event listener if no dashboard refresh function exists
            console.log('⚠️ No existing refreshDashboard function found, adding direct event listener...');
            
            const dashboardRefreshBtn = document.getElementById('refreshBtn');
            if (dashboardRefreshBtn) {
                dashboardRefreshBtn.addEventListener('click', async (event) => {
                    console.log('🔄 Dashboard refresh button clicked - refreshing weather data...');
                    
                    // Prevent multiple simultaneous refreshes
                    if (dashboardRefreshBtn.classList.contains('loading')) {
                        console.log('⚠️ Refresh already in progress, skipping...');
                        return;
                    }
                    
                    await this.refreshWeatherData();
                });
                
                console.log('✅ Weather refresh integrated with dashboard refresh button');
            } else {
                console.warn('❌ Dashboard refresh button not found - weather refresh integration skipped');
            }
        }
    }

    /**
     * Show loading state
     */
    showLoadingState() {
        const mainTemp = document.getElementById('mainTemp');
        if (mainTemp) {
            mainTemp.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        }
    }

    /**
     * Hide loading state
     */
    hideLoadingState() {
        // Loading state is automatically hidden when data is updated
    }

    /**
     * Refresh weather data
     */
    async refreshWeatherData() {
        console.log('🔄 Starting weather data refresh...');
        
        // Show loading state on weather card only
        this.showLoadingState();
        console.log('🔄 Weather card loading state: ON');
        
        try {
            console.log('📡 Fetching new weather data...');
            const weatherData = await this.getCurrentWeather();
            console.log('✅ Weather data received:', weatherData);
            
            console.log('🔄 Updating welcome card...');
            this.updateWelcomeCard(weatherData);
            console.log('✅ Welcome card updated successfully');
            
        } catch (error) {
            console.error('❌ Error refreshing weather data:', error);
        } finally {
            // Remove loading state from weather card
            this.hideLoadingState();
            console.log('🔄 Weather card loading state: OFF');
            console.log('✅ Weather refresh completed');
        }
    }
}

// Initialize weather service when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('🚀 Initializing weather service...');
        const weatherService = new WeatherService();
        weatherService.init();
        
        // Make weather service globally available
        window.weatherService = weatherService;
        
        // Add debugging functions to global scope
        window.testWeatherIcons = () => weatherService.testWeatherIcons();
        window.testCloudyConditions = () => weatherService.testCloudyConditions();
        window.testRefreshSync = () => weatherService.testRefreshButtonSync();
        window.debugWeather = () => weatherService.debugCurrentWeather();
        window.stopWeatherTest = (intervalId) => clearInterval(intervalId);
        window.testIconMatch = () => weatherService.testIconDescriptionMatch();
        window.verifyWeather = () => weatherService.verifyCurrentWeather();
        
        console.log('✅ Weather service initialized successfully!');
        console.log('📋 Available debug commands:');
        console.log('- testWeatherIcons(): Test all weather icon conditions');
        console.log('- testCloudyConditions(): Test specifically cloudy conditions');
        console.log('- testRefreshSync(): Test refresh button synchronization');
        console.log('- debugWeather(): Show current weather API response');
        console.log('- testIconMatch(): Test if icons match descriptions');
        console.log('- verifyWeather(): Verify current weather icon matches description');
        console.log('- weatherService.refreshWeatherData(): Manually refresh weather');
    } catch (error) {
        console.error('❌ Error initializing weather service:', error);
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WeatherService;
}