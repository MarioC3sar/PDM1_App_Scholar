import { Button, Card, ErrorMessage, ScreenContainer, TextInput } from "@/components/ui";
import { palette } from "@/constants/theme";
import { useAcademicData } from "@/hooks/use-academic-data";
import { useForm } from "@/hooks/use-form";
import { StudentFormData } from "@/types";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const initialValues: StudentFormData = {
  nome: "",
  matricula: "",
  curso: "",
  email: "",
  telefone: "",
  cep: "",
  logradouro: "",
  numero: "",
  bairro: "",
  cidade: "",
  estado: "",
};

const validate = (values: StudentFormData) => {
  const errors: Record<string, string> = {};
  const requiredFields: Array<keyof StudentFormData> = [
    "nome",
    "matricula",
    "curso",
    "email",
    "telefone",
    "cep",
    "logradouro",
    "numero",
    "bairro",
    "cidade",
    "estado",
  ];

  requiredFields.forEach((field) => {
    if (!values[field].trim()) {
      errors[field] = "Campo obrigatorio.";
    }
  });

  return errors;
};

export default function StudentsScreen() {
  const router = useRouter();
  const {
    students,
    states,
    cities,
    loadingStates,
    loadingCities,
    addStudent,
    searchAddressByCep,
    loadStates,
    loadCitiesByState,
  } = useAcademicData();
  const [feedback, setFeedback] = useState("");

  const { values, errors, loading, handleChange, handleSubmit, reset } = useForm(
    initialValues,
    async (formValues) => {
      await addStudent(formValues);
      setFeedback("Aluno cadastrado com sucesso.");
      reset();
    },
    validate,
  );

  useEffect(() => {
    loadStates().catch(() => undefined);
  }, [loadStates]);

  useEffect(() => {
    if (values.estado) {
      loadCitiesByState(values.estado).catch(() => undefined);
    }
  }, [loadCitiesByState, values.estado]);

  const handleCepLookup = async () => {
    const address = await searchAddressByCep(values.cep);

    if (!address.logradouro && !address.cidade && !address.estado && !address.bairro) {
      setFeedback("CEP nao localizado. Preencha manualmente.");
      return;
    }

    if (address.logradouro) {
      handleChange("logradouro", address.logradouro);
    }
    if (address.bairro) {
      handleChange("bairro", address.bairro);
    }
    if (address.cidade) {
      handleChange("cidade", address.cidade);
    }
    if (address.estado) {
      handleChange("estado", address.estado);
    }

    setFeedback("Endereco preenchido com sucesso.");
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Button title="Voltar" variant="secondary" onPress={() => router.back()} />
      </View>

      <Text style={styles.title}>Cadastro de alunos</Text>


      <Card variant="elevated">
        <ErrorMessage message={feedback} visible={!!feedback} />
        <ErrorMessage message={errors.submit ?? ""} visible={!!errors.submit} />

        <TextInput
          label="Nome"
          value={values.nome}
          onChangeText={(text) => handleChange("nome", text)}
          error={errors.nome}
          required
        />
        <TextInput
          label="Matricula"
          value={values.matricula}
          onChangeText={(text) => handleChange("matricula", text)}
          error={errors.matricula}
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
          label="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={values.email}
          onChangeText={(text) => handleChange("email", text)}
          error={errors.email}
          required
        />
        <TextInput
          label="Telefone"
          keyboardType="phone-pad"
          value={values.telefone}
          onChangeText={(text) => handleChange("telefone", text)}
          error={errors.telefone}
          required
        />

        <View style={styles.inlineAction}>
          <View style={styles.inlineField}>
            <TextInput
              label="CEP"
              keyboardType="numeric"
              value={values.cep}
              onChangeText={(text) => handleChange("cep", text)}
              error={errors.cep}
              required
            />
          </View>
          <View style={styles.inlineButton}>
            <Button title="Buscar CEP" variant="secondary" onPress={handleCepLookup} />
          </View>
        </View>

        <TextInput
          label="Logradouro"
          value={values.logradouro}
          onChangeText={(text) => handleChange("logradouro", text)}
          error={errors.logradouro}
          required
        />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <TextInput
              label="Numero"
              value={values.numero}
              onChangeText={(text) => handleChange("numero", text)}
              error={errors.numero}
              required
            />
          </View>
          <View style={{ flex: 2 }}>
            <TextInput
              label="Bairro"
              value={values.bairro}
              onChangeText={(text) => handleChange("bairro", text)}
              error={errors.bairro}
              required
            />
          </View>
        </View>
        <TextInput
          label={`Cidade${loadingCities ? " (carregando IBGE)" : ""}`}
          value={values.cidade}
          onChangeText={(text) => handleChange("cidade", text)}
          error={errors.cidade}
          placeholder={cities.slice(0, 3).join(", ")}
          required
        />
        <TextInput
            label={`Estado${loadingStates ? " (carregando IBGE)" : ""}`}
            value={values.estado}
            onChangeText={(text) => handleChange("estado", text.toUpperCase())}
            error={errors.estado}
            placeholder={states.slice(0, 5).join(", ")}
            required
        />
        <Button
          title={loading ? "Salvando..." : "Salvar aluno"}
          loading={loading}
          onPress={handleSubmit}
        />
      </Card>

      <Text style={styles.sectionTitle}>Alunos cadastrados</Text>

      {students.map((student) => (
        <Card key={student.id}>
          <Text style={styles.itemTitle}>{student.nome}</Text>
          <Text style={styles.itemText}>Matricula: {student.matricula}</Text>
          <Text style={styles.itemText}>Curso: {student.curso}</Text>
          <Text style={styles.itemText}>Email: {student.email}</Text>
          <Text style={styles.itemText}>
            Local: {student.logradouro}, {student.numero} - {student.bairro} - {student.cidade} - {student.estado}
          </Text>
        </Card>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
    marginTop:40,
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
  inlineAction: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-end",
  },
  inlineField: {
    flex: 1,
  },
  inlineButton: {
    paddingBottom: 16,
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