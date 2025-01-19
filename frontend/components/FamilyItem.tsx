import { View, Text, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";
import { FamilyProps } from "@/api/familyService";

const FamilyItem = ({ item, isOdd }: { item: FamilyProps; isOdd: boolean }) => (
  <Link
    href={{
      pathname: "/family/[id]",
      params: { id: item.id, name: item.name },
    }}
    key={item.id}
    style={[styles.card, isOdd && { marginRight: 32 }]}
    asChild
  >
    <Pressable>
      <View style={{ flexDirection: "row" }}>
        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.header}>
          {item.name}
        </Text>
      </View>
      <Text style={styles.owner}>Właściciel: {item.owner}</Text>
      <Text style={styles.description}>Członkowie: {item.members_total}</Text>
      <Text style={styles.description}>Zwierzęta: {item.pets_total}</Text>
    </Pressable>
  </Link>
);

export const styles = StyleSheet.create({
  card: {
    padding: 12,
    backgroundColor: "#FFC043",
    flex: 1 / 2,
    borderRadius: 12,
  },
  header: {
    fontSize: 18,
    flex: 1,
    fontFamily: "Inter-Bold",
  },
  owner: {
    fontFamily: "Inter-Medium",
  },
  description: {
    fontFamily: "Inter",
    fontSize: 12,
  },
});

export default FamilyItem;
