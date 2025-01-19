import { View, FlatList, RefreshControl, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import PetService from "@/api/petService";
import { useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import useQueryRefresh from "@/hooks/useQueryRefresh";
import PetItem from "@/components/PetItem";
import EmptyPetList from "@/components/EmptyPetList";
import { FlashList } from "@shopify/flash-list";
import useFamilyRole from "@/hooks/useFamilyRole";

const PetList = () => {
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const { data, refetch, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteQuery({
      queryKey: ["families", id, "pets"],
      queryFn: ({ pageParam }) => PetService.getAll(pageParam, Number(id)),
      initialPageParam: "",
      getNextPageParam: (lastPage) => lastPage.next,
    });
  const { role, isLoadingRole, refreshRole } = useFamilyRole(Number(id));

  const { refreshing, handleRefresh } = useQueryRefresh(() => {
    queryClient.resetQueries({ queryKey: ["families", id, "pets"], exact: true });
    refreshRole();
    refetch();
  });

  return (
    <View style={defaultStyles.container}>
      <Text style={[defaultStyles.headerText, { marginBottom: 4 }]}>Zwierzęta</Text>
      {!isPending && (
        <FlashList
          data={data?.pages.flatMap((page) => page.results)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.1}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          contentContainerStyle={{ paddingBottom: 16 }}
          estimatedItemSize={72}
          ListEmptyComponent={() =>
            !isLoadingRole && role <= 2 && <EmptyPetList familyId={id.toString()} />
          }
          renderItem={({ item }) => <PetItem pet={item} />}
          keyExtractor={(item) => item.id}
          ListFooterComponent={() =>
            isFetchingNextPage ? <ActivityIndicator size='large' color='#FFC043' /> : null
          }
        />
      )}
    </View>
  );
};

export default PetList;
