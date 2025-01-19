import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { logoutUser } from "@/api/userService";
import { defaultStyles } from "@/constants/Styles";
import { Link } from "expo-router";
import Button from "@/components/ui/Button";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const Settings = () => {
  return (
    <View style={[defaultStyles.container]}>
      <View style={{ gap: 8 }}>
        <Link href={"settings/invites"} asChild>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Twoje zaproszenia</Text>
            <FontAwesome name='angle-right' size={24} color='black' />
          </TouchableOpacity>
        </Link>
      </View>
      <View style={styles.buttonBottom}>
        <Button onPress={logoutUser} color='red' textColor='white'>
          Wyloguj
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  link: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  linkText: {
    fontSize: 17,
    fontFamily: "Inter-Medium",
  },
  buttonBottom: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 24,
  },
});

export default Settings;
