import { Button, Card, ErrorMessage, ScreenContainer, TextInput } from "@/components/ui";
import { palette } from "@/constants/theme";
import { useAcademicData } from "@/hooks/use-academic-data";
import { useForm } from "@/hooks/use-form";
import { CourseFormData } from "@/types";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const initialValues: CourseFormData = {
  nome: "",
  cargaHoraria: "",
  professorResponsavel: "",
  curso: "",
  semestre: "",
};

const validate = (values: CourseFormData) => {
  const errors: Record<string, string> = {};

  Object.entries(values).forEach(([field, value]) => {
    if (!value.trim()) {
      errors[field] = "Campo obrigatorio.";
    }
  });

  return errors;
};

export default function CoursesScreen() {
  const router = useRouter();
  const { teachers, courses, addCourse } = useAcademicData();

  const { values, errors, loading, handleChange, handleSubmit, reset } = useForm(
    initialValues,
    async (formValues) => {
      await addCourse(formValues);
      reset();
    },
    validate,
  );

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Button title="Voltar" variant="secondary" onPress={() => router.back()} />
      </View>

      <Text style={styles.title}>Cadastro de disciplinas</Text>
      <Text style={styles.subtitle}>
        Use os professores ja cadastrados para preencher o responsavel.
      </Text>

      <Card variant="elevated">
        <ErrorMessage message={errors.submit ?? ""} visible={!!errors.submit} />

        <TextInput
          label="Nome da disciplina"
          value={values.nome}
          onChangeText={(text) => handleChange("nome", text)}
          error={errors.nome}
          required
        />
        <TextInput
          label="Carga horaria"
          keyboardType="numeric"
          value={values.cargaHoraria}
          onChangeText={(text) => handleChange("cargaHoraria", text)}
          error={errors.cargaHoraria}
          required
        />
        <TextInput
          label="Professor responsavel"
          value={values.professorResponsavel}
          onChangeText={(text) => handleChange("professorResponsavel", text)}
          error={errors.professorResponsavel}
          placeholder={teachers.map((teacher) => teacher.nome).join(", ")}
          required
        />
        <TextInput
          label="Curso"
          value={values.curso}
          onChangeText={(text) => handleChange("curso", text)}
          error={errors.curso}
          required
        />
        <TextInput
          label="Semestre"
          keyboardType="numeric"
          value={values.semestre}
          onChangeText={(text) => handleChange("semestre", text)}
          error={errors.semestre}
          required
        />

        <Button
          title={loading ? "Salvando..." : "Salvar disciplina"}
          loading={loading}
          onPress={handleSubmit}
        />
      </Card>

      <Text style={styles.sectionTitle}>Disciplinas cadastradas</Text>

      {courses.map((course) => (
        <Card key={course.id}>
          <Text style={styles.itemTitle}>{course.nome}</Text>
          <Text style={styles.itemText}>Carga horaria: {course.cargaHoraria}h</Text>
          <Text style={styles.itemText}>
            Professor responsavel: {course.professorResponsavel}
          </Text>
          <Text style={styles.itemText}>Curso: {course.curso}</Text>
          <Text style={styles.itemText}>Semestre: {course.semestre}</Text>
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
