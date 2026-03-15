import {
  Button,
  Card,
  ErrorMessage,
  ScreenContainer,
  TextInput,
} from "@/components/ui";
import { useForm } from "@/hooks/use-form";
import { Course } from "@/types";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function CoursesScreen() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { values, loading, handleChange, handleSubmit } = useForm(
    {
      nome: "",
      cargaHoraria: "",
      professorId: "",
      curso: "",
      semestre: "",
    },
    async (formValues) => {
      setSuccessMessage("");

      if (!formValues.nome.trim()) {
        throw new Error("Nome da disciplina é obrigatório");
      }
      if (!formValues.cargaHoraria) {
        throw new Error("Carga horária é obrigatória");
      }

      const newCourse: Course = {
        id: Math.random().toString(),
        nome: formValues.nome,
        cargaHoraria: parseInt(formValues.cargaHoraria),
        professorId: formValues.professorId,
        curso: formValues.curso,
        semestre: parseInt(formValues.semestre) || 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setCourses([...courses, newCourse]);
      setSuccessMessage("Disciplina cadastrada com sucesso!");
      setIsFormVisible(false);

      Object.keys(formValues).forEach((key) => {
        handleChange(key, "");
      });

      setTimeout(() => setSuccessMessage(""), 3000);
    },
  );

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Button
          title="← Voltar"
          onPress={() => router.back()}
          variant="secondary"
          size="small"
        />
        <Button
          title="Nova Disciplina"
          onPress={() => setIsFormVisible(!isFormVisible)}
          variant="primary"
          size="small"
        />
      </View>

      {successMessage && (
        <View style={styles.successMessage}>
          <ErrorMessage message={successMessage} />
        </View>
      )}

      {isFormVisible && (
        <Card variant="elevated" style={styles.formCard}>
          <TextInput
            label="Nome da Disciplina"
            placeholder="Ex: Desenvolvimento Web"
            value={values.nome}
            onChangeText={(text: string) => handleChange("nome", text)}
            required
          />

          <TextInput
            label="Carga Horária"
            placeholder="Ex: 60"
            value={values.cargaHoraria}
            onChangeText={(text: string) => handleChange("cargaHoraria", text)}
            required
          />

          <TextInput
            label="Professor ID"
            placeholder="ID do professor responsável"
            value={values.professorId}
            onChangeText={(text: string) => handleChange("professorId", text)}
          />

          <TextInput
            label="Curso"
            placeholder="Ex: Engenharia de Software"
            value={values.curso}
            onChangeText={(text: string) => handleChange("curso", text)}
          />

          <TextInput
            label="Semestre"
            placeholder="Ex: 1"
            value={values.semestre}
            onChangeText={(text: string) => handleChange("semestre", text)}
          />

          <Button
            title={loading ? "Salvando..." : "Salvar Disciplina"}
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
        </Card>
      )}

      <FlatList
        scrollEnabled={false}
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card variant="default">
            <View>
              <Text style={styles.courseName}>{item.nome}</Text>
              <Text style={styles.courseInfo}>
                Carga Horária: {item.cargaHoraria}h
              </Text>
              <Text style={styles.courseInfo}>Curso: {item.curso}</Text>
              <Text style={styles.courseInfo}>Semestre: {item.semestre}º</Text>
            </View>
          </Card>
        )}
        ListEmptyComponent={
          !isFormVisible ? (
            <Card>
              <Text style={styles.emptyText}>
                Nenhuma disciplina cadastrada ainda.
              </Text>
            </Card>
          ) : null
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10,
  },
  successMessage: {
    marginBottom: 16,
  },
  formCard: {
    marginBottom: 20,
  },
  submitButton: {
    marginTop: 16,
  },
  courseName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  courseInfo: {
    fontSize: 13,
    color: "#666",
    marginVertical: 4,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});
