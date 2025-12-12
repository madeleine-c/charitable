import * as SecureStore from "expo-secure-store";

export interface Nonprofit {
  id: number;
  name: string;
  slug: string;
  mission: string;
  description?: string | null;
  category: string;
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  isVerified: boolean;
  totalRaised?: number | null;
  donorCount?: number | null;
}

export interface Post {
  id: number;
  nonprofitId: number;
  title: string;
  content: string;
  imageUrl?: string | null;
  goalAmount?: number | null;
  raisedAmount?: number | null;
  isActive: boolean;
  createdAt: string;
  nonprofit?: Nonprofit;
  reactionCount?: number;
  hasReacted?: boolean;
}

export interface FeedResponse {
  posts: Post[];
  nextCursor?: number;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000";
const GUEST_ID_KEY = "charitable_guest_id";

async function getGuestId(): Promise<string> {
  let guestId = await SecureStore.getItemAsync(GUEST_ID_KEY);
  if (!guestId) {
    guestId = crypto.randomUUID();
    await SecureStore.setItemAsync(GUEST_ID_KEY, guestId);
  }
  return guestId;
}

export const api = {
  async getFeed(cursor?: number, limit = 20): Promise<FeedResponse> {
    const guestId = await getGuestId();
    const params = new URLSearchParams({ limit: limit.toString(), guestId });
    if (cursor) params.set("cursor", cursor.toString());
    const response = await fetch(`${API_URL}/api/feed?${params}`);
    if (!response.ok) throw new Error("Failed to fetch feed");
    return response.json();
  },

  async getNonprofits(): Promise<Nonprofit[]> {
    const response = await fetch(`${API_URL}/api/nonprofits`);
    if (!response.ok) throw new Error("Failed to fetch nonprofits");
    return response.json();
  },

  async getNonprofitBySlug(slug: string): Promise<Nonprofit> {
    const response = await fetch(`${API_URL}/api/nonprofits/slug/${slug}`);
    if (!response.ok) throw new Error("Failed to fetch nonprofit");
    return response.json();
  },

  async getPostsByNonprofit(nonprofitId: number): Promise<Post[]> {
    const response = await fetch(`${API_URL}/api/posts/nonprofit/${nonprofitId}`);
    if (!response.ok) throw new Error("Failed to fetch posts");
    return response.json();
  },

  async toggleReaction(postId: number): Promise<{ reacted: boolean; count: number }> {
    const guestId = await getGuestId();
    const response = await fetch(`${API_URL}/api/reactions/guest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, guestId }),
    });
    if (!response.ok) throw new Error("Failed to toggle reaction");
    return response.json();
  },

  async createDonation(nonprofitId: string, amount: number, postId?: string): Promise<{ checkoutUrl: string }> {
    const response = await fetch(`${API_URL}/api/donations/create-checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nonprofitId: parseInt(nonprofitId),
        amount,
        postId: postId ? parseInt(postId) : undefined,
      }),
    });
    if (!response.ok) throw new Error("Failed to create donation");
    return response.json();
  },
};
