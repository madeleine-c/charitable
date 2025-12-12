import { View, Text, FlatList, RefreshControl, TouchableOpacity, Image } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../src/lib/api";
import type { Nonprofit } from "@charitable/shared";

function NonprofitCard({ nonprofit }: { nonprofit: Nonprofit }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      className="bg-card border border-border rounded-lg p-4 m-2 flex-1"
      onPress={() => router.push(`/nonprofit/${nonprofit.slug}`)}
    >
      <View className="w-16 h-16 rounded-full bg-secondary items-center justify-center self-center mb-3 overflow-hidden">
        {nonprofit.logoUrl ? (
          <Image source={{ uri: nonprofit.logoUrl }} className="w-full h-full" />
        ) : (
          <Text className="text-2xl font-bold text-foreground">
            {nonprofit.name.charAt(0)}
          </Text>
        )}
      </View>

      <Text className="font-bold text-foreground text-center mb-1" numberOfLines={2}>
        {nonprofit.name}
      </Text>

      <View className="bg-secondary self-center px-2 py-1 rounded-full mb-2">
        <Text className="text-xs text-muted-foreground">{nonprofit.category}</Text>
      </View>

      <Text className="text-sm text-muted-foreground text-center" numberOfLines={3}>
        {nonprofit.mission}
      </Text>

      {(nonprofit.totalRaised ?? 0) > 0 && (
        <Text className="text-sm font-semibold text-primary text-center mt-2">
          ${((nonprofit.totalRaised ?? 0) / 100).toLocaleString()} raised
        </Text>
      )}
    </TouchableOpacity>
  );
}

export default function DiscoverScreen() {
  const { data: nonprofits, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["nonprofits"],
    queryFn: () => api.getNonprofits(),
  });

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={nonprofits || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NonprofitCard nonprofit={item} />}
        numColumns={2}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View className="flex-1 items-center justify-center py-20">
              <Ionicons name="search-outline" size={48} color="#64748b" />
              <Text className="text-xl font-semibold text-foreground mt-4">No nonprofits yet</Text>
              <Text className="text-muted-foreground mt-2 text-center px-8">
                Check back soon for amazing organizations!
              </Text>
            </View>
          ) : null
        }
        contentContainerStyle={{ flexGrow: 1, padding: 8 }}
      />
    </View>
  );
}
