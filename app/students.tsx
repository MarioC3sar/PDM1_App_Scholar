import {
  Button,
  Card,
  ErrorMessage,
  ScreenContainer,
  TextInput,
} from "@/components/ui";
import { useForm } from "@/hooks/use-form";
import { Student } from "@/types";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function StudentsScreen() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { values, loading, handleChange, handleSubmit } = useForm(
    {
      name: "",
      matricula: "",
      course: "",
      email: "",
      telefone: "",
      cep: "",
      endereco: "",
      cidade: "",
      estado: "",
    },
    async (formValues) => {
      setSuccessMessage("");

      // Validações básicas
      if (!formValues.name.trim()) {
        throw new Error("Nome é obrigatório");
      }
      if (!formValues.matricula.trim()) {
        throw new Error("Matrícula é obrigatória");
      }
      if (!formValues.email.trim()) {
        throw new Error("Email é obrigatório");
      }

      // Criar novo aluno
      const newStudent: Student = {
        id: Math.random().toString(),
        name: formValues.name,
        matricula: formValues.matricula,
        course: formValues.course,
        email: formValues.email,
        telefone: formValues.telefone,
        cep: formValues.cep,
        endereco: formValues.endereco,
        cidade: formValues.cidade,
        estado: formValues.estado,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setStudents([...students, newStudent]);
      setSuccessMessage("Aluno cadastrado com sucesso!");
      setIsFormVisible(false);

      // Resetar formulário
      Object.keys(formValues).forEach((key) => {
        handleChange(key, "");
      });

      // Limpar mensagem depois de 3 segundos
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
          title="Novo Aluno"
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
            placeholder="Digite o nome do aluno"
            value={values.name}
            onChangeText={(text: string) => handleChange("name", text)}
            required
          />

          <TextInput
            label="Matrícula"
            placeholder="Ex: 2024001"
            value={values.matricula}
            onChangeText={(text: string) => handleChange("matricula", text)}
            required
          />

          <TextInput
            label="Curso"
            placeholder="Ex: Engenharia de Software"
            value={values.course}
            onChangeText={(text: string) => handleChange("course", text)}
          />

          <TextInput
            label="Email"
            placeholder="aluno@email.com"
            value={values.email}
            onChangeText={(text: string) => handleChange("email", text)}
            required
          />

          <TextInput
            label="Telefone"
            placeholder="(11) 99999-9999"
            value={values.telefone}
            onChangeText={(text: string) => handleChange("telefone", text)}
          />

          <TextInput
            label="CEP"
            placeholder="01234-567"
            value={values.cep}
            onChangeText={(text: string) => handleChange("cep", text)}
          />

          <TextInput
            label="Endereço"
            placeholder="Rua..."
            value={values.endereco}
            onChangeText={(text: string) => handleChange("endereco", text)}
          />

          <TextInput
            label="Cidade"
            placeholder="São Paulo"
            value={values.cidade}
            onChangeText={(text: string) => handleChange("cidade", text)}
          />

          <TextInput
            label="Estado"
            placeholder="SP"
            value={values.estado}
            onChangeText={(text: string) => handleChange("estado", text)}
          />

          <Button
            title={loading ? "Salvando..." : "Salvar Aluno"}
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
        </Card>
      )}

      <FlatList
        scrollEnabled={false}
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card variant="default">
            <View>
              <Text style={styles.studentName}>{item.name}</Text>
              <Text style={styles.studentInfo}>
                Matrícula: {item.matricula}
              </Text>
              <Text style={styles.studentInfo}>Curso: {item.course}</Text>
              <Text style={styles.studentInfo}>Email: {item.email}</Text>
            </View>
          </Card>
        )}
        ListEmptyComponent={
          !isFormVisible ? (
            <Card>
              <Text style={styles.emptyText}>
                Nenhum aluno cadastrado ainda. Clique em Novo Aluno para
                adicionar.
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
  studentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  studentInfo: {
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
