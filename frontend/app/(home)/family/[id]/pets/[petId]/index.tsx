import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Pressable,
} from "react-native";
import { useLocalSearchParams, Stack, Link } from "expo-router";
import { memo } from "react";
import { defaultStyles } from "@/constants/Styles";
import PetService from "@/api/petService";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useQueryRefresh from "@/hooks/useQueryRefresh";
import GenericDetailsItem from "@/components/GenericDetailsItem";
import useFamilyRole from "@/hooks/useFamilyRole";
import { getAge, formatAge } from "@/utils/age";

const PetRetrieve = () => {
  const queryClient = useQueryClient();
  const { id, petId } = useLocalSearchParams();
  const { data: pet, refetch } = useQuery({
    queryKey: ["pets", petId],
    queryFn: () => PetService.get(Number(petId)),
    staleTime: 60 * 1000 * 5,
  });
  const { refreshRole } = useFamilyRole(Number(id));

  const { refreshing, handleRefresh } = useQueryRefresh(() => {
    queryClient.resetQueries({ queryKey: ["pets", petId, "newest_records"], exact: true });
    refreshRole();
    refetch();
  });

  const { years, months } = pet ? getAge(pet.date_of_birth) : { years: 0, months: 0 };

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      style={defaultStyles.container}
    >
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitleAlign: "center",
          title: pet?.name || "",
          headerStyle: { backgroundColor: "#fff" },
        }}
      />
      {pet && (
        <View style={styles.cardList}>
          <Text style={{ fontSize: 24, fontFamily: "Inter-Bold", marginBottom: 4 }}>
            Informacje o zwierzęciu
          </Text>
          <View style={[styles.cardList, { flexDirection: "row", flexWrap: "wrap" }]}>
            <View style={[styles.card, { flex: 1 }]}>
              <Text style={styles.cardTitle}>{pet.name}</Text>
              <Text style={styles.cardOwner}>Gatunek: {pet.species}</Text>
              <Text style={styles.cardOwner}>Rasa: {pet.breed}</Text>
              <Text style={styles.cardOwner}>Opis: {pet.description}</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Link href={{ pathname: "./weight" }} relativeToDirectory={true} asChild>
              <Pressable style={styles.cardIcons}>
                <FontAwesome5 name='weight-hanging' size={20} color='black' />
                <View style={{ alignItems: "center" }}>
                  <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12 }}>Waga</Text>
                  {pet.weight ? (
                    <Text style={{ fontFamily: "Inter" }}>{pet.weight} kg</Text>
                  ) : (
                    <Text style={{ fontFamily: "Inter" }}>Brak</Text>
                  )}
                </View>
              </Pressable>
            </Link>
            <View style={styles.cardIcons}>
              <FontAwesome name='birthday-cake' size={20} color='black' />
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12 }}>Wiek</Text>
                <Text style={{ fontFamily: "Inter" }}>{formatAge(years, months)}</Text>
              </View>
            </View>
          </View>
          <Section title='Najnowsze' petId={petId.toString()} />
        </View>
      )}
    </ScrollView>
  );
};

const Section = memo(({ title, petId }: { title: string; petId: string }) => {
  const { data: records, isFetching } = useQuery({
    queryKey: ["pets", petId, "newest_records"],
    queryFn: () => PetService.getRecords({ petId: Number(petId), limit: 5 }),
    staleTime: 60 * 1000 * 5,
  });

  return (
    <>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 18 }}>{title}</Text>
        <Link href={{ pathname: "./[petId]/details/", params: { petId: petId } }} asChild>
          <TouchableOpacity>
            <Text style={{ fontFamily: "Inter", fontSize: 12, color: "#666666" }}>
              Pokaż więcej
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
      {records?.count && records?.count > 0 ? (
        <View style={{ gap: 8, paddingLeft: 8 }}>
          {records?.results.map((item, index) => {
            return (
              <GenericDetailsItem
                key={index}
                item={item}
                api={`./[petId]/details/${item.detail_type}/[detailId]`}
              />
            );
          })}
        </View>
      ) : (
        !isFetching && <Text style={styles.interRegular}>Brak danych</Text>
      )}
    </>
  );
});

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
  cardIcons: {
    backgroundColor: "#FFC043",
    padding: 8,
    flex: 1,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
  },
  interRegular: {
    fontFamily: "Inter",
    fontSize: 12,
  },
});

export default PetRetrieve;
