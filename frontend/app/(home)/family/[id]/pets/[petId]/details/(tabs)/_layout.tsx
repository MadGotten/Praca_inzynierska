import { useLocalSearchParams, withLayoutContext } from "expo-router";
import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";

const { Navigator } = createMaterialTopTabNavigator();

export const TopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function Layout() {
  const { petId } = useLocalSearchParams();

  return (
    <TopTabs
      screenOptions={{
        lazy: true,
        tabBarScrollEnabled: true,
        tabBarIndicatorStyle: { backgroundColor: "#FFC043" },
        tabBarContentContainerStyle: { backgroundColor: "transparent" },
        tabBarLabelStyle: { fontSize: 14, fontFamily: "Inter-Medium" },
        tabBarItemStyle: { width: 120 },
      }}
    >
      <TopTabs.Screen
        name='index'
        options={{ title: "Wszystkie" }}
        initialParams={{ petId: petId }}
      />
      <TopTabs.Screen
        name='health'
        options={{ title: "Zdrowie" }}
        initialParams={{ petId: petId }}
      />
      <TopTabs.Screen
        name='vaccinations'
        options={{ title: "Szczepienia" }}
        initialParams={{ petId: petId }}
      />
      <TopTabs.Screen
        name='notes'
        options={{ title: "Notatki" }}
        initialParams={{ petId: petId }}
      />

      <TopTabs.Screen
        name='activities'
        options={{ title: "Aktywność" }}
        initialParams={{ petId: petId }}
      />
    </TopTabs>
  );
}
