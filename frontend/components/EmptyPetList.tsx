import { Pressable, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";

const EmptyPetList = ({ familyId }: { familyId: string }) => (
  <Link href={{ pathname: "/family/[id]/pets/create", params: { id: familyId } }} asChild>
    <Pressable style={styles.card}>
      <Text style={styles.addCard}>Dodaj</Text>
    </Pressable>
  </Link>
);

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 12,
    borderColor: "#c2c2c2",
    borderWidth: 2,
    borderStyle: "dashed",
  },
  addCard: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    textAlign: "center",
  },
});

export default EmptyPetList;
