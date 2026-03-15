import { useAuth } from "@/hooks/use-auth";
import { useForm } from "@/hooks/use-form";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  Button,
  ErrorMessage,
  ScreenContainer,
  TextInput,
} from "../components/ui";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [generalError, setGeneralError] = useState<string>("");

  // Redirecionar para dashboard quando autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)/dashboard");
    }
  }, [isAuthenticated, router]);

  const { values, errors, loading, handleChange, handleBlur, handleSubmit } =
    useForm({ login: "", password: "" }, async (formValues) => {
      setGeneralError("");
      try {
        await login(formValues as { login: string; password: string });
      } catch (error) {
        if (error instanceof Error) {
          setGeneralError(error.message);
        } else {
          setGeneralError("Erro ao fazer login. Tente novamente.");
        }
      }
    });

  return (
    <ScreenContainer scrollable={false} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>📚</Text>
        </View>
        <Text style={styles.title}>AppScholar</Text>
        <Text style={styles.subtitle}>Sistema de Gerenciamento Acadêmico</Text>
      </View>

      {/* Formulário */}
      <View style={styles.formContainer}>
        <ErrorMessage message={generalError} visible={!!generalError} />

        <TextInput
          label="Login ou Email"
          placeholder="Digite seu login"
          value={values.login}
          onChangeText={(text: string) => handleChange("login", text)}
          onBlur={() => handleBlur("login")}
          error={errors.login}
          required
          editable={!loading}
        />

        <TextInput
          label="Senha"
          placeholder="Digite sua senha"
          value={values.password}
          onChangeText={(text: string) => handleChange("password", text)}
          onBlur={() => handleBlur("password")}
          error={errors.password}
          required
          secureTextEntry
          editable={!loading}
        />

        <Button
          title={loading ? "Entrando..." : "Entrar"}
          onPress={handleSubmit}
          disabled={loading}
          loading={loading}
          style={styles.loginButton}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Versão 1.0.0 • Desenvolvimento de Software Multiplataforma
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoText: {
    fontSize: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  loginButton: {
    marginTop: 20,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  footerText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
});
