import { View, RefreshControl, Text, ActivityIndicator } from "react-native";
import { defaultStyles } from "@/constants/Styles";
import InviteService from "@/api/inviteService";
import { useInfiniteQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import useQueryRefresh from "@/hooks/useQueryRefresh";
import { FlashList } from "@shopify/flash-list";
import { Pressable, StyleSheet } from "react-native";
import Button from "@/components/ui/Button";

const UserInviteList = () => {
  const queryClient = useQueryClient();
  const { data, refetch, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteQuery({
      queryKey: ["me", "invites"],
      queryFn: ({ pageParam }) => InviteService.getUserAll(pageParam),
      initialPageParam: "",
      getNextPageParam: (lastPage) => lastPage.next,
    });

  const { refreshing, handleRefresh } = useQueryRefresh(() => {
    queryClient.resetQueries({ queryKey: ["me", "invites"], exact: true });
    refetch();
  });

  const acceptMutation = useMutation({
    mutationFn: (inviteId: string) => InviteService.accept(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["families"] });
      queryClient.invalidateQueries({ queryKey: ["me", "invites"] });
    },
  });

  const declineMutation = useMutation({
    mutationFn: (inviteId: string) => InviteService.decline(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me", "invites"] });
    },
  });

  return (
    <View style={defaultStyles.container}>
      <Text style={[defaultStyles.headerText, { marginBottom: 4 }]}>Twoje zaproszenia</Text>
      <FlashList
        data={data?.pages.flatMap((page) => page.results)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.1}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        estimatedItemSize={70}
        contentContainerStyle={{ paddingBottom: 16 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.card}>
            <View style={styles.memberGutter}>
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.memberName}>{item.family}</Text>
                <Text style={styles.detailsText}>Status: {item.status.label}</Text>
              </View>
              <View style={styles.actions}>
                <View style={styles.buttonWrapper}>
                  <Button
                    variant='sm'
                    color='#4CAF50'
                    textColor='white'
                    onPress={() => acceptMutation.mutate(item.id)}
                    disabled={acceptMutation.isPending || declineMutation.isPending}
                  >
                    Akceptuj
                  </Button>
                </View>
                <View style={styles.buttonWrapper}>
                  <Button
                    variant='sm'
                    color='#F44336'
                    textColor='white'
                    onPress={() => declineMutation.mutate(item.id)}
                    disabled={acceptMutation.isPending || declineMutation.isPending}
                  >
                    Odrzuć
                  </Button>
                </View>
              </View>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={() =>
          !isPending && <Text style={defaultStyles.defaultText}>Brak zaproszeń</Text>
        }
        ListFooterComponent={() =>
          isFetchingNextPage ? <ActivityIndicator size='large' color='#FFC043' /> : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 12,
    backgroundColor: "skyblue",
    borderRadius: 12,
  },
  memberGutter: {
    gap: 4,
  },
  memberName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
  },
  detailsText: {
    fontFamily: "Inter",
    fontSize: 14,
  },
  buttonTabText: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  buttonWrapper: {
    flex: 1,
    flexGrow: 1,
  },
});

export default UserInviteList;
