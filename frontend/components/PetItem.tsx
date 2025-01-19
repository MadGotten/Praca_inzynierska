import { Pressable, View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { PetProps } from "@/api/petService";
import { getAge, formatAge } from "@/utils/age";

const PetItem = ({ pet }: { pet: PetProps }) => {
  const { years, months } = pet ? getAge(pet.date_of_birth) : { years: 0, months: 0 };
  return (
    <Link href={{ pathname: "../pets/[petId]", params: { petId: pet.id } }} asChild>
      <Pressable style={styles.card}>
        <View style={styles.petGutter}>
          <Text style={styles.petName}>{pet.name}</Text>
          <View style={styles.petDetails}>
            <Text style={styles.detailsText}>Wiek: {formatAge(years, months)}</Text>
            <Text style={styles.detailsText}>Waga: {pet.weight} kg</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 12,
    backgroundColor: "#FFC043",
    borderRadius: 12,
  },
  petGutter: {
    gap: 4,
  },
  petName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
  },
  petDetails: {
    flexDirection: "row",
    gap: 8,
  },
  detailsText: {
    fontFamily: "Inter",
    fontSize: 14,
  },
});

export default PetItem;
