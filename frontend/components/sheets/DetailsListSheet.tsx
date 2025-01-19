import ActionSheet, { ActionSheetRef, SheetProps } from "react-native-actions-sheet";
import { useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link, useGlobalSearchParams } from "expo-router";

const DetailsListSheet = (props: SheetProps<"detailslist-sheet">) => {
  const { id } = useGlobalSearchParams();
  const ref = useRef<ActionSheetRef>(null);

  return (
    <ActionSheet ref={ref} gestureEnabled>
      <View style={{ padding: 24, paddingTop: 8, gap: 8 }}>
        <View>
          <Text
            style={[
              styles.text,
              {
                color: "#a3a3a3",
                fontFamily: "Inter-SemiBold",
                fontSize: 17,
              },
            ]}
          >
            Utwórz Wpis
          </Text>
        </View>
        <Link
          href={{
            pathname: "/family/[id]/pets/[petId]/details/health/create",
            params: { id: Number(id), petId: Number(props.payload?.petId) },
          }}
          onPress={() => ref.current?.hide()}
          asChild
        >
          <TouchableOpacity style={styles.Button}>
            <Text style={styles.text}>Zdrowie</Text>
          </TouchableOpacity>
        </Link>
        <Link
          href={{
            pathname: "/family/[id]/pets/[petId]/details/vaccinations/create",
            params: { id: Number(id), petId: Number(props.payload?.petId) },
          }}
          onPress={() => ref.current?.hide()}
          asChild
        >
          <TouchableOpacity style={styles.Button}>
            <Text style={styles.text}>Szczepienia</Text>
          </TouchableOpacity>
        </Link>
        <Link
          href={{
            pathname: "/family/[id]/pets/[petId]/details/notes/create",
            params: { id: Number(id), petId: Number(props.payload?.petId) },
          }}
          onPress={() => ref.current?.hide()}
          asChild
        >
          <TouchableOpacity style={styles.Button}>
            <Text style={styles.text}>Notatki</Text>
          </TouchableOpacity>
        </Link>
        <Link
          href={{
            pathname: "/family/[id]/pets/[petId]/details/activities/create",
            params: { id: Number(id), petId: Number(props.payload?.petId) },
          }}
          onPress={() => ref.current?.hide()}
          asChild
        >
          <TouchableOpacity style={styles.Button}>
            <Text style={styles.text}>Aktywność</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    textAlign: "center",
  },
  Button: {
    padding: 10,
    borderRadius: 8,
  },
});

export default DetailsListSheet;
