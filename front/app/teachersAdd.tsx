import { Button, ErrorMessage, ScreenContainer, TextInput } from "@/components/ui";
import { palette } from "@/constants/theme";
import { useAcademicData } from "@/hooks/use-academic-data";
import { useForm } from "@/hooks/use-form";
import { TeacherFormData } from "@/types";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const initialValues: TeacherFormData = {
  nome: "",
  titulacao: "",
  area: "",
  tempoDocencia: "",
  email: "",
};

const validate = (values: TeacherFormData) => {
  const errors: Record<string, string> = {};
  Object.entries(values).forEach(([field, value]) => {
    if (!value.trim()) errors[field] = "Campo obrigatorio.";
  });
  return errors;
};

export default function TeachersScreen() {
  const router = useRouter();
  const { addTeacher } = useAcademicData();
  const [feedback, setFeedback] = useState("");

  const { values, errors, loading, handleChange, handleSubmit, reset } = useForm(
      initialValues,
      async (formValues) => {
        setFeedback("");
        const result = await addTeacher(formValues);
        setFeedback(
          `Professor cadastrado com sucesso. E-mail institucional: ${result.emailAccess}. Senha temporária: ${result.temporaryPassword}`,
        );
        reset();
      },
      validate,
  );

  return (
      <ScreenContainer>
        {/* ── Hero ── */}
        <View style={styles.hero}>
          <View style={styles.glowOne} />
          <View style={styles.glowTwo} />

          <View style={styles.heroTop}>
            <View style={styles.heroBrand}>
              <MaterialIcons name="person" size={16} color="rgba(255,255,255,0.9)" />
              <Text style={styles.heroBrandText}>Gestão de Professores</Text>
            </View>
          </View>

          <Text style={styles.heroSubtitle}>
            Preencha os campos de titulação, área de atuação e tempo de docência.
          </Text>
        </View>

        {/* ── Form ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Novo Professor</Text>
        </View>

        <View style={styles.formCard}>
          <View style={[styles.successCard, !!feedback ? styles.successCardVisible : null]}>
            <ErrorMessage message={errors.submit ?? ""} visible={!!errors.submit} />
            {feedback ? (
              <>
                <View style={styles.successHeader}>
                  <MaterialIcons name="check-circle" size={18} color="#166534" />
                  <Text style={styles.successTitle}>Professor cadastrado</Text>
                </View>
                <Text style={styles.successText}>{feedback}</Text>
              </>
            ) : null}
          </View>

          <TextInput
              label="Nome"
              value={values.nome}
              onChangeText={(text) => handleChange("nome", text)}
              error={errors.nome}
              required
          />
          <TextInput
              label="Titulação"
              value={values.titulacao}
              onChangeText={(text) => handleChange("titulacao", text)}
              error={errors.titulacao}
              required
          />
          <TextInput
              label="Área de atuação"
              value={values.area}
              onChangeText={(text) => handleChange("area", text)}
              error={errors.area}
              required
          />
          <TextInput
              label="Tempo de docência"
              value={values.tempoDocencia}
              onChangeText={(text) => handleChange("tempoDocencia", text)}
              error={errors.tempoDocencia}
              required
          />
          <TextInput
              label="Email pessoal"
              autoCapitalize="none"
              keyboardType="email-address"
              value={values.email}
              onChangeText={(text) => handleChange("email", text)}
              error={errors.email}
              required
          />

          <Button
              title={loading ? "Salvando..." : "Cadastrar Professor"}
              loading={loading}
              onPress={handleSubmit}
          />
        </View>

        {/* ── Link to list ── */}
        <TouchableOpacity
            style={styles.listLink}
            onPress={() => router.push("/teachersList")}
            activeOpacity={0.75}
        >
          <Text style={styles.listLinkText}>Ver professores cadastrados →</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  // Hero
  hero: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: palette.primary,
    borderRadius: 28,
    padding: 18,
    marginBottom: 16,
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 6,
  },
  glowOne: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.08)",
    top: -60,
    right: -50,
  },
  glowTwo: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.05)",
    bottom: -40,
    left: -20,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  heroBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  heroBrandText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  backBtn: {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  backBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  heroSubtitle: {
    color: "#d8ebff",
    fontSize: 13,
    lineHeight: 19,
  },

  // Section
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: palette.text,
  },

  // Form card
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
    marginBottom: 16,
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },

  successCard: {
    display: "none",
  },
  successCardVisible: {
    display: "flex",
    marginBottom: 14,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#ECFDF3",
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  successHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  successTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#166534",
  },
  successText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#14532D",
    fontWeight: "500",
  },

  // List link
  listLink: {
    padding: 14,
    backgroundColor: palette.primary + "0D",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: palette.primary + "20",
    alignItems: "center",
  },
  listLinkText: {
    color: palette.primary,
    fontWeight: "700",
    fontSize: 13,
  },
});
