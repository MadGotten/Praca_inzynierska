import { Text, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { defaultStyles } from "@/constants/Styles";

const Welcome = () => {
  return (
    <SafeAreaView style={[defaultStyles.container, { justifyContent: "center", gap: 8 }]}>
      <View style={{ flex: 1, gap: 8, justifyContent: "center" }}>
        <Text
          style={{
            fontSize: 24,
            fontFamily: "Inter-Bold",
            textAlign: "center",
          }}
        >
          Witaj w Pet Family!
        </Text>
        <View style={{ gap: 8 }}>
          <Link href='/verify-email' asChild>
            <TouchableOpacity style={defaultStyles.button}>
              <Text style={defaultStyles.buttonText}>Rejestracja</Text>
            </TouchableOpacity>
          </Link>
          <Link style={defaultStyles.helpText} href='/sign-in'>
            Posiadam już konto <Text style={{ color: "#d86e14" }}>Zaloguj</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Welcome;
