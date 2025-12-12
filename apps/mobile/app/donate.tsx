import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../src/lib/api";

const PRESET_AMOUNTS = [1000, 2500, 5000, 10000]; // in cents

export default function DonateScreen() {
  const { nonprofitId, postId } = useLocalSearchParams<{ nonprofitId: string; postId?: string }>();
  const router = useRouter();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(2500);
  const [customAmount, setCustomAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const amount = customAmount ? parseInt(customAmount) * 100 : selectedAmount;

  const handleDonate = async () => {
    if (!amount || amount < 100) {
      Alert.alert("Invalid Amount", "Please enter an amount of at least $1");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.createDonation(nonprofitId!, amount, postId);
      
      // Open Stripe Checkout in browser
      const result = await WebBrowser.openBrowserAsync(response.checkoutUrl);
      
      if (result.type === "cancel") {
        // User closed the browser
        Alert.alert("Donation Cancelled", "You can try again anytime!");
      }
      
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to start donation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        <Text className="text-2xl font-bold text-foreground mb-2">Make a Donation</Text>
        <Text className="text-muted-foreground mb-6">
          Choose an amount to support this nonprofit
        </Text>

        {/* Preset Amounts */}
        <View className="flex-row flex-wrap gap-3 mb-6">
          {PRESET_AMOUNTS.map((preset) => (
            <TouchableOpacity
              key={preset}
              className={`flex-1 min-w-[45%] py-4 rounded-lg items-center border ${
                selectedAmount === preset && !customAmount
                  ? "bg-primary border-primary"
                  : "bg-card border-border"
              }`}
              onPress={() => {
                setSelectedAmount(preset);
                setCustomAmount("");
              }}
            >
              <Text
                className={`text-lg font-bold ${
                  selectedAmount === preset && !customAmount
                    ? "text-primary-foreground"
                    : "text-foreground"
                }`}
              >
                ${preset / 100}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Amount */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-foreground mb-2">Or enter custom amount</Text>
          <View className="flex-row items-center border border-border rounded-lg bg-card px-4">
            <Text className="text-lg text-muted-foreground">$</Text>
            <TextInput
              className="flex-1 py-4 px-2 text-lg text-foreground"
              placeholder="0"
              placeholderTextColor="#64748b"
              keyboardType="numeric"
              value={customAmount}
              onChangeText={(text) => {
                setCustomAmount(text.replace(/[^0-9]/g, ""));
                setSelectedAmount(null);
              }}
            />
          </View>
        </View>

        {/* Info */}
        <View className="bg-secondary rounded-lg p-4 mb-6">
          <View className="flex-row items-center gap-3 mb-3">
            <Ionicons name="shield-checkmark" size={20} color="#6366f1" />
            <Text className="text-foreground font-medium">Secure Payment</Text>
          </View>
          <Text className="text-sm text-muted-foreground">
            Your payment is processed securely by Stripe. 100% of your donation goes directly to the nonprofit.
          </Text>
        </View>

        {/* Donate Button */}
        <TouchableOpacity
          className={`py-4 rounded-lg items-center ${
            amount && amount >= 100 ? "bg-primary" : "bg-muted"
          }`}
          onPress={handleDonate}
          disabled={isLoading || !amount || amount < 100}
        >
          {isLoading ? (
            <Text className="text-primary-foreground font-bold text-lg">Processing...</Text>
          ) : (
            <Text
              className={`font-bold text-lg ${
                amount && amount >= 100 ? "text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              Donate ${amount ? (amount / 100).toLocaleString() : 0}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="py-4 items-center mt-2"
          onPress={() => router.back()}
        >
          <Text className="text-muted-foreground">Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
