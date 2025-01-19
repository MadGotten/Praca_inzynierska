import { Text, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { PetProps } from "@/api/petService";
import { getAge, formatAge } from "@/utils/age";

const PetCard = ({ familyId, pet }: { familyId: string; pet: PetProps }) => {
  const { years, months } = pet ? getAge(pet.date_of_birth) : { years: 0, months: 0 };
  return (
    <Link
      href={{
        pathname: "/family/[id]/pets/[petId]",
        params: { id: familyId, petId: pet.id },
      }}
      asChild
    >
      <Pressable style={styles.card}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail'>
          {pet.name}
        </Text>
        <Text style={styles.owner} numberOfLines={1} ellipsizeMode='tail'>
          Wiek: {formatAge(years, months)}
        </Text>
      </Pressable>
    </Link>
  );
};

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

export default PetCard;
