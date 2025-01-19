import { Stack, useRouter } from "expo-router";
import { HeaderBackButton } from "@react-navigation/elements";
import { defaultScreenStyles } from "@/constants/Styles";

export default function Layout() {
  const router = useRouter();
  return (
    <Stack screenOptions={defaultScreenStyles}>
      <Stack.Screen
        name='index'
        options={{
          headerLeft: () => (
            <HeaderBackButton
              style={{ marginLeft: -4 }}
              onPress={() => router.back()}
            ></HeaderBackButton>
          ),
        }}
      ></Stack.Screen>
      <Stack.Screen
        name='update'
        options={{
          title: "Edytuj",
        }}
      ></Stack.Screen>
    </Stack>
  );
}
