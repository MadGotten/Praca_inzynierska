import { TouchableOpacity, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { SheetManager } from "react-native-actions-sheet";
import { defaultScreenStyles } from "@/constants/Styles";
import useFamilyRole from "@/hooks/useFamilyRole";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function Layout() {
  const { id, petId } = useLocalSearchParams();
  const { role, isLoadingRole } = useFamilyRole(Number(id));

  return (
    <Stack>
      <Stack.Screen
        name='(tabs)'
        options={{
          headerShadowVisible: false,
          headerTitleAlign: "center",
          title: "Szczegóły",
          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              {!isLoadingRole && role <= 2 && (
                <TouchableOpacity
                  onPress={() =>
                    SheetManager.show("detailslist-sheet", { payload: { petId: Number(petId) } })
                  }
                >
                  <MaterialIcons name='add' size={30} color='black' />
                </TouchableOpacity>
              )}
            </View>
          ),
          headerStyle: { backgroundColor: "#fff" },
        }}
      />
      <Stack.Screen
        name='health/create'
        options={{ ...defaultScreenStyles, title: "Utwórz wpis" }}
      />
      <Stack.Screen name='health/[healthId]' options={{ headerShown: false }} />
      <Stack.Screen
        name='vaccinations/create'
        options={{ ...defaultScreenStyles, title: "Utwórz wpis" }}
      />
      <Stack.Screen name='vaccinations/[vaccinationId]' options={{ headerShown: false }} />
      <Stack.Screen
        name='activities/create'
        options={{ ...defaultScreenStyles, title: "Utwórz wpis" }}
      />
      <Stack.Screen name='activities/[activityId]' options={{ headerShown: false }} />
      <Stack.Screen
        name='notes/create'
        options={{ ...defaultScreenStyles, title: "Utwórz wpis" }}
      />
      <Stack.Screen name='notes/[noteId]' options={{ headerShown: false }} />
    </Stack>
  );
}
