import { Stack, Redirect } from "expo-router";
import { useTokenStore } from "@/store/tokenStore";

const Layout = () => {
  const { user } = useTokenStore();

  if (user) {
    return <Redirect href='/(home)/family' />;
  }

  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen
        name='sign-up'
        options={{
          headerShown: true,
          headerShadowVisible: false,
          title: "",
          headerStyle: { backgroundColor: "#fff" },
        }}
      />
      <Stack.Screen
        name='sign-in'
        options={{
          headerShown: true,
          headerShadowVisible: false,
          title: "",
          headerStyle: { backgroundColor: "#fff" },
        }}
      />
      <Stack.Screen
        name='verify-email'
        options={{
          headerShown: true,
          headerShadowVisible: false,
          title: "",
          headerStyle: { backgroundColor: "#fff" },
        }}
      />
    </Stack>
  );
};

export default Layout;
