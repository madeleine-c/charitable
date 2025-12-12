import { View, Text, FlatList, RefreshControl, TouchableOpacity, Image } from "react-native";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { api, getGuestId } from "../../src/lib/api";
import { queryClient } from "../../src/lib/query";
import type { PostWithNonprofit } from "@charitable/shared";

function PostCard({ post }: { post: PostWithNonprofit }) {
  const router = useRouter();
  const [guestId, setGuestId] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);

  useEffect(() => {
    getGuestId().then(setGuestId);
  }, []);

  useEffect(() => {
    if (guestId) {
      api.checkReaction(post.id, guestId).then((res) => setIsLiked(res.liked));
    }
  }, [guestId, post.id]);

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!guestId) return;
      return api.toggleReaction(post.id, guestId);
    },
    onSuccess: (data) => {
      if (data) {
        setIsLiked(data.liked);
        setLikeCount((prev) => (data.liked ? prev + 1 : prev - 1));
      }
    },
  });

  const progress = post.goalAmount ? Math.min((post.raisedAmount || 0) / post.goalAmount * 100, 100) : 0;

  return (
    <View className="bg-card border-b border-border">
      {/* Header */}
      <TouchableOpacity
        className="flex-row items-center p-4 gap-3"
        onPress={() => router.push(`/nonprofit/${post.nonprofit.slug}`)}
      >
        <View className="w-10 h-10 rounded-full bg-secondary items-center justify-center overflow-hidden">
          {post.nonprofit.logoUrl ? (
            <Image source={{ uri: post.nonprofit.logoUrl }} className="w-full h-full" />
          ) : (
            <Text className="text-lg font-bold text-foreground">
              {post.nonprofit.name.charAt(0)}
            </Text>
          )}
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-foreground">{post.nonprofit.name}</Text>
          <Text className="text-xs text-muted-foreground">{post.nonprofit.category}</Text>
        </View>
      </TouchableOpacity>

      {/* Image */}
      {post.imageUrl && (
        <Image
          source={{ uri: post.imageUrl }}
          className="w-full aspect-video"
          resizeMode="cover"
        />
      )}

      {/* Actions */}
      <View className="flex-row items-center gap-4 px-4 py-3">
        <TouchableOpacity
          className="flex-row items-center gap-1"
          onPress={() => likeMutation.mutate()}
        >
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={24}
            color={isLiked ? "#ef4444" : "#64748b"}
          />
          <Text className="text-muted-foreground">{likeCount}</Text>
        </TouchableOpacity>

        <View className="flex-1" />

        <TouchableOpacity
          className="bg-primary px-4 py-2 rounded-lg"
          onPress={() => router.push({
            pathname: "/donate",
            params: { nonprofitId: post.nonprofitId, postId: post.id }
          })}
        >
          <Text className="text-primary-foreground font-semibold">Donate</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="px-4 pb-4">
        <Text className="font-bold text-foreground text-lg mb-1">{post.title}</Text>
        <Text className="text-foreground mb-3" numberOfLines={3}>{post.content}</Text>

        {/* Goal Progress */}
        {post.goalAmount && (
          <View>
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
      </View>
    </View>
  );
}

export default function FeedScreen() {
  const { data: posts, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["feed"],
    queryFn: () => api.getFeed(20, 0),
  });

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={posts || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View className="flex-1 items-center justify-center py-20">
              <Ionicons name="heart-outline" size={48} color="#64748b" />
              <Text className="text-xl font-semibold text-foreground mt-4">No posts yet</Text>
              <Text className="text-muted-foreground mt-2 text-center px-8">
                Check back soon for updates from nonprofits!
              </Text>
            </View>
          ) : null
        }
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </View>
  );
}
