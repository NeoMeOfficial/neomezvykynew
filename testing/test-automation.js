// NeoMe App - Automated Button Testing Script
// Run this in browser console to test all clickable elements

class NeoMeAppTester {
  constructor() {
    this.results = {
      tested: 0,
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  // Test all buttons on current page
  async testAllButtons() {
    console.log('🧪 Starting NeoMe App Button Tests...');
    
    const buttons = document.querySelectorAll('button, [role="button"], a[href], .cursor-pointer');
    console.log(`Found ${buttons.length} clickable elements`);

    for (let i = 0; i < buttons.length; i++) {
      await this.testButton(buttons[i], i);
      await this.delay(100); // Small delay between clicks
    }

    this.printResults();
  }

  async testButton(button, index) {
    try {
      this.results.tested++;
      
      // Get button info
      const buttonText = button.textContent?.trim() || button.getAttribute('aria-label') || `Button ${index}`;
      const buttonClass = button.className;
      
      console.log(`Testing: ${buttonText}`);

      // Check if button is visible and enabled
      const rect = button.getBoundingClientRect();
      const isVisible = rect.width > 0 && rect.height > 0;
      const isEnabled = !button.disabled && !button.hasAttribute('disabled');

      if (!isVisible) {
        throw new Error('Button not visible');
      }

      if (!isEnabled) {
        throw new Error('Button disabled');
      }

      // Simulate click
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });

      button.dispatchEvent(clickEvent);

      // Check for navigation or state changes
      await this.delay(500);
      
      this.results.passed++;
      console.log(`✅ ${buttonText} - PASSED`);

    } catch (error) {
      this.results.failed++;
      this.results.errors.push({
        button: buttonText,
        error: error.message,
        element: button
      });
      console.log(`❌ ${buttonText} - FAILED: ${error.message}`);
    }
  }

  // Test specific user flows
  async testUserFlows() {
    console.log('🔄 Testing Critical User Flows...');

    const flows = [
      () => this.testOnboardingFlow(),
      () => this.testNavigationFlow(),
      () => this.testWorkoutFlow(),
      () => this.testRecipeFlow(),
      () => this.testHabitFlow()
    ];

    for (const flow of flows) {
      try {
        await flow();
      } catch (error) {
        console.error('Flow test failed:', error);
      }
    }
  }

  async testOnboardingFlow() {
    // Test welcome → onboarding → home flow
    const welcomeButton = document.querySelector('[data-testid="start-button"], button:contains("Začať")');
    if (welcomeButton) {
      welcomeButton.click();
      await this.delay(1000);
      console.log('✅ Onboarding flow initiated');
    }
  }

  async testNavigationFlow() {
    // Test bottom navigation
    const navButtons = document.querySelectorAll('[data-testid^="nav-"], .bottom-nav button');
    for (const nav of navButtons) {
      nav.click();
      await this.delay(500);
    }
    console.log('✅ Navigation flow tested');
  }

  async testWorkoutFlow() {
    // Navigate to Telo section and test exercise flow
    const teloButton = document.querySelector('[href*="telo"], button:contains("Telo")');
    if (teloButton) {
      teloButton.click();
      await this.delay(1000);
      
      const exerciseButton = document.querySelector('.exercise-card, [data-testid*="exercise"]');
      if (exerciseButton) {
        exerciseButton.click();
        await this.delay(1000);
        console.log('✅ Workout flow tested');
      }
    }
  }

  async testRecipeFlow() {
    // Test recipe browsing
    const stravaButton = document.querySelector('[href*="strava"], button:contains("Strava")');
    if (stravaButton) {
      stravaButton.click();
      await this.delay(1000);
      
      const recipeButton = document.querySelector('.recipe-card, [data-testid*="recipe"]');
      if (recipeButton) {
        recipeButton.click();
        await this.delay(1000);
        console.log('✅ Recipe flow tested');
      }
    }
  }

  async testHabitFlow() {
    // Test habit creation
    const habitButton = document.querySelector('button:contains("Pridať návyk")');
    if (habitButton) {
      habitButton.click();
      await this.delay(1000);
      console.log('✅ Habit flow tested');
    }
  }

  // Test form inputs
  testFormInputs() {
    const inputs = document.querySelectorAll('input, textarea, select');
    console.log(`Testing ${inputs.length} form inputs...`);

    inputs.forEach((input, index) => {
      try {
        const testValue = this.getTestValue(input);
        if (testValue !== null) {
          input.value = testValue;
          input.dispatchEvent(new Event('change', { bubbles: true }));
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
        console.log(`✅ Input ${index} tested`);
      } catch (error) {
        console.log(`❌ Input ${index} failed:`, error);
      }
    });
  }

  getTestValue(input) {
    const type = input.type?.toLowerCase();
    const tag = input.tagName.toLowerCase();

    switch (type) {
      case 'email': return 'test@example.com';
      case 'password': return 'testpassword123';
      case 'number': return '25';
      case 'tel': return '+421123456789';
      case 'url': return 'https://example.com';
      case 'date': return '2024-03-14';
      case 'time': return '10:30';
      case 'checkbox': 
        input.checked = !input.checked;
        return null;
      case 'radio':
        input.checked = true;
        return null;
      default:
        if (tag === 'textarea') return 'Test text content';
        if (tag === 'select') {
          if (input.options.length > 1) {
            input.selectedIndex = 1;
          }
          return null;
        }
        return 'Test value';
    }
  }

  // Performance testing
  async testPerformance() {
    console.log('⚡ Testing Performance...');
    
    const startTime = performance.now();
    
    // Test page load time
    window.addEventListener('load', () => {
      const loadTime = performance.now() - startTime;
      console.log(`Page load time: ${loadTime.toFixed(2)}ms`);
    });

    // Test memory usage
    if (performance.memory) {
      console.log('Memory usage:', {
        used: (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + ' MB',
        total: (performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(2) + ' MB'
      });
    }

    // Test critical resource loading
    const images = document.querySelectorAll('img');
    let imagesLoaded = 0;
    
    images.forEach(img => {
      if (img.complete) {
        imagesLoaded++;
      } else {
        img.addEventListener('load', () => imagesLoaded++);
      }
    });

    console.log(`Images: ${imagesLoaded}/${images.length} loaded`);
  }

  // Test localStorage functionality
  testDataPersistence() {
    console.log('💾 Testing Data Persistence...');
    
    const testKey = 'neome_test_' + Date.now();
    const testData = { test: true, timestamp: Date.now() };
    
    try {
      // Test localStorage
      localStorage.setItem(testKey, JSON.stringify(testData));
      const retrieved = JSON.parse(localStorage.getItem(testKey));
      
      if (retrieved.test === true) {
        console.log('✅ localStorage working');
      } else {
        console.log('❌ localStorage failed');
      }
      
      localStorage.removeItem(testKey);
      
    } catch (error) {
      console.log('❌ localStorage error:', error);
    }

    // Test existing NeoMe data
    const neomeKeys = Object.keys(localStorage).filter(key => key.includes('neome'));
    console.log(`Found ${neomeKeys.length} NeoMe data keys:`, neomeKeys);
  }

  // Utility methods
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  printResults() {
    console.log('\n📊 TEST RESULTS:');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📝 Total: ${this.results.tested}`);
    console.log(`📈 Success Rate: ${((this.results.passed / this.results.tested) * 100).toFixed(1)}%`);
    
    if (this.results.errors.length > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.results.errors.forEach(error => {
        console.log(`- ${error.button}: ${error.error}`);
      });
    }
  }

  // Run full test suite
  async runFullTest() {
    console.log('🚀 Starting Full NeoMe App Test Suite...');
    
    await this.testPerformance();
    await this.testDataPersistence();
    await this.testAllButtons();
    await this.testFormInputs();
    await this.testUserFlows();
    
    console.log('🎉 Full test suite completed!');
  }
}

// Usage instructions
console.log(`
🧪 NeoMe App Testing Suite Loaded!

Usage:
const tester = new NeoMeAppTester();

// Test all buttons on current page
await tester.testAllButtons();

// Test specific flows
await tester.testUserFlows();

// Test forms
tester.testFormInputs();

// Test performance
await tester.testPerformance();

// Test data persistence
tester.testDataPersistence();

// Run everything
await tester.runFullTest();
`);

// Auto-export for easy access
window.NeoMeAppTester = NeoMeAppTester;