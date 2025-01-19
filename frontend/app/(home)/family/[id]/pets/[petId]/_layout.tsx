import { TouchableOpacity } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { SheetManager } from "react-native-actions-sheet";
import { defaultScreenStyles } from "@/constants/Styles";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import useFamilyRole from "@/hooks/useFamilyRole";

export default function Layout() {
  const { id, petId } = useLocalSearchParams();
  const { role, isLoadingRole } = useFamilyRole(Number(id));

  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          headerRight: () =>
            !isLoadingRole &&
            role <= 2 && (
              <TouchableOpacity
                onPress={() =>
                  SheetManager.show("petsdetail-sheet", { payload: { petId: Number(petId) } })
                }
                style={{ marginRight: 8 }}
              >
                <MaterialCommunityIcons name='dots-vertical' size={26} color='black' />
              </TouchableOpacity>
            ),
        }}
      />
      <Stack.Screen name='edit' options={{ ...defaultScreenStyles, title: "Edytuj zwierzaka" }} />
      <Stack.Screen name='weight' options={{ headerShown: false }} />
      <Stack.Screen name='details' options={{ headerShown: false }} />
    </Stack>
  );
}
