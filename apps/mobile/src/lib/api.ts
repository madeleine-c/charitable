import { createApiClient } from "@charitable/shared";
import * as SecureStore from "expo-secure-store";

// API base URL - update this to your deployed backend URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://your-app.replit.app";

// Create the API client
export const api = createApiClient({
  baseUrl: API_BASE_URL,
  getHeaders: () => {
    // Add auth headers here when implementing authentication
    return {};
  },
});

// Guest ID management for reactions
const GUEST_ID_KEY = "charitable_guest_id";

export async function getGuestId(): Promise<string> {
  let guestId = await SecureStore.getItemAsync(GUEST_ID_KEY);
  
  if (!guestId) {
    guestId = crypto.randomUUID();
    await SecureStore.setItemAsync(GUEST_ID_KEY, guestId);
  }
  
  return guestId;
}
