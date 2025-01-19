import { View, RefreshControl, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams, Link } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import MemberService from "@/api/memberService";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import useQueryRefresh from "@/hooks/useQueryRefresh";
import MemberItem from "@/components/MemberItem";
import { FlashList } from "@shopify/flash-list";
import useFamilyRole from "@/hooks/useFamilyRole";

const MemberList = () => {
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const { data, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["families", id, "members"],
    queryFn: ({ pageParam }) => MemberService.getAll(pageParam, Number(id)),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.next,
  });
  const { refreshRole } = useFamilyRole(Number(id));

  const { refreshing, handleRefresh } = useQueryRefresh(() => {
    queryClient.resetQueries({ queryKey: ["families", id, "members"], exact: true });
    refreshRole();
    refetch();
  });

  return (
    <View style={defaultStyles.container}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={[defaultStyles.headerText, { marginBottom: 4 }]}>Członkowie</Text>
        <Link href={{ pathname: "../invites/" }}>
          <Text>Zobacz zaproszenia</Text>
        </Link>
      </View>
      <FlashList
        data={data?.pages.flatMap((page) => page.results)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.1}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        estimatedItemSize={72}
        contentContainerStyle={{ paddingBottom: 16 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MemberItem member={item} />}
        ListFooterComponent={() =>
          isFetchingNextPage ? <ActivityIndicator size='large' color='#FFC043' /> : null
        }
      />
    </View>
  );
};

export default MemberList;
