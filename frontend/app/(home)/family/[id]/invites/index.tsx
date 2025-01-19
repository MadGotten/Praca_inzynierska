import {
  View,
  RefreshControl,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import InviteService from "@/api/inviteService";
import { useInfiniteQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import useQueryRefresh from "@/hooks/useQueryRefresh";
import { FlashList } from "@shopify/flash-list";
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import useFamilyRole from "@/hooks/useFamilyRole";

const InviteList = () => {
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("pending");
  const { data, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["families", id, "invites", status],
    queryFn: ({ pageParam }) => InviteService.getFamilyAll(pageParam, Number(id), status),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.next,
  });
  const { role, isLoadingRole } = useFamilyRole(Number(id));

  const { refreshing, handleRefresh } = useQueryRefresh(() => {
    queryClient.resetQueries({ queryKey: ["families", id, "invites", status], exact: true });
    refetch();
  });

  const deleteMutation = useMutation({
    mutationFn: (inviteId: string) => InviteService.deleteInvite(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["families", id, "invites", status] });
    },
  });

  const handleDelete = (inviteId: string) => {
    Alert.alert(
      "Potwierdź usunięcie",
      "Czy jesteś pewny, że chcesz usunąć to zaproszenie?",
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Usuń",
          style: "destructive",
          onPress: () => deleteMutation.mutate(inviteId),
        },
      ],
      { cancelable: true }
    );
  };

  const buttonStyles = (buttonType: string) => ({
    borderWidth: 1,
    borderRadius: 12,
    padding: 8,
    flex: 1,
    borderColor: status === buttonType ? "#FFC043" : "black",
    backgroundColor: status === buttonType ? "#FFC043" : "white",
  });

  return (
    <View style={defaultStyles.container}>
      <Text style={[defaultStyles.headerText, { marginBottom: 4 }]}>Zaproszeni członkowie</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
        <TouchableOpacity style={buttonStyles("pending")} onPress={() => setStatus("pending")}>
          <Text style={styles.buttonTabText}>Oczekuje</Text>
        </TouchableOpacity>
        <TouchableOpacity style={buttonStyles("accepted")} onPress={() => setStatus("accepted")}>
          <Text style={styles.buttonTabText}>Zaakceptowany</Text>
        </TouchableOpacity>
        <TouchableOpacity style={buttonStyles("declined")} onPress={() => setStatus("declined")}>
          <Text style={styles.buttonTabText}>Odrzucony</Text>
        </TouchableOpacity>
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
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.card,
              item.status.name === "pending" && { backgroundColor: "skyblue" },
              item.status.name === "accepted" && { backgroundColor: "#4CAF50" },
              item.status.name === "declined" && { backgroundColor: "#F44336" },
            ]}
          >
            <View style={styles.memberGutter}>
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={[styles.memberName, { flex: 1 }]}>{item.invited}</Text>
                  {!isLoadingRole && role === 1 && (
                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                      <MaterialIcons name='delete' size={24} color='black' />
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={styles.detailsText}>Status: {item.status.label}</Text>
              </View>
            </View>
          </Pressable>
        )}
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
    backgroundColor: "#FFC043",
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
});

export default InviteList;
