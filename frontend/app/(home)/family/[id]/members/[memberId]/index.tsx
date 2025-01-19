import { Text, ScrollView, View, StyleSheet, RefreshControl } from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import Button from "@/components/ui/Button";
import MemberService from "@/api/memberService";
import { useQuery } from "@tanstack/react-query";
import useQueryRefresh from "@/hooks/useQueryRefresh";
import useFamilyRole from "@/hooks/useFamilyRole";

enum MemberRole {
  Właściciel = 1,
  Administrator = 2,
  Członek = 3,
}

const MemberRetrieve = () => {
  const router = useRouter();
  const { id, memberId } = useLocalSearchParams<{ id: string; memberId: string }>();

  const { data: member, refetch } = useQuery({
    queryKey: ["members", memberId],
    queryFn: () => MemberService.get(Number(memberId)),
  });
  const { role, isLoadingRole } = useFamilyRole(Number(id));
  const { refreshing, handleRefresh } = useQueryRefresh(refetch);

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      style={[defaultStyles.container, { gap: 8 }]}
    >
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitleAlign: "center",
          title: member?.user,
          headerStyle: { backgroundColor: "#fff" },
        }}
      />
      {member && (
        <View style={styles.cardList}>
          <Text style={{ fontSize: 24, fontFamily: "Inter-Bold", marginBottom: 4 }}>
            Informacje o członku rodziny
          </Text>
          <View style={[styles.cardList, { flexDirection: "row", flexWrap: "wrap" }]}>
            <View style={[styles.card, { flex: 1 }]}>
              <Text style={styles.cardTitle}>{member.user}</Text>
              <Text style={styles.cardOwner}>Rola: {MemberRole[member.role]}</Text>
            </View>
          </View>
          {member.role !== 1 && !isLoadingRole && role === 1 && (
            <Button
              onPress={() =>
                router.push({
                  pathname: "/family/[id]/members/[memberId]/edit",
                  params: { id, memberId },
                })
              }
            >
              Zmień role
            </Button>
          )}
        </View>
      )}
    </ScrollView>
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

export default MemberRetrieve;
