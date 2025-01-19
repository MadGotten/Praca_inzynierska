import { Stack, useLocalSearchParams } from "expo-router";
import { defaultScreenStyles } from "@/constants/Styles";
import useFamilyRole from "@/hooks/useFamilyRole";

export default function Layout() {
  const { id } = useLocalSearchParams();
  useFamilyRole(Number(id));

  return (
    <Stack>
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      <Stack.Screen
        name='edit'
        options={{ ...defaultScreenStyles, headerTitle: "Edytuj rodzinę" }}
      />
      <Stack.Screen
        name='pets/create'
        options={{
          headerShadowVisible: false,
          headerTitleAlign: "center",
          title: "Dodaj zwierzaka",
          headerStyle: { backgroundColor: "#fff" },
        }}
      />
      <Stack.Screen name='pets/[petId]' options={{ headerShown: false }} />
      <Stack.Screen name='members' options={{ headerShown: false }} />
      <Stack.Screen name='invites' options={{ headerShown: false }} />
    </Stack>
  );
}
