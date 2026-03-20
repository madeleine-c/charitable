import { getStripeSync, getUncachableStripeClient } from './stripeClient';
import { storage } from './storage';

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string, uuid: string): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        'STRIPE WEBHOOK ERROR: Payload must be a Buffer. ' +
        'Received type: ' + typeof payload + '. ' +
        'This usually means express.json() parsed the body before reaching this handler. ' +
        'FIX: Ensure webhook route is registered BEFORE app.use(express.json()).'
      );
    }

    const sync = await getStripeSync();
    
    const stripe = await getUncachableStripeClient();
    const webhooks = await stripe.webhookEndpoints.list({ limit: 10 });
    const webhook = webhooks.data.find(w => w.url?.includes(uuid));
    
    if (webhook) {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        webhook.secret || ''
      );
      
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;
        await WebhookHandlers.handleCheckoutComplete(session.id);
      }
    }
    
    await sync.processWebhook(payload, signature, uuid);
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
