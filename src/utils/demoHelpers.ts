// Demo utilities for testing personalization features

export function setDemoUserName(name: string) {
  localStorage.setItem('demo_user_name', name);
  console.log(`Demo user name set to: ${name}`);
  // Refresh the page to see the change
  window.location.reload();
}

export function clearDemoUserName() {
  localStorage.removeItem('demo_user_name');
  console.log('Demo user name cleared');
  window.location.reload();
}

export function getDemoUserName(): string | null {
  return localStorage.getItem('demo_user_name');
}

// Add to window for easy console access
if (typeof window !== 'undefined') {
  (window as any).setDemoUserName = setDemoUserName;
  (window as any).clearDemoUserName = clearDemoUserName;
  (window as any).getDemoUserName = getDemoUserName;
}