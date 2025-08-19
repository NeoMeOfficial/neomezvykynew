# Widget Integration Guide

## Overview

This habit tracker can be embedded as a widget in other applications. To maintain user data persistence across sessions, the widget supports multiple integration methods.

## Basic Integration

### Simple Embed
```html
<iframe 
  src="https://your-app.lovable.app" 
  width="400" 
  height="600"
  allow="storage-access">
</iframe>
```

### With Pre-filled Access Code
```html
<iframe 
  src="https://your-app.lovable.app?access_code=USER_ACCESS_CODE" 
  width="400" 
  height="600"
  allow="storage-access">
</iframe>
```

## Advanced Integration (PostMessage Protocol)

For tighter integration where you want to manage the access code from your parent application:

### 1. Listen for Widget Requests
```javascript
window.addEventListener('message', (event) => {
  if (event.data?.type === 'ACCESS_CODE_REQUEST') {
    // Widget is requesting the stored access code
    const userAccessCode = getUserAccessCode(); // Your storage logic
    event.source.postMessage({
      type: 'ACCESS_CODE_SYNC',
      accessCode: userAccessCode
    }, '*');
  }
  
  if (event.data?.type === 'ACCESS_CODE_UPDATE') {
    // Widget is notifying of access code changes
    const { accessCode } = event.data;
    saveUserAccessCode(accessCode); // Your storage logic
  }
});
```

### 2. Sync Access Code to Widget
```javascript
function syncAccessCodeToWidget(accessCode) {
  const iframe = document.getElementById('habit-tracker-widget');
  iframe.contentWindow.postMessage({
    type: 'ACCESS_CODE_SYNC',
    accessCode: accessCode
  }, '*');
}
```

## Storage Permissions

### Required Iframe Permissions
Always include `allow="storage-access"` in your iframe tag to enable the Storage Access API.

### User Flow for Storage Access
When embedded in a third-party context, users may need to:
1. Click "Open personal link" (opens in new tab for top-level interaction)
2. Return to the widget and click "Enable storage"
3. Grant storage access when prompted by the browser

## Best Practices

1. **Pre-fill Access Codes**: If you have the user's access code, include it in the URL
2. **Handle PostMessage**: Implement the PostMessage protocol for seamless data sync
3. **Storage Fallbacks**: The widget automatically falls back to URL parameters if storage is blocked
4. **Error Handling**: Monitor console logs for storage-related warnings

## Example Implementation

```html
<!DOCTYPE html>
<html>
<head>
    <title>My App with Habit Tracker</title>
</head>
<body>
    <div id="habit-tracker-container">
        <iframe 
            id="habit-tracker-widget"
            src="https://your-app.lovable.app"
            width="400" 
            height="600"
            allow="storage-access">
        </iframe>
    </div>

    <script>
        // Store access codes in your app's storage
        let userAccessCode = localStorage.getItem('user_habit_code');

        // Handle widget communication
        window.addEventListener('message', (event) => {
            if (event.data?.type === 'ACCESS_CODE_REQUEST') {
                // Send stored code to widget
                event.source.postMessage({
                    type: 'ACCESS_CODE_SYNC',
                    accessCode: userAccessCode
                }, '*');
            }
            
            if (event.data?.type === 'ACCESS_CODE_UPDATE') {
                // Save updated code
                userAccessCode = event.data.accessCode;
                if (userAccessCode) {
                    localStorage.setItem('user_habit_code', userAccessCode);
                } else {
                    localStorage.removeItem('user_habit_code');
                }
            }
        });

        // Update widget URL if you have a pre-existing code
        if (userAccessCode) {
            const iframe = document.getElementById('habit-tracker-widget');
            iframe.src = `https://your-app.lovable.app?access_code=${userAccessCode}`;
        }
    </script>
</body>
</html>
```

## Troubleshooting

- **Storage Access Denied**: Ensure `allow="storage-access"` is in the iframe
- **Code Not Persisting**: Check browser console for storage warnings
- **PostMessage Not Working**: Verify the iframe has loaded before sending messages
- **Pop-up Blocked**: Users may need to allow pop-ups for the "Open personal link" feature