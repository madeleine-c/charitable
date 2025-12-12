import { View, Text, ScrollView, Image, TouchableOpacity, FlatList } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../src/lib/api";
import type { Post } from "@charitable/shared";

function PostItem({ post, onDonate }: { post: Post; onDonate: () => void }) {
  const progress = post.goalAmount ? Math.min((post.raisedAmount || 0) / post.goalAmount * 100, 100) : 0;

  return (
    <View className="bg-card border border-border rounded-lg p-4 mb-3">
      {post.imageUrl && (
        <Image
          source={{ uri: post.imageUrl }}
          className="w-full aspect-video rounded-lg mb-3"
          resizeMode="cover"
        />
      )}

      <Text className="font-bold text-foreground text-lg mb-2">{post.title}</Text>
      <Text className="text-foreground mb-3" numberOfLines={4}>{post.content}</Text>

      {post.goalAmount && (
        <View className="mb-3">
          <View className="h-2 bg-secondary rounded-full overflow-hidden">
            <View
              className="h-full bg-primary rounded-full"
              style={{ width: `${progress}%` }}
            />
          </View>
          <View className="flex-row justify-between mt-2">
            <Text className="text-sm text-muted-foreground">
              ${((post.raisedAmount || 0) / 100).toLocaleString()} raised
            </Text>
            <Text className="text-sm text-muted-foreground">
              ${(post.goalAmount / 100).toLocaleString()} goal
            </Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        className="bg-primary py-3 rounded-lg items-center"
        onPress={onDonate}
      >
        <Text className="text-primary-foreground font-semibold">Donate to this campaign</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function NonprofitDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();

  const { data: nonprofit, isLoading } = useQuery({
    queryKey: ["nonprofit", slug],
    queryFn: () => api.getNonprofitBySlug(slug!),
    enabled: !!slug,
  });

  const { data: posts } = useQuery({
    queryKey: ["nonprofit-posts", nonprofit?.id],
    queryFn: () => api.getPostsByNonprofit(nonprofit!.id),
    enabled: !!nonprofit?.id,
  });

  if (isLoading || !nonprofit) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-muted-foreground">Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Cover Image */}
      <View className="h-40 bg-secondary">
        {nonprofit.coverImageUrl && (
          <Image
            source={{ uri: nonprofit.coverImageUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        )}
      </View>

      {/* Profile Section */}
      <View className="px-4 -mt-12">
        <View className="w-24 h-24 rounded-full bg-card border-4 border-background items-center justify-center overflow-hidden">
          {nonprofit.logoUrl ? (
            <Image source={{ uri: nonprofit.logoUrl }} className="w-full h-full" />
          ) : (
            <Text className="text-3xl font-bold text-foreground">
              {nonprofit.name.charAt(0)}
            </Text>
          )}
        </View>

        <Text className="text-2xl font-bold text-foreground mt-3">{nonprofit.name}</Text>

        <View className="flex-row items-center gap-2 mt-1">
          <View className="bg-secondary px-2 py-1 rounded-full">
            <Text className="text-xs text-muted-foreground">{nonprofit.category}</Text>
          </View>
          {nonprofit.isVerified && (
            <Ionicons name="checkmark-circle" size={16} color="#6366f1" />
          )}
        </View>

        <Text className="text-foreground mt-3">{nonprofit.mission}</Text>

        {/* Stats */}
        <View className="flex-row gap-6 mt-4">
          <View>
            <Text className="text-xl font-bold text-foreground">
              ${((nonprofit.totalRaised ?? 0) / 100).toLocaleString()}
            </Text>
            <Text className="text-sm text-muted-foreground">raised</Text>
          </View>
          <View>
            <Text className="text-xl font-bold text-foreground">
              {nonprofit.donorCount ?? 0}
            </Text>
            <Text className="text-sm text-muted-foreground">donors</Text>
          </View>
        </View>

        {/* Main Donate Button */}
        <TouchableOpacity
          className="bg-primary py-4 rounded-lg items-center mt-6"
          onPress={() => router.push({
            pathname: "/donate",
            params: { nonprofitId: nonprofit.id }
          })}
        >
          <Text className="text-primary-foreground font-bold text-lg">Donate Now</Text>
        </TouchableOpacity>

        {/* Description */}
        {nonprofit.description && (
          <View className="mt-6">
            <Text className="text-lg font-bold text-foreground mb-2">About</Text>
            <Text className="text-foreground">{nonprofit.description}</Text>
          </View>
        )}

        {/* Posts/Campaigns */}
        <View className="mt-6">
          <Text className="text-lg font-bold text-foreground mb-3">Campaigns</Text>
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                onDonate={() => router.push({
                  pathname: "/donate",
                  params: { nonprofitId: nonprofit.id, postId: post.id }
                })}
              />
            ))
          ) : (
            <View className="bg-secondary rounded-lg p-6 items-center">
              <Text className="text-muted-foreground">No campaigns yet</Text>
            </View>
          )}
        </View>

        <View className="h-20" />
      </View>
    </ScrollView>
  );
}
