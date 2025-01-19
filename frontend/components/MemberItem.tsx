import { Pressable, View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { MemberProps } from "@/api/memberService";
import { MemberRole } from "@/utils/enums";

const MemberItem = ({ member }: { member: MemberProps }) => (
  <Link href={{ pathname: "../members/[memberId]", params: { memberId: member.id } }} asChild>
    <Pressable style={styles.card}>
      <View style={styles.memberGutter}>
        <Text style={styles.memberName}>{member.user}</Text>
        <Text style={styles.detailsText}>Rola: {MemberRole[member.role]}</Text>
      </View>
    </Pressable>
  </Link>
);

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
});

export default MemberItem;
