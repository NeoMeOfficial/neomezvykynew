/**
 * Stripe env lookup with test-suffix override.
 *
 *   {KEY}_TEST   — wins when set; used by Netlify "Deploy previews"
 *                  scope so the variable name itself reads as test.
 *   {KEY}        — falls back when no _TEST value is present.
 *
 * Lets a single Netlify site host both live (production scope) and
 * test (deploy-preview scope) without renaming the env reads in each
 * function.
 */
export function stripeEnv(name: string): string | undefined {
  return process.env[`${name}_TEST`] || process.env[name];
}
