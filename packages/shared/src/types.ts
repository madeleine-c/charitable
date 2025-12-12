import { z } from "zod";

// Nonprofit categories
export const nonprofitCategories = [
  "Education",
  "Health",
  "Environment",
  "Animals",
  "Arts & Culture",
  "Community Development",
  "Human Services",
  "International",
  "Religion",
  "Other",
] as const;

export type NonprofitCategory = typeof nonprofitCategories[number];

// Nonprofit type
export interface Nonprofit {
  id: string;
  name: string;
  slug: string;
  mission: string;
  description: string | null;
  category: string;
  taxId: string;
  email: string;
  phone: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  bankAccountLast4: string | null;
  bankRoutingLast4: string | null;
  stripeConnectedAccountId: string | null;
  stripeOnboardingComplete: boolean | null;
  stripeChargesEnabled: boolean | null;
  stripePayoutsEnabled: boolean | null;
  logoUrl: string | null;
  coverImageUrl: string | null;
  isVerified: boolean | null;
  isActive: boolean | null;
  totalRaised: number | null;
  donorCount: number | null;
  createdAt: Date | null;
}

// Post type
export interface Post {
  id: string;
  nonprofitId: string;
  title: string;
  content: string;
  imageUrl: string | null;
  goalAmount: number | null;
  raisedAmount: number | null;
  donorCount: number | null;
  likeCount: number | null;
  isPublished: boolean | null;
  createdAt: Date | null;
}

// Post with nonprofit info for feed display
export interface PostWithNonprofit extends Post {
  nonprofit: Pick<Nonprofit, "id" | "name" | "slug" | "logoUrl" | "category">;
}

// Donation type
export interface Donation {
  id: string;
  nonprofitId: string;
  amount: number;
  donorEmail: string | null;
  donorName: string | null;
  message: string | null;
  isAnonymous: boolean | null;
  stripePaymentIntentId: string | null;
  stripeCheckoutSessionId: string | null;
  status: string;
  createdAt: Date | null;
}

// Supporter type (donors who use the app)
export interface Supporter {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  createdAt: Date | null;
}

// Reaction type
export interface Reaction {
  id: string;
  postId: string;
  supporterId: string | null;
  guestId: string | null;
  type: string;
  createdAt: Date | null;
}

// API Response types
export interface FeedResponse {
  posts: PostWithNonprofit[];
  hasMore: boolean;
}

export interface ReactionResponse {
  liked: boolean;
}

export interface DonationCheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
}

// Zod schemas for validation
export const donationAmountSchema = z.object({
  amount: z.number().min(100, "Minimum donation is $1"),
  donorEmail: z.string().email().optional(),
  donorName: z.string().optional(),
  message: z.string().optional(),
  isAnonymous: z.boolean().optional(),
});

export type DonationAmountInput = z.infer<typeof donationAmountSchema>;
