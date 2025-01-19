import { Stack } from "expo-router";
import { defaultScreenStyles } from "@/constants/Styles";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ ...defaultScreenStyles, headerTitle: "Zaproszenia" }} />
      <Stack.Screen name='invite' options={{ ...defaultScreenStyles, headerTitle: "Zaproś" }} />
    </Stack>
  );
}
