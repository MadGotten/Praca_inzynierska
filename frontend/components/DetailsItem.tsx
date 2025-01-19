import { Pressable, Text, View } from "react-native";
import { Link } from "expo-router";

const DetailList = ({ item, api, icon }: { item: any; api: any; icon: React.ReactElement }) => {
  return (
    <Link
      href={{
        pathname: api,
        params: { detailId: item.id },
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
        <View style={{ marginTop: 4 }}>{icon}</View>
        <View style={{ gap: 4, flex: 1 }}>
          <View style={{ gap: 1 }}>
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 16 }}>{item.name}</Text>
            <View style={{ flexDirection: "row", gap: 4 }}>
              <Text style={{ fontFamily: "Inter", fontSize: 12 }}>
                {item.date || new Date(item.created_at).toLocaleDateString()}
              </Text>
              {item.place && (
                <>
                  <View style={{ borderLeftWidth: 1 }} />
                  <Text style={{ fontFamily: "Inter", fontSize: 12 }}>{item.place}</Text>
                </>
              )}
            </View>
          </View>
          <View>
            <Text style={{ fontFamily: "Inter", fontSize: 13 }} numberOfLines={2}>
              {item.description || item.duration}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

export default DetailList;
