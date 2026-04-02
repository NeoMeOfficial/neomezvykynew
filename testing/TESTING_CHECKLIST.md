# NeoMe App Testing Checklist

## 🎯 **CRITICAL USER FLOWS**

### **1. ONBOARDING & AUTH**
- [ ] Welcome screen loads correctly
- [ ] "Začať" button navigates to onboarding
- [ ] All onboarding steps work (name, goals, preferences)
- [ ] Skip/back buttons function
- [ ] Final step navigates to home page

### **2. HOME PAGE NAVIGATION**
- [ ] All 4 main sections load (Telo, Strava, Myseľ, Periodka)
- [ ] Bottom navigation works (5 tabs)
- [ ] Greeting shows correct name
- [ ] Daily recommendations appear
- [ ] "Získaj odmeny" section functions
- [ ] Water intake tracker works
- [ ] Mood/Energy tracker works
- [ ] All navigation icons clickable

### **3. TELO (FITNESS) SECTION**
- [ ] Programs page loads with 4 programs
- [ ] Level filters work (Level 1-4)
- [ ] Program cards clickable → ProgramDetail
- [ ] "Extra cvičenia" loads with categories
- [ ] "Extra strečingy" loads with stretches
- [ ] Exercise filters work (level, duration, equipment)
- [ ] "Diastáza safe" badges display
- [ ] Exercise cards → ExercisePlayer
- [ ] Video player loads YouTube content
- [ ] "Dokončiť cvičenie" button works
- [ ] Workout history updates

### **4. STRAVA (NUTRITION) SECTION**
- [ ] Recipe categories display (Breakfast, Lunch, etc.)
- [ ] Recipe cards clickable → RecipeDetail
- [ ] Recipe filtering works (allergens, meal type)
- [ ] Recipe ingredients display correctly
- [ ] Recipe steps show properly
- [ ] Favorite button works (heart icon)
- [ ] "Viac receptov" CTA functions
- [ ] Meal planner promo banners appear

### **5. MYSEĽ (MEDITATION) SECTION**
- [ ] Meditation categories load
- [ ] Audio sessions display
- [ ] Play buttons function
- [ ] Session duration shows correctly
- [ ] Progress tracking works
- [ ] Meditation history saves

### **6. PERIODKA (PERIOD TRACKING)**
- [ ] Period overview displays
- [ ] Calendar shows current cycle
- [ ] "Zadať návštevu menštruácie" works
- [ ] Cycle phase detection accurate
- [ ] Symptom tracking functions
- [ ] Period history saves correctly
- [ ] Settings page accessible

### **7. COMMUNITY FEATURES**
- [ ] Community posts display
- [ ] Love heart reactions work (no double-counting)
- [ ] "Sledovať" button functions
- [ ] Post creation modal opens
- [ ] Comment system works
- [ ] Partner discounts section loads
- [ ] Community points update correctly

### **8. HABIT TRACKING**
- [ ] "Pridať návyk" modal opens
- [ ] Habit creation saves correctly
- [ ] Habit completion tracking works
- [ ] Habit history displays
- [ ] Streak counters accurate
- [ ] Daily achievements update

### **9. BUDDY SYSTEM**
- [ ] Buddy System page loads
- [ ] "Nájdi svoju buddy" button works
- [ ] Buddy code generation functions
- [ ] Code sharing works
- [ ] Buddy connection process
- [ ] Shared notifications display

### **10. SUBSCRIPTION & PAYWALLS**
- [ ] Paywall modals trigger correctly
- [ ] Subscription sales page loads
- [ ] Trial vs paid features separated
- [ ] "Upgrade" buttons function
- [ ] Referral system works (€14 credits)
- [ ] Free vs premium content distinction

### **11. PROFILE & SETTINGS**
- [ ] Profile page displays user data
- [ ] "Odporúčaj & získaj" section works
- [ ] Referral code copying functions
- [ ] Partner discounts accessible
- [ ] Settings changes save
- [ ] Logout functionality

### **12. FAVORITES & HISTORY**
- [ ] Oblubené page shows favorites
- [ ] Workout history displays
- [ ] Navigation history works
- [ ] Habit history accurate
- [ ] Content favoriting/unfavoriting

## 🔧 **TECHNICAL TESTING**

### **RESPONSIVENESS**
- [ ] Mobile view (320px - 768px)
- [ ] Tablet view (768px - 1024px) 
- [ ] Desktop view (1024px+)
- [ ] All buttons clickable on mobile
- [ ] Text readable at all sizes
- [ ] Images scale properly

### **PERFORMANCE**
- [ ] Initial page load < 3 seconds
- [ ] Navigation transitions smooth
- [ ] No console errors
- [ ] Memory usage reasonable
- [ ] Images load efficiently

### **BROWSER COMPATIBILITY**
- [ ] Chrome (desktop + mobile)
- [ ] Safari (desktop + mobile)
- [ ] Firefox
- [ ] Edge

### **DATA PERSISTENCE**
- [ ] localStorage saves correctly
- [ ] Page refresh maintains state
- [ ] Settings persist across sessions
- [ ] Favorites remain saved
- [ ] Progress tracking accurate

## 🚨 **EDGE CASES & ERROR HANDLING**

### **NETWORK ISSUES**
- [ ] Graceful handling of offline state
- [ ] Error messages for failed requests
- [ ] Retry mechanisms work
- [ ] Loading states display

### **INVALID STATES**
- [ ] Empty data states handled
- [ ] Invalid dates/inputs rejected
- [ ] Form validation works
- [ ] Error boundaries catch crashes

### **SUBSCRIPTION EDGE CASES**
- [ ] Expired subscription handling
- [ ] Trial period expiration
- [ ] Payment failure scenarios
- [ ] Feature access control

## 📱 **DEVICE-SPECIFIC TESTING**

### **iOS TESTING**
- [ ] Safari mobile compatibility
- [ ] Touch interactions work
- [ ] Swipe gestures function
- [ ] Home screen installation

### **ANDROID TESTING**
- [ ] Chrome mobile compatibility
- [ ] Touch targets appropriate size
- [ ] Back button behavior
- [ ] PWA installation

### **DESKTOP TESTING**
- [ ] Keyboard navigation
- [ ] Mouse hover states
- [ ] Right-click behavior
- [ ] Window resizing

## ✅ **TESTING TOOLS & METHODS**

### **Manual Testing**
1. **Device Testing**: iPhone, Android, Mac, PC
2. **Browser Testing**: Chrome, Safari, Firefox, Edge
3. **Network Testing**: WiFi, 4G, offline simulation
4. **User Scenarios**: New user, returning user, subscriber, free user

### **Automated Testing** (Future)
- Unit tests for critical functions
- Integration tests for user flows
- E2E tests with Playwright/Cypress
- Performance monitoring

### **User Acceptance Testing**
- Beta user testing with real users
- Feedback collection system
- A/B testing for key features
- Analytics tracking implementation

## 📊 **SUCCESS CRITERIA**

### **Functionality**
- [ ] 100% of buttons functional
- [ ] All user flows complete successfully
- [ ] No critical bugs or crashes
- [ ] Data saves and loads correctly

### **Performance**
- [ ] Page load times < 3 seconds
- [ ] Smooth 60fps animations
- [ ] No memory leaks
- [ ] Efficient image loading

### **User Experience**
- [ ] Intuitive navigation
- [ ] Clear visual feedback
- [ ] Consistent design language
- [ ] Accessibility compliance

### **Business Logic**
- [ ] Subscription system works
- [ ] Paywall enforcement correct
- [ ] Analytics tracking accurate
- [ ] Content access control proper