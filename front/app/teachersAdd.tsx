import { Button, Card, ErrorMessage, ScreenContainer, TextInput } from "@/components/ui";
import { palette } from "@/constants/theme";
import { useAcademicData } from "@/hooks/use-academic-data";
import { useForm } from "@/hooks/use-form";
import { TeacherFormData } from "@/types";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
    if (!value.trim()) {
      errors[field] = "Campo obrigatorio.";
    }
  });
  return errors;
};

export default function TeachersScreen() {
  const router = useRouter();
  const { addTeacher } = useAcademicData();

  const { values, errors, loading, handleChange, handleSubmit, reset } = useForm(
      initialValues,
      async (formValues) => {
        await addTeacher(formValues);
        reset();
      },
      validate,
  );

  return (
      <ScreenContainer>
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerEyebrow}>GESTÃO</Text>
            <Text style={styles.headerTitle}>Professores</Text>
          </View>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.82}>
            <Text style={styles.backBtnText}>← Voltar</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          Preencha os campos obrigatorios de titulacao, area de atuacao e tempo de docencia.
        </Text>

        <Card variant="elevated">
          <ErrorMessage message={errors.submit ?? ""} visible={!!errors.submit} />

          <TextInput
              label="Nome"
              value={values.nome}
              onChangeText={(text) => handleChange("nome", text)}
              error={errors.nome}
              required
          />
          <TextInput
              label="Titulacao"
              value={values.titulacao}
              onChangeText={(text) => handleChange("titulacao", text)}
              error={errors.titulacao}
              required
          />
          <TextInput
              label="Area de atuacao"
              value={values.area}
              onChangeText={(text) => handleChange("area", text)}
              error={errors.area}
              required
          />
          <TextInput
              label="Tempo de docencia"
              value={values.tempoDocencia}
              onChangeText={(text) => handleChange("tempoDocencia", text)}
              error={errors.tempoDocencia}
              required
          />
          <TextInput
              label="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={values.email}
              onChangeText={(text) => handleChange("email", text)}
              error={errors.email}
              required
          />

          <Button
              title={loading ? "Salvando..." : "Salvar professor"}
              loading={loading}
              onPress={handleSubmit}
          />
        </Card>

        <Text style={styles.sectionTitle}>Professores cadastrados</Text>

        <Button
            title="Ver Lista"
            loading={loading}
            onPress={() => router.push("/teachersList")}
        />
      </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingBottom: 12,
  },
  headerEyebrow: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    color: palette.primary + "90",
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: palette.primary,
    letterSpacing: -0.5,
  },
  backBtn: {
    backgroundColor: palette.primary,
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 18,
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  backBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 13,
    color: palette.primary + "80",
    fontWeight: "500",
    lineHeight: 20,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: palette.text,
    marginTop: 20,
    marginBottom: 8,
  },
});