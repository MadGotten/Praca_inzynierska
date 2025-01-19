import { View, StyleSheet, RefreshControl, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import PetService from "@/api/petService";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import useQueryRefresh from "@/hooks/useQueryRefresh";
import { FlashList } from "@shopify/flash-list";
import GenericDetailsItem from "@/components/GenericDetailsItem";

const PetDetails = () => {
  const { petId } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const { data, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["pets", petId, "records"],
    queryFn: ({ pageParam }) => PetService.getRecords({ pageParam, petId: Number(petId) }),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.next,
  });

  const { refreshing, handleRefresh } = useQueryRefresh(() => {
    queryClient.resetQueries({ queryKey: ["pets", petId, "records"], exact: true });
    refetch();
  });

  return (
    <View style={[defaultStyles.container, { paddingTop: 16 }]}>
      <FlashList
        data={data?.pages.flatMap((page) => page.results)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        onEndReachedThreshold={0.1}
        estimatedItemSize={45}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => (
          <GenericDetailsItem
            key={item.id}
            item={item}
            api={`family/[id]/pets/[petId]/details/${item.detail_type}/[detailId]`}
          />
        )}
        ListFooterComponent={() =>
          isFetchingNextPage ? <ActivityIndicator size='large' color='#FFC043' /> : null
        }
      />
    </View>
  );
};

export const styles = StyleSheet.create({
  cardList: {
    display: "flex",
    gap: 8,
  },
  card: {
    padding: 12,
    flex: 1 / 3,
    backgroundColor: "#FFC043",
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
  },
  cardOwner: {
    fontFamily: "Inter-Medium",
  },
  interRegular: {
    fontFamily: "Inter",
    fontSize: 12,
  },
});

export default PetDetails;
