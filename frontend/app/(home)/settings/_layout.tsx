import { Stack } from "expo-router";
import { defaultScreenStyles } from "@/constants/Styles";

export default function Layout() {
  return (
    <Stack screenOptions={defaultScreenStyles}>
      <Stack.Screen
        name='index'
        options={{
          title: "Ustawienia",
        }}
      />
      <Stack.Screen
        name='invites'
        options={{
          title: "Zaproszenia",
        }}
      />
    </Stack>
  );
}
