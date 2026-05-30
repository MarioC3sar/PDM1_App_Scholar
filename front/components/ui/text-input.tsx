import React, { forwardRef } from "react";
import {
  TextInput as RNTextInput,
  StyleSheet,
  Text,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  required?: boolean;
}

export const TextInput = forwardRef<RNTextInput, CustomTextInputProps>(
  ({ label, error, containerStyle, required = false, ...props }, ref) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <RNTextInput
        ref={ref}
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor="#999"
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
  },
);

TextInput.displayName = "TextInput";

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#122033",
    marginBottom: 8,
  },
  required: {
    color: "#d64545",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d8e1ee",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 14,
    backgroundColor: "#fff",
    color: "#122033",
  },
  inputError: {
    borderColor: "#d64545",
  },
  errorText: {
    color: "#d64545",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
});
