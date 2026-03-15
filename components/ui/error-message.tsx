import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

interface ErrorMessageProps {
  message: string;
  style?: ViewStyle;
  visible?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  style,
  visible = true,
}) => {
  if (!visible || !message) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFE5E5",
    borderLeftWidth: 4,
    borderLeftColor: "#FF3B30",
    padding: 12,
    borderRadius: 4,
    marginVertical: 12,
  },
  text: {
    color: "#FF3B30",
    fontSize: 14,
    fontWeight: "500",
  },
});
