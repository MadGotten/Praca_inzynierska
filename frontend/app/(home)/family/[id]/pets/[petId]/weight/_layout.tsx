import { defaultScreenStyles } from "@/constants/Styles";
import { Stack, Link, useLocalSearchParams } from "expo-router";
import { TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import useFamilyRole from "@/hooks/useFamilyRole";

export default function Layout() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { role, isLoadingRole } = useFamilyRole(Number(id));
  return (
    <Stack initialRouteName='index'>
      <Stack.Screen
        name='index'
        options={{
          ...defaultScreenStyles,
          title: "Waga",
          headerRight: () =>
            !isLoadingRole &&
            role <= 2 && (
              <Link href={"./create"} relativeToDirectory asChild>
                <TouchableOpacity>
                  <MaterialIcons name='add' size={30} color='black' />
                </TouchableOpacity>
              </Link>
            ),
        }}
      />
      <Stack.Screen name='create' options={{ ...defaultScreenStyles, title: "Dodaj wagę" }} />
      <Stack.Screen name='[weightId]' options={{ headerShown: false }} />
    </Stack>
  );
}
