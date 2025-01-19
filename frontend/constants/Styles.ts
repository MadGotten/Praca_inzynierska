import { StyleSheet } from "react-native";

interface NavOptions {
  headerShadowVisible?: boolean;
  headerTitleAlign?: "center";
  headerStyle?: {
    backgroundColor: string;
  };
}

interface TabOptions extends NavOptions {
  tabBarLabelStyle: { fontFamily: string };
  tabBarActiveTintColor: string;
}

export const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 8,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#FFC043",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    height: 52,
  },
  buttonSm: {
    backgroundColor: "#FFC043",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    height: 40,
  },
  buttonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 17,
  },
  buttonTextSm: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
  },
  helpText: {
    fontFamily: "Inter",
    fontSize: 14,
    textAlign: "center",
  },
  headerText: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    textAlign: "left",
  },
  subHeaderText: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    textAlign: "left",
  },
  defaultText: {
    fontSize: 16,
    fontFamily: "Inter",
  },
  screenTitle: {
    fontSize: 32,
    fontFamily: "Inter-Bold",
  },
});

export const defaultScreenStyles: NavOptions = {
  headerShadowVisible: false,
  headerTitleAlign: "center",
  headerStyle: { backgroundColor: "#fff" },
};

export const defaultTabStyles: TabOptions = {
  ...defaultScreenStyles,
  tabBarLabelStyle: { fontFamily: "Inter" },
  tabBarActiveTintColor: "black",
};
