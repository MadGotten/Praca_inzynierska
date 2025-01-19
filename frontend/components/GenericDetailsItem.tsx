import { Pressable, Text, View } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { DetailsItem } from "@/api/petService";

interface GenericDetailItemProps {
  item: DetailsItem;
  api: any;
}

const GenericDetailsItem = ({ item, api }: GenericDetailItemProps) => {
  const { id, petId } = useLocalSearchParams();

  const icon = () => {
    switch (item.detail_type) {
      case "health":
        return <FontAwesome6 name='heart-circle-plus' size={26} color='black' />;
      case "vaccinations":
        return <FontAwesome6 name='syringe' size={24} color='black' />;
      case "activities":
        return <FontAwesome6 name='bone' size={24} color='black' />;
      case "notes":
        return <FontAwesome6 name='note-sticky' size={24} color='black' />;
    }
  };

  return (
    <Link
      href={{
        pathname: api,
        params: { id, petId, detailId: item.id },
      }}
      asChild
    >
      <Pressable
        style={{
          flex: 1,
          padding: 8,
          gap: 12,
          backgroundColor: "#FFC043",
          borderRadius: 12,
          flexDirection: "row",
        }}
      >
        <View style={{ marginTop: 4 }}>{icon()}</View>
        <View style={{ gap: 4 }}>
          <View style={{ gap: 1 }}>
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 16 }}>{item.name}</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

export default GenericDetailsItem;
