import { Stack, Redirect } from "expo-router";
import { useTokenStore } from "@/store/tokenStore";

export default function Layout() {
  const { user } = useTokenStore();

  if (!user) {
    return <Redirect href='/(auth)' />;
  }

  return (
    <Stack>
      <Stack.Screen name='family' options={{ headerShown: false }} />
      <Stack.Screen name='settings' options={{ headerShown: false }} />
    </Stack>
  );
}
