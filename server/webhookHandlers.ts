import { getStripeWebhookSecret, getUncachableStripeClient } from './stripeClient.js';
import { storage } from './storage.js';

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        'STRIPE WEBHOOK ERROR: Payload must be a Buffer. ' +
        'Received type: ' + typeof payload + '. ' +
        'Ensure the webhook route uses express.raw() and is registered BEFORE express.json().'
      );
    }

    const stripe = await getUncachableStripeClient();
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      getStripeWebhookSecret()
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      await WebhookHandlers.handleCheckoutComplete(session.id);
    }
  }

  static async handleCheckoutComplete(sessionId: string): Promise<void> {
    const donation = await storage.getDonationByCheckoutSession(sessionId);
    if (donation && donation.status !== 'completed') {
      await storage.updateDonationStatus(donation.id, 'completed');
      await storage.updateNonprofitStats(donation.nonprofitId, donation.amount);
      console.log(`Donation ${donation.id} marked as completed`);
    }
  }
}
