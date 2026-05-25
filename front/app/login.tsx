import { Button, Card, ErrorMessage, ScreenContainer, TextInput } from "@/components/ui";
import { palette } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "@/hooks/use-form";
import { LoginCredentials } from "@/types";
import { Redirect } from "expo-router";
import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

const initialValues: LoginCredentials = {
  login: "",
  password: "",
};

const validate = (values: LoginCredentials) => {
  const errors: Record<string, string> = {};

  if (!values.login.trim()) {
    errors.login = "Informe login ou email.";
  }

  if (!values.password.trim()) {
    errors.password = "Informe a senha.";
  }

  return errors;
};

export default function LoginScreen() {
  const { login, isAuthenticated } = useAuth();

  const { values, errors, loading, handleChange, handleSubmit } = useForm(
    initialValues,
    async (formValues) => login(formValues),
    validate,
  );

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}

    >
      <ScreenContainer contentContainerStyle={styles.content}>
        <Image
          source={require("@/assets/images/appscholar.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.brandBlock}>
          <Text style={styles.brandEyebrow}>Sistema academico mobile</Text>
          <Text style={styles.brandText}>
            Projeto multiplataforma com autenticacao, cadastros academicos e consulta de boletim.
          </Text>
        </View>

        <Card variant="elevated" style={styles.formCard}>
          <Text style={styles.formTitle}>Entrar</Text>

          <ErrorMessage message={errors.submit ?? ""} visible={!!errors.submit} />

          <TextInput
            label="Login ou email"
            placeholder="usuario@appscholar.edu"
            autoCapitalize="none"
            value={values.login}
            onChangeText={(text) => handleChange("login", text)}
            error={errors.login}
            required
          />

          <TextInput
            label="Senha"
            placeholder="Digite sua senha"
            secureTextEntry
            value={values.password}
            onChangeText={(text) => handleChange("password", text)}
            error={errors.password}
            required
          />

          <Button
            title={loading ? "Entrando..." : "Acessar painel"}
            loading={loading}
            onPress={handleSubmit}
          />
        </Card>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 24,
  },
  brandBlock: {
    backgroundColor: palette.primary,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
  },
  logo: {
    width: 400,
    height: 200,
    alignSelf: "center",
  },
  brandEyebrow: {
    color: "#cfe0f2",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontSize: 12,
    marginBottom: 10,
  },
  brandText: {
    color: "#edf3fa",
    lineHeight: 22,
    fontSize: 15,
    textAlign: "center",
  },
  formCard: {
    borderColor: palette.border,
    padding: 20,
  },
  formTitle: {
    color: palette.text,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6,
  },
});