import {
  Button,
  Card,
  ErrorMessage,
  ScreenContainer,
  TextInput,
} from "@/components/ui";
import { useForm } from "@/hooks/use-form";
import { Teacher } from "@/types";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function TeachersScreen() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { values, loading, handleChange, handleSubmit } = useForm(
    {
      name: "",
      titulacao: "",
      areaAtuacao: "",
      tempoDocencia: "",
      email: "",
    },
    async (formValues) => {
      setSuccessMessage("");

      if (!formValues.name.trim()) {
        throw new Error("Nome é obrigatório");
      }
      if (!formValues.email.trim()) {
        throw new Error("Email é obrigatório");
      }

      const newTeacher: Teacher = {
        id: Math.random().toString(),
        name: formValues.name,
        titulacao: formValues.titulacao,
        areaAtuacao: formValues.areaAtuacao,
        tempoDocencia: formValues.tempoDocencia,
        email: formValues.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setTeachers([...teachers, newTeacher]);
      setSuccessMessage("Professor cadastrado com sucesso!");
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
          title="Novo Professor"
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
            label="Nome"
            placeholder="Digite o nome do professor"
            value={values.name}
            onChangeText={(text: string) => handleChange("name", text)}
            required
          />

          <TextInput
            label="Titulação"
            placeholder="Ex: Doutor, Mestre"
            value={values.titulacao}
            onChangeText={(text: string) => handleChange("titulacao", text)}
          />

          <TextInput
            label="Área de Atuação"
            placeholder="Ex: Desenvolvimento de Software"
            value={values.areaAtuacao}
            onChangeText={(text: string) => handleChange("areaAtuacao", text)}
          />

          <TextInput
            label="Tempo de Docência"
            placeholder="Ex: 10 anos"
            value={values.tempoDocencia}
            onChangeText={(text: string) => handleChange("tempoDocencia", text)}
          />

          <TextInput
            label="Email"
            placeholder="professor@email.com"
            value={values.email}
            onChangeText={(text: string) => handleChange("email", text)}
            required
          />

          <Button
            title={loading ? "Salvando..." : "Salvar Professor"}
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
        </Card>
      )}

      <FlatList
        scrollEnabled={false}
        data={teachers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card variant="default">
            <View>
              <Text style={styles.teacherName}>{item.name}</Text>
              <Text style={styles.teacherInfo}>
                Titulação: {item.titulacao}
              </Text>
              <Text style={styles.teacherInfo}>Área: {item.areaAtuacao}</Text>
              <Text style={styles.teacherInfo}>
                Tempo: {item.tempoDocencia}
              </Text>
              <Text style={styles.teacherInfo}>Email: {item.email}</Text>
            </View>
          </Card>
        )}
        ListEmptyComponent={
          !isFormVisible ? (
            <Card>
              <Text style={styles.emptyText}>
                Nenhum professor cadastrado ainda.
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
  teacherName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  teacherInfo: {
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
