import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="items-center py-8">
        <View className="w-24 h-24 rounded-full bg-secondary items-center justify-center mb-4">
          <Ionicons name="person" size={48} color="#64748b" />
        </View>
        <Text className="text-xl font-bold text-foreground">Guest User</Text>
        <Text className="text-muted-foreground mt-1">Sign in to save your activity</Text>
      </View>

      <View className="px-4">
        <TouchableOpacity className="bg-primary py-4 rounded-lg items-center mb-4">
          <Text className="text-primary-foreground font-semibold text-lg">Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity className="border border-border py-4 rounded-lg items-center">
          <Text className="text-foreground font-semibold text-lg">Create Account</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-8 px-4">
        <Text className="text-lg font-bold text-foreground mb-4">About Charitable</Text>
        
        <View className="bg-card border border-border rounded-lg p-4 mb-3">
          <View className="flex-row items-center gap-3">
            <Ionicons name="heart" size={24} color="#6366f1" />
            <View className="flex-1">
              <Text className="font-semibold text-foreground">Direct Giving</Text>
              <Text className="text-sm text-muted-foreground">
                100% of your donation goes directly to the nonprofit
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-card border border-border rounded-lg p-4 mb-3">
          <View className="flex-row items-center gap-3">
            <Ionicons name="shield-checkmark" size={24} color="#6366f1" />
            <View className="flex-1">
              <Text className="font-semibold text-foreground">Secure Payments</Text>
              <Text className="text-sm text-muted-foreground">
                Powered by Stripe for safe, secure transactions
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-card border border-border rounded-lg p-4">
          <View className="flex-row items-center gap-3">
            <Ionicons name="globe" size={24} color="#6366f1" />
            <View className="flex-1">
              <Text className="font-semibold text-foreground">Make an Impact</Text>
              <Text className="text-sm text-muted-foreground">
                Support causes you care about with just a few taps
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="h-20" />
    </ScrollView>
  );
}
