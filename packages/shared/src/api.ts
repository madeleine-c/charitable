import type { Nonprofit, Post, PostWithNonprofit, Donation, ReactionResponse, DonationCheckoutResponse } from "./types";

// API client configuration
export interface ApiConfig {
  baseUrl: string;
  getHeaders?: () => Record<string, string>;
}

// Create an API client for the Charitable backend
export function createApiClient(config: ApiConfig) {
  const { baseUrl, getHeaders = () => ({}) } = config;

  async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${baseUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...getHeaders(),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Request failed" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  return {
    // Feed endpoints
    getFeed: (limit = 20, offset = 0) =>
      request<PostWithNonprofit[]>(`/api/feed?limit=${limit}&offset=${offset}`),

    // Post endpoints
    getPost: (id: string) =>
      request<Post>(`/api/posts/${id}`),

    getPostsByNonprofit: (nonprofitId: string) =>
      request<Post[]>(`/api/nonprofits/${nonprofitId}/posts`),

    // Reaction endpoints
    toggleReaction: (postId: string, guestId: string) =>
      request<ReactionResponse>(`/api/posts/${postId}/react`, {
        method: "POST",
        body: JSON.stringify({ guestId }),
      }),

    checkReaction: (postId: string, guestId: string) =>
      request<ReactionResponse>(`/api/posts/${postId}/liked?guestId=${guestId}`),

    // Nonprofit endpoints
    getNonprofits: () =>
      request<Nonprofit[]>("/api/nonprofits"),

    getNonprofit: (id: string) =>
      request<Nonprofit>(`/api/nonprofits/${id}`),

    getNonprofitBySlug: (slug: string) =>
      request<Nonprofit>(`/api/nonprofits/slug/${slug}`),

    // Donation endpoints
    createDonation: (nonprofitId: string, amount: number, postId?: string) =>
      request<DonationCheckoutResponse>("/api/donations", {
        method: "POST",
        body: JSON.stringify({ nonprofitId, amount, postId }),
      }),

    verifyDonation: (sessionId: string) =>
      request<{ success: boolean; donation?: Donation }>(`/api/donations/verify/${sessionId}`),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
