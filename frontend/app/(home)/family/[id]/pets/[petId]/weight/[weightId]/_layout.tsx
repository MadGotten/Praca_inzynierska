import { Stack } from "expo-router";
import { defaultScreenStyles } from "@/constants/Styles";

export default function Layout() {
  return (
    <Stack screenOptions={defaultScreenStyles}>
      <Stack.Screen
        name='index'
        options={{
          title: "Waga",
        }}
      ></Stack.Screen>
      <Stack.Screen
        name='edit'
        options={{
          title: "Edytuj",
        }}
      ></Stack.Screen>
    </Stack>
  );
}
