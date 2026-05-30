import { Button, Card, ErrorMessage, ScreenContainer, TextInput } from "@/components/ui";
import { palette } from "@/constants/theme";
import { useAcademicData } from "@/hooks/use-academic-data";
import { useForm } from "@/hooks/use-form";
import { StudentFormData } from "@/types";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const initialValues: StudentFormData = {
  nome: "",
  matricula: "",
  curso: "",
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
  const requiredFields: (keyof StudentFormData)[] = [
    "nome", "matricula", "curso", "telefone", "cep",
    "logradouro", "numero", "bairro", "cidade", "estado",
  ];
  requiredFields.forEach((field) => {
    if (!values[field].trim()) errors[field] = "Campo obrigatorio.";
  });
  return errors;
};

export default function StudentsScreen() {
  const router = useRouter();
  const {
    availableCourses, loadingCourses,
    states, cities, loadingStates, loadingCities,
    addStudent, searchAddressByCep,
    loadStates, loadCitiesByState, loadCourses,
  } = useAcademicData();

  const [feedback, setFeedback] = useState("");
  const [cepLoading, setCepLoading] = useState(false);

  const { values, errors, loading, handleChange, handleSubmit, reset } = useForm(
      initialValues,
      async (formValues) => {
        setFeedback("");
        const result = await addStudent(formValues);
        setFeedback(
            `Aluno cadastrado com sucesso. E-mail: ${result.emailInstitucional}. Senha temporaria: ${result.senhaTemporaria}`,
        );
        reset();
      },
      validate,
  );

  useEffect(() => { loadStates().catch(() => undefined); }, [loadStates]);
  useEffect(() => { loadCourses().catch(() => undefined); }, [loadCourses]);
  useEffect(() => {
    if (values.estado) loadCitiesByState(values.estado).catch(() => undefined);
  }, [loadCitiesByState, values.estado]);

  const handleCepLookup = async () => {
    setCepLoading(true);
    try {
      const address = await searchAddressByCep(values.cep);
      if (!address.logradouro && !address.cidade && !address.estado && !address.bairro) {
        setFeedback("CEP nao localizado. Preencha manualmente.");
        return;
      }
      if (address.logradouro) handleChange("logradouro", address.logradouro);
      if (address.bairro)     handleChange("bairro", address.bairro);
      if (address.cidade)     handleChange("cidade", address.cidade);
      if (address.estado)     handleChange("estado", address.estado);
      setFeedback("Endereco preenchido com sucesso.");
    } finally {
      setCepLoading(false);
    }
  };

  return (
      <ScreenContainer>
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.82}>
            <Text style={styles.backBtnText}>← Voltar</Text>
          </TouchableOpacity>
        </View>

        {/* ── Section tabs style title ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dados Pessoais</Text>
        </View>

        <Card variant="elevated" style={styles.formCard}>
          <ErrorMessage message={feedback} visible={!!feedback} />
          <ErrorMessage message={errors.submit ?? ""} visible={!!errors.submit} />

          <TextInput
              label="Nome Completo"
              placeholder="Ex: João da Silva"
              value={values.nome}
              onChangeText={(text) => handleChange("nome", text)}
              error={errors.nome}
              required
          />
          <TextInput
              label="Matrícula"
              placeholder="Ex: 2024001234"
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
              placeholder={
                loadingCourses
                    ? "Carregando cursos..."
                    : availableCourses.map((c) => c.nome).join(", ") || "Ex: DSM"
              }
              required
          />
          <TextInput
              label="Telefone"
              keyboardType="phone-pad"
              placeholder="(11) 99999-9999"
              value={values.telefone}
              onChangeText={(text) => handleChange("telefone", text)}
              error={errors.telefone}
              required
          />
        </Card>

        {/* ── Endereço section ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Endereço</Text>
        </View>

        <Card variant="elevated" style={styles.formCard}>
          {/* CEP row */}
          <View style={styles.inlineAction}>
            <View style={styles.inlineField}>
              <TextInput
                  label="CEP"
                  keyboardType="numeric"
                  placeholder="00000-000"
                  value={values.cep}
                  onChangeText={(text) => handleChange("cep", text)}
                  error={errors.cep}
                  required
              />
            </View>
            <View style={styles.inlineButton}>
              {cepLoading ? (
                  <ActivityIndicator size="small" color={palette.primary} style={{ paddingVertical: 14 }} />
              ) : (
                  <Button title="Buscar" variant="secondary" onPress={handleCepLookup} />
              )}
            </View>
          </View>

          <TextInput
              label="Logradouro"
              placeholder="Rua, número, complemento"
              value={values.logradouro}
              onChangeText={(text) => handleChange("logradouro", text)}
              error={errors.logradouro}
              required
          />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <TextInput
                  label="Número"
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
              label={`Cidade${loadingCities ? " (carregando...)" : ""}`}
              value={values.cidade}
              onChangeText={(text) => handleChange("cidade", text)}
              error={errors.cidade}
              placeholder={cities.slice(0, 3).join(", ")}
              required
          />
          <TextInput
              label={`Estado${loadingStates ? " (carregando...)" : ""}`}
              value={values.estado}
              onChangeText={(text) => handleChange("estado", text.toUpperCase())}
              error={errors.estado}
              placeholder={states.slice(0, 5).join(", ")}
              required
          />
        </Card>

        {/* ── Submit ── */}
        <View style={styles.submitArea}>
          <Button
              title={loading ? "Salvando..." : "Cadastrar Aluno"}
              loading={loading}
              onPress={handleSubmit}
          />
        </View>

        {/* ── Link to list ── */}
        <TouchableOpacity style={styles.listLink} onPress={() => router.push("/studentsList")} activeOpacity={0.75}>
          <Text style={styles.listLinkText}>Ver alunos cadastrados →</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 16,
    paddingBottom: 4,
    alignItems: "flex-start",
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
  sectionHeader: {
    marginTop: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: palette.text,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  inlineAction: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-end",
  },
  inlineField: { flex: 1 },
  inlineButton: { paddingBottom: 16 },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  submitArea: {
    marginTop: 20,
  },
  listLink: {
    marginTop: 14,
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