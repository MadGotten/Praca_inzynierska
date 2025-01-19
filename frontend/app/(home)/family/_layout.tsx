import { Stack } from "expo-router";
import FamilyListHeader from "@/components/headers/FamilyListHeader";
import { defaultScreenStyles } from "@/constants/Styles";

export default function Layout() {
  return (
    <Stack screenOptions={defaultScreenStyles}>
      <Stack.Screen
        name='index'
        options={{
          headerBackVisible: false,
          title: "Rodziny",
          headerRight: () => <FamilyListHeader />,
        }}
      />
      <Stack.Screen
        name='create'
        options={{
          title: "Utwórz rodzinę",
        }}
      />
      <Stack.Screen name='[id]' options={{ headerShown: false }} />
    </Stack>
  );
}
