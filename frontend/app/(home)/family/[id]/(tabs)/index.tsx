import { Text, FlatList, View, ScrollView, RefreshControl } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import FamilyService from "@/api/familyService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import FamilyDetails from "@/components/FamilyDetails";
import MemberCard from "@/components/MemberCard";
import PetCard from "@/components/PetCard";
import EmptyPetList from "@/components/EmptyPetList";
import useQueryRefresh from "@/hooks/useQueryRefresh";
import useFamilyRole from "@/hooks/useFamilyRole";

const FamilyRetrieve = () => {
  const { id } = useLocalSearchParams();

  const queryClient = useQueryClient();
  const {
    isPending,
    data: family,
    refetch,
  } = useQuery({
    queryKey: ["families", id],
    queryFn: () => FamilyService.get(Number(id)),
  });
  const { role, isLoadingRole, refreshRole } = useFamilyRole(Number(id));
  const { refreshing, handleRefresh } = useQueryRefresh(() => {
    refreshRole();
    refetch();
  });

  if (isPending) return <View style={defaultStyles.container}></View>;

  return (
    <ScrollView
      style={defaultStyles.container}
      contentContainerStyle={{ gap: 8 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      <FamilyDetails name={family?.name} owner={family?.owner} />
      <View>
        <Text style={[defaultStyles.subHeaderText, { marginBottom: 8 }]}>Członkowie:</Text>
        <FlatList
          numColumns={3}
          initialNumToRender={6}
          scrollEnabled={false}
          columnWrapperStyle={{ gap: 8 }}
          data={family?.members}
          renderItem={({ item }) => <MemberCard familyId={id.toString()} member={item} />}
          keyExtractor={(item) => item.id}
        />
      </View>
      <View>
        <Text style={[defaultStyles.subHeaderText, { marginBottom: 8 }]}>Zwierzęta:</Text>
        <FlatList
          numColumns={3}
          scrollEnabled={false}
          initialNumToRender={6}
          contentContainerStyle={{ gap: 8 }}
          columnWrapperStyle={{ gap: 8 }}
          data={family?.pets}
          ListEmptyComponent={() =>
            !isPending && !isLoadingRole && role <= 2 && <EmptyPetList familyId={id.toString()} />
          }
          renderItem={({ item }) => <PetCard familyId={id.toString()} pet={item} />}
          keyExtractor={(item) => item.id}
        />
      </View>
    </ScrollView>
  );
};

export default FamilyRetrieve;
