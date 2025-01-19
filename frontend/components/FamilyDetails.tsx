import { View, Text, StyleSheet } from "react-native";
import { defaultStyles } from "@/constants/Styles";

type FamilyDetailsProps = {
  name?: string;
  owner?: string;
};

const FamilyDetails = ({ name, owner }: FamilyDetailsProps) => (
  <View>
    <Text style={[defaultStyles.headerText, { marginBottom: 8 }]}>Informacje o rodzinie</Text>
    <View style={styles.card}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.owner}>Właściciel: {owner}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    padding: 12,
    backgroundColor: "#FFC043",
    borderRadius: 12,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
  },
  owner: {
    fontFamily: "Inter-Medium",
  },
});

export default FamilyDetails;
