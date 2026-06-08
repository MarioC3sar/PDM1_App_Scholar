import React, { useRef, useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput as RNTextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Redirect } from "expo-router";
import { Button, ErrorMessage, TextInput } from "@/components/ui";
import { palette } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "@/hooks/use-form";
import { LoginCredentials } from "@/types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { MaterialIcons } from "@expo/vector-icons";

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

  // Unificamos em um único estado
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
      <SafeAreaView style={styles.root}>
        <KeyboardAwareScrollView
            style={styles.root}
            contentContainerStyle={styles.scrollContent}
            enableOnAndroid
            enableAutomaticScroll
            extraScrollHeight={120}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.screen}>
              {/* Brand hero */}
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

              {/* Form card */}
              <View style={styles.formCard}>
                <ErrorMessage message={errors.submit ?? ""} visible={!!errors.submit} />

                <TextInput
                    label="Email"
                    placeholder="seuemail@fatec.edu.br"
                    autoCapitalize="none"
                    value={values.login}
                    autoCorrect={false}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={() => passwordInputRef.current?.focus()}
                    onChangeText={(text) => handleChange("login", text)}
                    error={errors.login}
                    required
                />

                {/* Container para o input de senha com ícone */}
                <View style={styles.passwordContainer}>
                  <TextInput
                      ref={passwordInputRef}
                      label="Senha"
                      placeholder="••••••••"
                      secureTextEntry={!isPasswordVisible}
                      value={values.password}
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="go"
                      onSubmitEditing={handleSubmit}
                      onChangeText={(text) => handleChange("password", text)}
                      error={errors.password}
                      required
                  />
                  <Pressable
                      onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                      style={styles.eyeIconContainer}
                  >
                    <MaterialIcons
                        name={isPasswordVisible ? "visibility-off" : "visibility"}
                        size={20}
                        color={palette.textMuted}
                    />
                  </Pressable>
                </View>

                <Button
                    title={loading ? "Entrando..." : "Entrar"}
                    loading={loading}
                    onPress={handleSubmit}
                />
              </View>

              <Text style={styles.footer}>
                © {new Date().getFullYear()} McVALves - Todos os direitos reservados
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.primary },
  scrollContent: { flexGrow: 1, backgroundColor: palette.primary },
  screen: { flex: 1, paddingHorizontal: 20, paddingTop: 32, paddingBottom: 28, justifyContent: "center", gap: 18 },
  hero: { alignItems: "center", position: "relative", paddingBottom: 8 },
  glowTopRight: { position: "absolute", width: 180, height: 180, borderRadius: 90, backgroundColor: "rgba(255,255,255,0.08)", top: -80, right: -60 },
  glowBottomLeft: { position: "absolute", width: 120, height: 120, borderRadius: 60, backgroundColor: "rgba(255,255,255,0.05)", bottom: -40, left: -30 },
  logoWrapper: { width: 168, height: 168, borderRadius: 84, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", overflow: "hidden", marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 14, elevation: 6 },
  logo: { width: 320, height: 186 },
  heroSubtitle: { color: "rgba(255,255,255,0.7)", fontSize: 13, textAlign: "center", marginTop: 4, letterSpacing: 0.2 },
  formCard: { backgroundColor: "#fff", borderRadius: 28, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 20, elevation: 8 },
  footer: { textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: "500", letterSpacing: 0.3, paddingTop: 4 },


  passwordContainer: {
    position: 'relative',
    justifyContent: 'center',
    marginBottom: 18,
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 12,
    top: 35,
    zIndex: 10,
    padding: 5,
  },
});