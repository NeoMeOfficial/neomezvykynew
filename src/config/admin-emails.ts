/**
 * Bootstrap admin email allow-list.
 *
 * Used as a one-time mechanism to grant admin role to specific email addresses
 * the first time they sign in. After bootstrap, admin status is determined
 * exclusively by the JWT's `app_metadata.role === 'admin'` claim, set
 * server-side by the `set-admin-role` Edge Function.
 *
 * Adding a new admin: invite from inside the admin panel (Users → Admin team →
 * Invite admin). The Edge Function sets the role on the new user's auth record.
 *
 * Editing this list does NOT remove admin privileges from existing admins —
 * use the admin panel's "Remove admin" action for that.
 *
 * **Server-side mirror:** `supabase/functions/set-admin-role/index.ts` MUST keep
 * the same list. Client and server stay in sync by convention; the Edge Function
 * is the security source of truth (the client list is used only for nav rendering
 * hints when JWT role hasn't propagated yet).
 */
export const ADMIN_BOOTSTRAP_EMAILS: ReadonlyArray<string> = [
  'samuelgrecner@gmail.com',
  'gabi@neome.com.au',
] as const;

export function isBootstrapAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_BOOTSTRAP_EMAILS.includes(email.toLowerCase());
}
