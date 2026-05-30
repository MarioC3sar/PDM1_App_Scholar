import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import { Button, Card, ErrorMessage, ScreenContainer, TextInput } from "@/components/ui";
import { palette } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "@/hooks/use-form";
import { changeFirstAccessPassword } from "@/services/auth-service";

interface FirstAccessFormData {
  novaSenha: string;
  confirmarSenha: string;
}

const initialValues: FirstAccessFormData = {
  novaSenha: "",
  confirmarSenha: "",
};

const passwordStrength = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const validate = (values: FirstAccessFormData) => {
  const errors: Record<string, string> = {};

  if (!values.novaSenha.trim()) {
    errors.novaSenha = "Informe a nova senha.";
  } else if (!passwordStrength.test(values.novaSenha)) {
    errors.novaSenha =
      "Use no minimo 8 caracteres com maiuscula, minuscula, numero e simbolo.";
  }

  if (!values.confirmarSenha.trim()) {
    errors.confirmarSenha = "Confirme a nova senha.";
  } else if (values.confirmarSenha !== values.novaSenha) {
    errors.confirmarSenha = "As senhas nao coincidem.";
  }

  return errors;
};

export default function FirstAccessScreen() {
  const router = useRouter();
  const { completeFirstAccess } = useAuth();

  const { values, errors, loading, handleChange, handleSubmit } = useForm(
    initialValues,
    async (formValues) => {
      await changeFirstAccessPassword(formValues.novaSenha);
      completeFirstAccess();
      router.replace("/(tabs)/dashboard");
    },
    validate,
  );

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <MaterialIcons name="lock-reset" size={28} color="#fff" />
        </View>
        <Text style={styles.eyebrow}>SEGURANCA</Text>
        <Text style={styles.title}>Troca de senha obrigatoria</Text>
        <Text style={styles.subtitle}>
          Esta e a primeira entrada na conta. Defina uma nova senha antes de continuar.
        </Text>
      </View>

      <Card variant="elevated" style={styles.card}>
        <ErrorMessage message={errors.submit ?? ""} visible={!!errors.submit} />

        <View style={styles.rulesBanner}>
          <Text style={styles.rulesTitle}>Requisitos da senha</Text>
          <View style={styles.rulesList}>
            <RuleItem text="8 caracteres ou mais" />
            <RuleItem text="Uma letra maiuscula" />
            <RuleItem text="Uma letra minuscula" />
            <RuleItem text="Um numero" />
            <RuleItem text="Um simbolo especial" />
          </View>
        </View>

        <TextInput
          label="Nova senha"
          secureTextEntry
          value={values.novaSenha}
          onChangeText={(text) => handleChange("novaSenha", text)}
          error={errors.novaSenha}
          required
        />

        <TextInput
          label="Confirmar nova senha"
          secureTextEntry
          value={values.confirmarSenha}
          onChangeText={(text) => handleChange("confirmarSenha", text)}
          error={errors.confirmarSenha}
          required
        />

        <Button
          title={loading ? "Alterando..." : "Confirmar nova senha"}
          loading={loading}
          onPress={handleSubmit}
        />
      </Card>
    </ScreenContainer>
  );
}

function RuleItem({ text }: { text: string }) {
  return (
    <View style={styles.ruleItem}>
      <View style={styles.ruleDot} />
      <Text style={styles.ruleText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: "center",
    paddingVertical: 18,
  },
  hero: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 28,
    backgroundColor: palette.primary,
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 16,
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 6,
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#d8ebff",
    marginBottom: 6,
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: "#d8ebff",
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 20,
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  rulesBanner: {
    marginBottom: 16,
    padding: 14,
    borderRadius: 18,
    backgroundColor: palette.primarySoft,
  },
  rulesTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: palette.primary,
    marginBottom: 10,
  },
  rulesList: {
    gap: 8,
  },
  ruleItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ruleDot: {
    width: 7,
    height: 7,
    borderRadius: 99,
    backgroundColor: palette.primary,
  },
  ruleText: {
    color: palette.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
});
