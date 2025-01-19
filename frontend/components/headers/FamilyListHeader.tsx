import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const FamilyListHeader = () => {
  const router = useRouter();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
      <TouchableOpacity onPress={() => router.push("/family/create")}>
        <MaterialIcons name='add' size={30} color='black' />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/settings")}>
        <MaterialCommunityIcons name='dots-vertical' size={26} color='black' />
      </TouchableOpacity>
    </View>
  );
};

export default FamilyListHeader;
