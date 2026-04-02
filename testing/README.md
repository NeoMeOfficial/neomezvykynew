# NeoMe App Testing Suite

## 📁 Files in this folder:

### `TESTING_CHECKLIST.md` 
**Manual testing checklist** - Go through this systematically to test every feature
- ✅ Check off items as you test them
- Covers all user flows and edge cases
- Organized by app section (Telo, Strava, Myseľ, etc.)

### `test-automation.js`
**Automated testing script** - Run in browser console for quick button testing
- Tests all clickable elements automatically
- Checks performance and data persistence
- Provides detailed test results

## 🚀 How to test:

### **Method 1: Manual Testing (Recommended)**
1. Open https://neome-wellness-app.netlify.app
2. Open `TESTING_CHECKLIST.md` 
3. Go through each section and check off items as you test
4. Note any issues you find

### **Method 2: Automated Testing**
1. Open the app in Chrome
2. Press F12 to open DevTools
3. Go to Console tab
4. Copy and paste contents of `test-automation.js`
5. Run: `const tester = new NeoMeAppTester(); await tester.runFullTest();`

### **Method 3: Admin Panel Testing**
1. Open https://neome-wellness-app.netlify.app/admin-new
2. Test the admin interfaces using the checklist
3. Verify content management features work

## 📱 Testing on different devices:
- **Desktop**: Chrome, Safari, Firefox
- **Mobile**: Chrome DevTools mobile simulation
- **Actual devices**: iPhone, Android if available

## 🎯 Focus Areas:
1. **Navigation** - Can you get around the app?
2. **Core Features** - Do main functions work?
3. **UI/UX** - Does everything look and feel good?
4. **Performance** - Is it fast and responsive?

## 📝 Reporting Issues:
- Note which checklist item failed
- Describe what you expected vs what happened
- Include browser/device info
- Screenshots if helpful