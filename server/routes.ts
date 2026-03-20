import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getUncachableStripeClient, getStripePublishableKey } from "./stripeClient";
import { insertNonprofitSchema, insertDonationSchema, insertPostSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/nonprofits", async (req, res) => {
    try {
      const nonprofits = await storage.getVerifiedNonprofits();
      res.json(nonprofits);
    } catch (error: any) {
      console.error("Error fetching nonprofits:", error);
      res.status(500).json({ message: "Failed to fetch nonprofits" });
    }
  });

  app.get("/api/nonprofits/by-id/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const nonprofit = await storage.getNonprofitById(id);
      
      if (!nonprofit) {
        return res.status(404).json({ message: "Nonprofit not found" });
      }
      
      res.json(nonprofit);
    } catch (error: any) {
      console.error("Error fetching nonprofit by ID:", error);
      res.status(500).json({ message: "Failed to fetch nonprofit" });
    }
  });

  app.get("/api/nonprofits/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const nonprofit = await storage.getNonprofitBySlug(slug);
      
      if (!nonprofit) {
        return res.status(404).json({ message: "Nonprofit not found" });
      }
      
      res.json(nonprofit);
    } catch (error: any) {
      console.error("Error fetching nonprofit:", error);
      res.status(500).json({ message: "Failed to fetch nonprofit" });
    }
  });

  app.get("/api/nonprofits/:slug/donations", async (req, res) => {
    try {
      const { slug } = req.params;
      const nonprofit = await storage.getNonprofitBySlug(slug);
      
      if (!nonprofit) {
        return res.status(404).json({ message: "Nonprofit not found" });
      }
      
      const donations = await storage.getDonationsByNonprofitId(nonprofit.id);
      const publicDonations = donations
        .filter(d => d.status === 'completed')
        .map(d => ({
          id: d.id,
          amount: d.amount,
          donorName: d.isAnonymous ? null : d.donorName,
          message: d.message,
          isAnonymous: d.isAnonymous,
          createdAt: d.createdAt,
        }));
      
      res.json(publicDonations);
    } catch (error: any) {
      console.error("Error fetching donations:", error);
      res.status(500).json({ message: "Failed to fetch donations" });
    }
  });

  app.get("/api/donations/verify/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const stripe = await getUncachableStripeClient();
      
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      if (session.payment_status === 'paid') {
        const donation = await storage.getDonationByCheckoutSession(sessionId);
        if (donation && donation.status !== 'completed') {
          await storage.updateDonationStatus(donation.id, 'completed');
          await storage.updateNonprofitStats(donation.nonprofitId, donation.amount);
        }
        res.json({ status: 'completed', paid: true });
      } else {
        res.json({ status: 'pending', paid: false });
      }
    } catch (error: any) {
      console.error("Error verifying donation:", error);
      res.status(500).json({ message: "Failed to verify donation" });
    }
  });

  app.post("/api/nonprofits", async (req, res) => {
    try {
      const validated = insertNonprofitSchema.parse(req.body);
      
      const existingNonprofit = await storage.getNonprofitBySlug(validated.slug);
      if (existingNonprofit) {
        return res.status(400).json({ message: "A nonprofit with this name already exists" });
      }
      
      const nonprofit = await storage.createNonprofit(validated);
      res.status(201).json(nonprofit);
    } catch (error: any) {
      console.error("Error creating nonprofit:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create nonprofit" });
    }
  });

  app.post("/api/donations/checkout", async (req, res) => {
    try {
      const { nonprofitId, amount, donorName, donorEmail, message, isAnonymous } = req.body;
      
      if (!nonprofitId || !amount || amount < 100) {
        return res.status(400).json({ message: "Invalid donation amount" });
      }
      
      const nonprofit = await storage.getNonprofitById(nonprofitId);
      if (!nonprofit) {
        return res.status(404).json({ message: "Nonprofit not found" });
      }
      
      const donation = await storage.createDonation({
        nonprofitId,
        amount,
        donorName: isAnonymous ? undefined : donorName,
        donorEmail,
        message,
        isAnonymous: isAnonymous || false,
      });
      
      const stripe = await getUncachableStripeClient();
      
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      
      const sessionParams: any = {
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Donation to ${nonprofit.name}`,
                description: nonprofit.mission.substring(0, 500),
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${baseUrl}/donation/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/nonprofit/${nonprofit.slug}`,
        customer_email: donorEmail || undefined,
        metadata: {
          donationId: donation.id,
          nonprofitId: nonprofit.id,
        },
      };

      if (nonprofit.stripeConnectedAccountId && nonprofit.stripeChargesEnabled) {
        const platformFee = Math.round(amount * 0.029 + 30);
        sessionParams.payment_intent_data = {
          application_fee_amount: platformFee,
          transfer_data: {
            destination: nonprofit.stripeConnectedAccountId,
          },
        };
      }

      const session = await stripe.checkout.sessions.create(sessionParams);
      
      await storage.updateDonationCheckoutSession(donation.id, session.id);
      
      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ message: "Failed to create checkout session" });
    }
  });

  app.get("/api/stripe/publishable-key", async (req, res) => {
    try {
      const publishableKey = await getStripePublishableKey();
      res.json({ publishableKey });
    } catch (error: any) {
      console.error("Error fetching Stripe publishable key:", error);
      res.status(500).json({ message: "Failed to fetch Stripe configuration" });
    }
  });

  app.post("/api/nonprofits/:id/create-stripe-account", async (req, res) => {
    try {
      const { id } = req.params;
      const nonprofit = await storage.getNonprofitById(id);
      
      if (!nonprofit) {
        return res.status(404).json({ message: "Nonprofit not found" });
      }
      
      if (nonprofit.stripeConnectedAccountId) {
        return res.json({ accountId: nonprofit.stripeConnectedAccountId });
      }
      
      const stripe = await getUncachableStripeClient();
      
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'US',
        email: nonprofit.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'non_profit',
        business_profile: {
          name: nonprofit.name,
          url: nonprofit.website || undefined,
        },
        metadata: {
          nonprofitId: nonprofit.id,
        },
      });
      
      await storage.updateNonprofitStripeAccount(nonprofit.id, account.id);
      
      res.json({ accountId: account.id });
    } catch (error: any) {
      console.error("Error creating Stripe account:", error);
      
      if (error.message?.includes("signed up for Connect")) {
        return res.status(400).json({ 
          message: "Stripe Connect is not enabled. Please enable Connect in your Stripe Dashboard at dashboard.stripe.com/settings/connect",
          code: "CONNECT_NOT_ENABLED"
        });
      }
      
      res.status(500).json({ message: "Failed to create Stripe account" });
    }
  });

  app.post("/api/nonprofits/:id/stripe-onboarding-link", async (req, res) => {
    try {
      const { id } = req.params;
      const nonprofit = await storage.getNonprofitById(id);
      
      if (!nonprofit) {
        return res.status(404).json({ message: "Nonprofit not found" });
      }
      
      if (!nonprofit.stripeConnectedAccountId) {
        return res.status(400).json({ message: "No Stripe account. Create one first." });
      }
      
      const stripe = await getUncachableStripeClient();
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      
      const accountLink = await stripe.accountLinks.create({
        account: nonprofit.stripeConnectedAccountId,
        refresh_url: `${baseUrl}/nonprofit/onboarding/refresh?id=${nonprofit.id}`,
        return_url: `${baseUrl}/nonprofit/onboarding/complete?id=${nonprofit.id}`,
        type: 'account_onboarding',
      });
      
      res.json({ url: accountLink.url });
    } catch (error: any) {
      console.error("Error creating onboarding link:", error);
      res.status(500).json({ message: "Failed to create onboarding link" });
    }
  });

  app.get("/api/nonprofits/:id/stripe-status", async (req, res) => {
    try {
      const { id } = req.params;
      const nonprofit = await storage.getNonprofitById(id);
      
      if (!nonprofit) {
        return res.status(404).json({ message: "Nonprofit not found" });
      }
      
      if (!nonprofit.stripeConnectedAccountId) {
        return res.json({ 
          hasAccount: false,
          chargesEnabled: false,
          payoutsEnabled: false,
          onboardingComplete: false,
        });
      }
      
      const stripe = await getUncachableStripeClient();
      const account = await stripe.accounts.retrieve(nonprofit.stripeConnectedAccountId);
      
      const chargesEnabled = account.charges_enabled || false;
      const payoutsEnabled = account.payouts_enabled || false;
      const detailsSubmitted = account.details_submitted || false;
      
      await storage.updateNonprofitStripeStatus(nonprofit.id, {
        stripeOnboardingComplete: detailsSubmitted,
        stripeChargesEnabled: chargesEnabled,
        stripePayoutsEnabled: payoutsEnabled,
      });
      
      res.json({
        hasAccount: true,
        chargesEnabled,
        payoutsEnabled,
        onboardingComplete: detailsSubmitted,
        requiresAction: !detailsSubmitted || !chargesEnabled,
      });
    } catch (error: any) {
      console.error("Error checking Stripe status:", error);
      res.status(500).json({ message: "Failed to check Stripe status" });
    }
  });

  // ===== FEED & POSTS ENDPOINTS =====

  // Get feed (all published posts with nonprofit info)
  app.get("/api/feed", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const posts = await storage.getFeed(limit, offset);
      res.json(posts);
    } catch (error: any) {
      console.error("Error fetching feed:", error);
      res.status(500).json({ message: "Failed to fetch feed" });
    }
  });

  // Get single post
  app.get("/api/posts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const post = await storage.getPostById(id);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      res.json(post);
    } catch (error: any) {
      console.error("Error fetching post:", error);
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  // Get posts by nonprofit
  app.get("/api/nonprofits/:nonprofitId/posts", async (req, res) => {
    try {
      const { nonprofitId } = req.params;
      const posts = await storage.getPostsByNonprofitId(nonprofitId);
      res.json(posts);
    } catch (error: any) {
      console.error("Error fetching nonprofit posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  // Create new post (for nonprofits)
  app.post("/api/nonprofits/:nonprofitId/posts", async (req, res) => {
    try {
      const { nonprofitId } = req.params;
      
      // Verify nonprofit exists
      const nonprofit = await storage.getNonprofitById(nonprofitId);
      if (!nonprofit) {
        return res.status(404).json({ message: "Nonprofit not found" });
      }
      
      const postData = insertPostSchema.parse({
        ...req.body,
        nonprofitId,
      });
      
      const post = await storage.createPost(postData);
      res.status(201).json(post);
    } catch (error: any) {
      console.error("Error creating post:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid post data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  // Update post
  app.patch("/api/posts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const post = await storage.getPostById(id);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      const updatedPost = await storage.updatePost(id, req.body);
      res.json(updatedPost);
    } catch (error: any) {
      console.error("Error updating post:", error);
      res.status(500).json({ message: "Failed to update post" });
    }
  });

  // Delete post
  app.delete("/api/posts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const post = await storage.getPostById(id);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      await storage.deletePost(id);
      res.status(204).send();
    } catch (error: any) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // ===== REACTIONS ENDPOINTS =====

  // Toggle reaction (like/unlike)
  app.post("/api/posts/:postId/react", async (req, res) => {
    try {
      const { postId } = req.params;
      const { guestId } = req.body;
      
      // Validate guestId is a valid UUID format
      if (!guestId || typeof guestId !== "string") {
        return res.status(400).json({ message: "guestId is required" });
      }
      
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(guestId)) {
        return res.status(400).json({ message: "Invalid guestId format" });
      }
      
      const post = await storage.getPostById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      const hasReacted = await storage.hasReacted(postId, guestId);
      
      if (hasReacted) {
        await storage.deleteReaction(postId, guestId);
        res.json({ liked: false });
      } else {
        await storage.createReaction({ postId, guestId, type: "like" });
        res.json({ liked: true });
      }
    } catch (error: any) {
      console.error("Error toggling reaction:", error);
      res.status(500).json({ message: "Failed to toggle reaction" });
    }
  });

  // Check if user has liked a post
  app.get("/api/posts/:postId/liked", async (req, res) => {
    try {
      const { postId } = req.params;
      const guestId = req.query.guestId as string;
      
      if (!guestId) {
        return res.json({ liked: false });
      }
      
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(guestId)) {
        return res.json({ liked: false });
      }
      
      const hasReacted = await storage.hasReacted(postId, guestId);
      res.json({ liked: hasReacted });
    } catch (error: any) {
      console.error("Error checking reaction:", error);
      res.status(500).json({ message: "Failed to check reaction" });
    }
  });

  // ===== ADMIN ENDPOINTS =====

  // Get all nonprofits for admin (including unverified)
  app.get("/api/admin/nonprofits", async (req, res) => {
    try {
      const nonprofits = await storage.getAllNonprofitsAdmin();
      res.json(nonprofits);
    } catch (error: any) {
      console.error("Error fetching nonprofits for admin:", error);
      res.status(500).json({ message: "Failed to fetch nonprofits" });
    }
  });

  // Approve nonprofit
  app.patch("/api/admin/nonprofits/:id/approve", async (req, res) => {
    try {
      const { id } = req.params;
      const nonprofit = await storage.getNonprofitById(id);
      
      if (!nonprofit) {
        return res.status(404).json({ message: "Nonprofit not found" });
      }
      
      await storage.approveNonprofit(id);
      res.json({ message: "Nonprofit approved successfully" });
    } catch (error: any) {
      console.error("Error approving nonprofit:", error);
      res.status(500).json({ message: "Failed to approve nonprofit" });
    }
  });

  // Reject/remove nonprofit
  app.patch("/api/admin/nonprofits/:id/reject", async (req, res) => {
    try {
      const { id } = req.params;
      const nonprofit = await storage.getNonprofitById(id);
      
      if (!nonprofit) {
        return res.status(404).json({ message: "Nonprofit not found" });
      }
      
      await storage.rejectNonprofit(id);
      res.json({ message: "Nonprofit removed from platform" });
    } catch (error: any) {
      console.error("Error rejecting nonprofit:", error);
      res.status(500).json({ message: "Failed to reject nonprofit" });
    }
  });

  // Verify EIN with ProPublica API
  app.get("/api/admin/verify-ein/:ein", async (req, res) => {
    try {
      const { ein } = req.params;
      const cleanEin = ein.replace(/[^0-9]/g, '');
      
      if (cleanEin.length !== 9) {
        return res.status(400).json({ message: "Invalid EIN format. Must be 9 digits." });
      }
      
      const response = await fetch(`https://projects.propublica.org/nonprofits/api/v2/organizations/${cleanEin}.json`);
      
      if (response.status === 404) {
        return res.json({ 
          found: false, 
          message: "No nonprofit found with this EIN in IRS records" 
        });
      }
      
      if (!response.ok) {
        throw new Error("Failed to fetch from ProPublica API");
      }
      
      const data = await response.json();
      const org = data.organization;
      
      res.json({
        found: true,
        organization: {
          name: org.name,
          ein: org.ein,
          city: org.city,
          state: org.state,
          nteeCode: org.ntee_code,
          subsectionCode: org.subsection_code,
          rulingDate: org.ruling_date,
          taxPeriod: org.tax_period,
          incomeAmount: org.income_amount,
          revenueAmount: org.revenue_amt,
        },
        filings: data.filings_with_data?.slice(0, 3) || [],
      });
    } catch (error: any) {
      console.error("Error verifying EIN:", error);
      res.status(500).json({ message: "Failed to verify EIN" });
    }
  });

  return httpServer;
}
