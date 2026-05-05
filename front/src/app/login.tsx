import { Button, Card, ErrorMessage, ScreenContainer, TextInput } from "@/components/ui";
import { palette } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "@/hooks/use-form";
import { LoginCredentials } from "@/types";
import { Redirect } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

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
    <ScreenContainer scrollable={false} contentContainerStyle={styles.content}>
      <View style={styles.brandBlock}>
        <Text style={styles.brandEyebrow}>Sistema academico mobile</Text>
        <Text style={styles.brandTitle}>AppScholar</Text>
        <Text style={styles.brandText}>
          Projeto multiplataforma com autenticacao, cadastros academicos e consulta de boletim.
        </Text>
      </View>

      <Card variant="elevated" style={styles.formCard}>
        <Text style={styles.formTitle}>Entrar</Text>
        <Text style={styles.formSubtitle}>
          Use qualquer email/login e senha para o fluxo mockado desta etapa.
        </Text>

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
  },
  brandEyebrow: {
    color: "#cfe0f2",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontSize: 12,
    marginBottom: 10,
  },
  brandTitle: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 10,
  },
  brandText: {
    color: "#edf3fa",
    lineHeight: 22,
    fontSize: 15,
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
  formSubtitle: {
    color: palette.textMuted,
    lineHeight: 20,
    marginBottom: 16,
  },
});
