import { Text, View, FlatList, RefreshControl, ActivityIndicator } from "react-native";
import { defaultStyles } from "@/constants/Styles";
import { useTokenStore } from "@/store/tokenStore";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import FamilyService from "@/api/familyService";
import useQueryRefresh from "@/hooks/useQueryRefresh";
import FamilyItem from "@/components/FamilyItem";

const Families = () => {
  const { user } = useTokenStore();
  const { data, refetch, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ["families"],
      queryFn: FamilyService.getAll,
      initialPageParam: "",
      getNextPageParam: (lastPage) => lastPage.next,
    });
  const queryClient = useQueryClient();
  const { refreshing, handleRefresh } = useQueryRefresh(() => {
    queryClient.resetQueries({ queryKey: ["families"], exact: true });
    refetch();
  });

  return (
    <View style={defaultStyles.container}>
      <FlatList
        ListHeaderComponent={() => (
          <Text style={defaultStyles.headerText}>Witaj {user.username}!</Text>
        )}
        numColumns={2}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        columnWrapperStyle={{ gap: 8 }}
        contentContainerStyle={{ gap: 8, paddingBottom: 16 }}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        onEndReachedThreshold={0.1}
        data={data?.pages.flatMap((page) => page.results)}
        renderItem={({ item, index }) => {
          const results = data?.pages.flatMap((page) => page.results);
          if (!results) return null;
          const isOdd = results.length % 2 !== 0 && index === results.length - 1;

          return <FamilyItem item={item} isOdd={isOdd} />;
        }}
        ListEmptyComponent={() =>
          !isFetching && (
            <Text style={defaultStyles.buttonTextSm}>Nie należysz do żadnej rodziny</Text>
          )
        }
        ListFooterComponent={() =>
          isFetchingNextPage ? <ActivityIndicator size='large' color='#FFC043' /> : null
        }
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default Families;
