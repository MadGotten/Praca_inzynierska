import React, { useState } from "react";
import { View, Text, TextInput, TextInputProps, StyleSheet } from "react-native";

interface InputFieldProps extends TextInputProps {
  placeholder?: string;
  value: string;
  error?: string;
  onChangeText?: (text: string) => void;
}

const InputField = ({ placeholder, value, onChangeText, error, ...props }: InputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error ? "red" : isFocused || value ? "#EE964B" : "#ccc";

  return (
    <View>
      <TextInput
        style={[styles.textInput, { borderColor: borderColor }]}
        onChangeText={onChangeText}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={value}
        cursorColor={"#EE964B"}
        selectionColor={"#EE964B"}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    padding: 12,
    fontFamily: "Inter",
    color: "black",
    borderWidth: 2,
    fontSize: 16,
    borderRadius: 12,
  },
  errorText: {
    color: "red",
    marginVertical: 4,
  },
});

export default InputField;
