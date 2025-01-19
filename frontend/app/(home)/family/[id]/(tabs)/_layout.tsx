import { Tabs, useLocalSearchParams } from "expo-router";
import { TouchableOpacity } from "react-native";
import FamilyService from "@/api/familyService";
import { useQuery } from "@tanstack/react-query";
import { SheetManager } from "react-native-actions-sheet";
import { defaultTabStyles } from "@/constants/Styles";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function Layout() {
  const { id, name } = useLocalSearchParams();
  const { data: family } = useQuery({
    queryKey: ["families", id],
    queryFn: () => FamilyService.get(Number(id)),
  });

  const truncateTitle = (title: string) => {
    if (title.length > 20) {
      return title.substring(0, 20) + "...";
    }
    return title;
  };

  const title = family?.name ? truncateTitle(family.name) : truncateTitle(name.toString());

  return (
    <Tabs
      screenOptions={{
        ...defaultTabStyles,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          tabBarLabel: "Rodzina",
          title: title,
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                SheetManager.show("family-sheet", { payload: { familyId: Number(id) } })
              }
              style={{ marginRight: 24 }}
            >
              <MaterialCommunityIcons name='dots-vertical' size={26} color='black' />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color }) => <MaterialIcons name='home' size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name='pets'
        options={{
          tabBarLabel: "Zwierzęta",
          title: title,
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                SheetManager.show("petslist-sheet", { payload: { familyId: Number(id) } })
              }
              style={{ marginRight: 24 }}
            >
              <MaterialCommunityIcons name='dots-vertical' size={26} color='black' />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color }) => <MaterialIcons name='pets' size={24} color={color} />,
        }}
        initialParams={{ id: id }}
      />
      <Tabs.Screen
        name='members'
        options={{
          tabBarLabel: "Członkowie",
          title: title,
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                SheetManager.show("memberslist-sheet", { payload: { familyId: Number(id) } })
              }
              style={{ marginRight: 24 }}
            >
              <MaterialCommunityIcons name='dots-vertical' size={26} color='black' />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color }) => <FontAwesome6 name='user-large' size={20} color={color} />,
        }}
        initialParams={{ id: id }}
      />
    </Tabs>
  );
}
