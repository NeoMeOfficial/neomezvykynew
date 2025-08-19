# PostMessage Protocol for Habit Tracker Widget

## Overview
This document describes the PostMessage protocol for communication between a parent application and the embedded Habit Tracker widget.

## Message Types

### 1. Widget Request Access Code
**Direction:** Widget → Parent  
**Type:** `WIDGET_REQUEST_ACCESS_CODE`
**Payload:** None
**Description:** Widget requests the user's access code from the parent application

```javascript
{
  type: 'WIDGET_REQUEST_ACCESS_CODE'
}
```

### 2. Widget Receive Access Code
**Direction:** Parent → Widget  
**Type:** `WIDGET_RECEIVE_ACCESS_CODE`
**Payload:** `{ accessCode: string }`
**Description:** Parent provides the access code to the widget

```javascript
{
  type: 'WIDGET_RECEIVE_ACCESS_CODE',
  payload: { accessCode: 'ABC-123' }
}
```

### 3. Widget Access Code Updated
**Direction:** Widget → Parent  
**Type:** `WIDGET_ACCESS_CODE_UPDATED`
**Payload:** `{ accessCode: string | null }`
**Description:** Widget notifies parent when access code changes

```javascript
{
  type: 'WIDGET_ACCESS_CODE_UPDATED',
  payload: { accessCode: 'NEW-456' }
}
```

## Integration Example

### Parent Application Code

```javascript
// Listen for widget requests
window.addEventListener('message', (event) => {
  // Verify origin for security
  if (event.origin !== 'https://your-widget-domain.com') return;
  
  const { type } = event.data;
  
  switch (type) {
    case 'WIDGET_REQUEST_ACCESS_CODE':
      // Send user's access code to widget
      const iframe = document.getElementById('habit-widget');
      iframe.contentWindow.postMessage({
        type: 'WIDGET_RECEIVE_ACCESS_CODE',
        payload: { accessCode: currentUser.habitCode }
      }, '*');
      break;
      
    case 'WIDGET_ACCESS_CODE_UPDATED':
      // Update user's access code in parent app
      const newCode = event.data.payload.accessCode;
      updateUserHabitCode(newCode);
      break;
  }
});

// Initialize widget with access code
const iframe = document.getElementById('habit-widget');
iframe.addEventListener('load', () => {
  iframe.contentWindow.postMessage({
    type: 'WIDGET_RECEIVE_ACCESS_CODE',
    payload: { accessCode: currentUser.habitCode }
  }, '*');
});
```

### HTML Embedding

```html
<iframe 
  id="habit-widget"
  src="https://your-widget-domain.com"
  width="100%" 
  height="600"
  frameborder="0">
</iframe>
```

## Security Considerations

1. **Origin Verification**: Always verify the origin of incoming messages
2. **HTTPS Only**: Use HTTPS for both parent and widget domains
3. **Access Code Validation**: Validate access codes before storing
4. **Timeout Handling**: Widget includes 3-second timeout for parent responses

## User Experience Flow

1. Widget loads in iframe
2. Widget automatically requests access code from parent
3. Parent responds with user's access code (if available)
4. Widget stores code locally and loads user's habit data
5. User sees their habits immediately - **zero manual setup required**

## Fallback Behavior

If parent doesn't respond within 3 seconds, widget falls back to:
1. Manual access code entry
2. New access code generation
3. Personal link sharing options