import {
  View,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Text,
  Pressable,
  Dimensions,
} from "react-native";
import { useMemo } from "react";
import { useLocalSearchParams, Link } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import WeightService from "@/api/details/weightService";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import useQueryRefresh from "@/hooks/useQueryRefresh";
import { FlashList } from "@shopify/flash-list";
import { LineChart } from "react-native-gifted-charts";

const PetWeight = () => {
  const { id, petId } = useLocalSearchParams<{ id: string; petId: string }>();
  const queryClient = useQueryClient();
  const { data, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["pets", petId, "weights"],
    queryFn: ({ pageParam }) => WeightService.getAll(pageParam, Number(petId)),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.next,
  });

  const { refreshing, handleRefresh } = useQueryRefresh(() => {
    queryClient.resetQueries({ queryKey: ["pets", petId, "weights"], exact: true });
    refetch();
  });

  const convertedData = useMemo(() => {
    return data?.pages
      .flatMap((page) =>
        page.results.map((item) => {
          if (!item) return null;

          const value = parseFloat(item.weight);
          const label = new Date(item.date).toLocaleDateString("pl-PL", {
            month: "short",
            day: "2-digit",
          });

          return {
            value,
            label,
          };
        })
      )
      .reverse();
  }, [data]);

  const chartWidth = Dimensions.get("window").width - 96;

  return (
    <View style={[defaultStyles.container, { gap: 16 }]}>
      {convertedData && (
        <LineChart
          width={chartWidth}
          data={convertedData}
          adjustToWidth={true}
          endSpacing={10}
          spacing={60}
          thickness={2}
        />
      )}
      <FlashList
        data={data?.pages.flatMap((page) => page.results)}
        ListHeaderComponent={<Text style={defaultStyles.subHeaderText}>Historia</Text>}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        onEndReachedThreshold={0.1}
        contentContainerStyle={{ paddingBottom: 16 }}
        estimatedItemSize={61}
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: "/family/[id]/pets/[petId]/weight/[weightId]",
              params: { id: id, petId, weightId: item.id },
            }}
            asChild
          >
            <Pressable style={styles.weightCard}>
              <View style={{ marginTop: 4 }}>
                <FontAwesome5 name='weight-hanging' size={22} color='black' />
              </View>
              <View style={{ gap: 4 }}>
                <Text style={{ fontFamily: "Inter-Medium", fontSize: 16 }}>{item.weight} kg</Text>
                <Text style={{ fontFamily: "Inter", fontSize: 12 }}>{item.date}</Text>
              </View>
            </Pressable>
          </Link>
        )}
        keyExtractor={(item) => item.id.toString()}
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
  weightCard: {
    flex: 1,
    padding: 8,
    gap: 12,
    backgroundColor: "#FFC043",
    borderRadius: 12,
    flexDirection: "row",
  },
});

export default PetWeight;
