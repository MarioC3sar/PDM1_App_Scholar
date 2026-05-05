import { Button, Card, ErrorMessage, ScreenContainer, TextInput } from "@/components/ui";
import { palette } from "@/constants/theme";
import { useAcademicData } from "@/hooks/use-academic-data";
import { useForm } from "@/hooks/use-form";
import { TeacherFormData } from "@/types";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

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
  const { teachers, addTeacher } = useAcademicData();

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
      <View style={styles.header}>
        <Button title="Voltar" variant="secondary" onPress={() => router.back()} />
      </View>

      <Text style={styles.title}>Cadastro de professores</Text>
      <Text style={styles.subtitle}>
        Campos obrigatorios para titulacao, area de atuacao e tempo de docencia.
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

      {teachers.map((teacher) => (
        <Card key={teacher.id}>
          <Text style={styles.itemTitle}>{teacher.nome}</Text>
          <Text style={styles.itemText}>Titulacao: {teacher.titulacao}</Text>
          <Text style={styles.itemText}>Area: {teacher.area}</Text>
          <Text style={styles.itemText}>Tempo: {teacher.tempoDocencia}</Text>
          <Text style={styles.itemText}>Email: {teacher.email}</Text>
        </Card>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: palette.text,
    marginBottom: 6,
  },
  subtitle: {
    color: palette.textMuted,
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
  itemTitle: {
    color: palette.primary,
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 6,
  },
  itemText: {
    color: palette.textMuted,
    marginBottom: 4,
  },
});
