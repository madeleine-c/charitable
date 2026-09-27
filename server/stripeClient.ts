import Stripe from 'stripe';

let stripeClient: Stripe | null = null;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
}

export async function getUncachableStripeClient() {
  if (!stripeClient) {
    stripeClient = new Stripe(requireEnv('STRIPE_SECRET_KEY'), {
      // Pinned to the version this app was built against.
      apiVersion: '2025-08-27.basil' as Stripe.LatestApiVersion,
    });
  }
  return stripeClient;
}

export async function getStripePublishableKey() {
  return requireEnv('STRIPE_PUBLISHABLE_KEY');
}

export async function getStripeSecretKey() {
  return requireEnv('STRIPE_SECRET_KEY');
}

export function getStripeWebhookSecret() {
  return requireEnv('STRIPE_WEBHOOK_SECRET');
}
