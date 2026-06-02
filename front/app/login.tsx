import React, { useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput as RNTextInput,
  TouchableOpacity,
} from "react-native";
import { Redirect } from "expo-router";
import { Button, ErrorMessage, TextInput } from "@/components/ui";
import { palette } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "@/hooks/use-form";
import { LoginCredentials } from "@/types";

const initialValues: LoginCredentials = {
  login: "",
  password: "",
};

const validate = (values: LoginCredentials) => {
  const errors: Record<string, string> = {};
  if (!values.login.trim())    errors.login    = "Informe login ou email.";
  if (!values.password.trim()) errors.password = "Informe a senha.";
  return errors;
};

export default function LoginScreen() {
  const { login, isAuthenticated, user } = useAuth();
  const passwordInputRef = useRef<RNTextInput>(null);

  const [showPassword, setShowPassword] = useState(false);

  const { values, errors, loading, handleChange, handleSubmit } = useForm(
      initialValues,
      async (formValues) => login(formValues),
      validate,
  );

  if (isAuthenticated) {
    if (user?.perfil !== "admin" && user?.firstAccess) {
      return <Redirect href="/firstAccess" />;
    }
    return <Redirect href="/(tabs)/dashboard" />;
  }

  return (
      <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.root}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.screen}>

            {/* ── Brand hero ── */}
            <View style={styles.hero}>
              <View style={styles.glowTopRight} />
              <View style={styles.glowBottomLeft} />

              <View style={styles.logoWrapper}>
                <Image
                    source={require("@/assets/images/appscholar.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />
              </View>

              <Text style={styles.heroSubtitle}>Sistema de Gestão Acadêmica</Text>
            </View>

            {/* ── Form card ── */}
            <View style={styles.formCard}>

              <ErrorMessage message={errors.submit ?? ""} visible={!!errors.submit} />

              <TextInput
                  label="Email"
                  placeholder="seuemail@fatec.edu.br"
                  autoCapitalize="none"
                  value={values.login}
                  autoCorrect={false}
                  returnKeyType="next"
                  blurOnSubmit={false} // <-- Evita que o teclado feche ao passar para o próximo campo
                  onSubmitEditing={() => passwordInputRef.current?.focus()}
                  onChangeText={(text) => handleChange("login", text)}
                  error={errors.login}
                  required
              />

              <TextInput
                  ref={passwordInputRef}
                  label="Senha"
                  placeholder="••••••••"
                  secureTextEntry={!showPassword}
                  value={values.password}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="go"
                  onSubmitEditing={handleSubmit} // <-- Submete o formulário direto pelo teclado
                  onChangeText={(text) => handleChange("password", text)}
                  error={errors.password}
                  required
              />

              {/* Botão de Mostrar/Ocultar Senha */}
              <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.showPasswordButton}
              >
                <Text style={styles.showPasswordText}>
                  {showPassword ? "Ocultar senha" : "Mostrar senha"}
                </Text>
              </TouchableOpacity>

              <Button
                  title={loading ? "Entrando..." : "Entrar"}
                  loading={loading}
                  onPress={handleSubmit}
              />

            </View>

            {/* ── Footer ── */}
            <Text style={styles.footer}>
              © {new Date().getFullYear()} McVALves — Todos os direitos reservados
            </Text>

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.primary,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    justifyContent: "center",
    gap: 20,
  },

  // Hero
  hero: {
    alignItems: "center",
    position: "relative",
    paddingBottom: 8,
  },
  glowTopRight: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.08)",
    top: -80,
    right: -60,
  },
  glowBottomLeft: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.05)",
    bottom: -40,
    left: -30,
  },
  logoWrapper: {
    width: 180,
    height: 180,
    borderRadius: 100,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 6,
  },
  logo: {
    width: 340,
    height: 196,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.4,
    textAlign: "center",
    lineHeight: 30,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    textAlign: "center",
    marginTop: 4,
    letterSpacing: 0.2,
  },

  // Form card
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: palette.text,
    marginBottom: 20,
  },

  // Demo box
  demoBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: 16,
    backgroundColor: palette.primary + "0F",
  },
  demoText: {
    color: palette.primary,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
  },
  demoStrong: {
    fontWeight: "800",
  },

  // Footer
  footer: {
    textAlign: "center",
    fontSize: 11,
    color: "rgba(255,255,255,0.4)",
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  showPasswordButton: {
    alignSelf: "flex-end", // Alinha à direita
    marginTop: -10,        // Ajuste esse valor dependendo da margem interna do seu componente TextInput
    marginBottom: 20,
  },
  showPasswordText: {
    fontSize: 13,
    color: palette.primary,
    fontWeight: "600",
  },
});