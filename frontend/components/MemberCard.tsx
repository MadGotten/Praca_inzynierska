import { Text, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { MemberProps } from "@/api/memberService";
import { MemberRole } from "@/utils/enums";

const MemberCard = ({ familyId, member }: { familyId: string; member: MemberProps }) => (
  <Link
    href={{
      pathname: "/family/[id]/members/[memberId]",
      params: { id: familyId, memberId: member.id },
    }}
    asChild
  >
    <Pressable style={styles.card}>
      <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail'>
        {member.user}
      </Text>
      <Text style={styles.owner} numberOfLines={1} ellipsizeMode='tail'>
        Rola: {MemberRole[member.role]}
      </Text>
    </Pressable>
  </Link>
);

const styles = StyleSheet.create({
  card: {
    padding: 12,
    width: "31.8%",
    justifyContent: "space-between",
    gap: 8,
    backgroundColor: "#FFC043",
    borderRadius: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
  },
  owner: {
    fontSize: 14,
    fontFamily: "Inter",
  },
});

export default MemberCard;
