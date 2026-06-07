import {
  Button,
  Card,
  ErrorMessage,
  ScreenContainer,
  TextInput,
} from "@/components/ui";
import { palette } from "@/constants/theme";
import { useAcademicData } from "@/hooks/use-academic-data";
import { useForm } from "@/hooks/use-form";
import { StudentFormData } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput as RNTextInput,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

const initialValues: StudentFormData = {
  nome: "",
  matricula: "",
  semestre: "",
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
  const requiredFields: (keyof StudentFormData)[] = [
    "nome",
    "matricula",
    "semestre",
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
    if (!values[field].trim()) errors[field] = "Campo obrigatorio.";
  });
  return errors;
};

export default function StudentsScreen() {
  const router = useRouter();
  const {
    availableCourses,
    loadingCourses,
    states,
    cities,
    loadingStates,
    loadingCities,
    addStudent,
    searchAddressByCep,
    loadStates,
    loadCitiesByState,
    loadCourses,
  } = useAcademicData();

  const [feedback, setFeedback] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [courseLoadError, setCourseLoadError] = useState("");

  // ── Refs para os TextInputs ──
  const matriculaRef = useRef<RNTextInput>(null);
  const emailRef = useRef<RNTextInput>(null);
  const telefoneRef = useRef<RNTextInput>(null);
  const cepRef = useRef<RNTextInput>(null);
  const logradouroRef = useRef<RNTextInput>(null);
  const numeroRef = useRef<RNTextInput>(null);
  const bairroRef = useRef<RNTextInput>(null);
  const cidadeRef = useRef<RNTextInput>(null);
  const estadoRef = useRef<RNTextInput>(null);

  const { values, errors, loading, handleChange, handleSubmit, reset } =
      useForm(
          initialValues,
          async (formValues) => {
            setFeedback("");
            const result = await addStudent(formValues);
            setFeedback(
                `Aluno cadastrado com sucesso. E-mail institucional: ${result.emailInstitucional}. Senha temporaria: ${result.senhaTemporaria}`,
            );
            reset();
          },
          validate,
      );

  useEffect(() => {
    loadStates().catch(() => undefined);
  }, [loadStates]);
  useEffect(() => {
    let mounted = true;

    const hydrateCourses = async () => {
      setCourseLoadError("");

      try {
        await loadCourses();
      } catch (error) {
        if (!mounted) return;
        setCourseLoadError(
            error instanceof Error ? error.message : "Falha ao carregar cursos.",
        );
      }
    };

    hydrateCourses().catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, [loadCourses]);
  useEffect(() => {
    if (values.estado) loadCitiesByState(values.estado).catch(() => undefined);
  }, [loadCitiesByState, values.estado]);

  const handleCepLookup = async () => {
    // Se o CEP estiver vazio, só pula para o próximo campo
    if (!values.cep) {
      logradouroRef.current?.focus();
      return;
    }

    setCepLoading(true);
    try {
      const address = await searchAddressByCep(values.cep);
      if (
          !address.logradouro &&
          !address.cidade &&
          !address.estado &&
          !address.bairro
      ) {
        setFeedback("CEP não localizado. Preencha manualmente.");
        logradouroRef.current?.focus(); // Vai para Logradouro preencher manual
        return;
      }

      if (address.logradouro) handleChange("logradouro", address.logradouro);
      if (address.bairro) handleChange("bairro", address.bairro);
      if (address.cidade) handleChange("cidade", address.cidade);
      if (address.estado) handleChange("estado", address.estado);

      setFeedback("Endereço preenchido com sucesso.");

      // Se a busca retornou a rua, o foco pula o logradouro e vai direto pro Número
      if (address.logradouro) {
        numeroRef.current?.focus();
      } else {
        // Caso seja um CEP geral (só cidade/estado), foca no Logradouro
        logradouroRef.current?.focus();
      }
    } catch (error) {
      // Se der erro na API, apenas segue para o logradouro
      logradouroRef.current?.focus();
    } finally {
      setCepLoading(false);
    }
  };

  return (
      <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: palette.background }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {/* Usando uma View genérica para envolver caso precise do dismiss,
            mas note que se ScreenContainer tiver um ScrollView, o TouchableWithoutFeedback pode bloquear a rolagem. */}
          <View style={{ flex: 1 }}>
            <ScreenContainer>
              {/* ── Hero ── */}
              <View style={styles.hero}>
                <View style={styles.glowOne} />
                <View style={styles.glowTwo} />

                <View style={styles.heroTop}>
                  <View style={styles.heroBrand}>
                    <MaterialIcons
                        name="school"
                        size={16}
                        color="rgba(255,255,255,0.9)"
                    />
                    <Text style={styles.heroBrandText}>Gestão de Alunos</Text>
                  </View>
                </View>

                <Text style={styles.heroSubtitle}>
                  Preencha os dados pessoais e de endereço para cadastrar um novo aluno.
                </Text>
              </View>

              {/* ── Dados Pessoais ── */}
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
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={() => matriculaRef.current?.focus()}
                    required
                />
                <TextInput
                    ref={matriculaRef}
                    label="Matrícula"
                    placeholder="Ex: 2024001234"
                    value={values.matricula}
                    onChangeText={(text) => handleChange("matricula", text)}
                    error={errors.matricula}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={() => emailRef.current?.focus()}
                    required
                />
                <TextInput
                    ref={emailRef}
                    label="E-mail pessoal"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="exemplo@email.com"
                    value={values.email}
                    onChangeText={(text) => handleChange("email", text)}
                    error={errors.email}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={() => telefoneRef.current?.focus()}
                    required
                />

                <View style={styles.courseListBox}>
                  <Text style={styles.courseLabel}>Curso</Text>
                  {loadingCourses ? (
                      <View style={styles.loadingColunm}>
                        <ActivityIndicator size="small" color={palette.primary} />
                        <Text style={styles.helperText}>Carregando cursos...</Text>
                      </View>
                  ) : courseLoadError ? (
                      <Text style={styles.errorText}>{courseLoadError}</Text>
                  ) : availableCourses.length === 0 ? (
                      <Text style={styles.helperText}>
                        Nenhum curso cadastrado no banco.
                      </Text>
                  ) : (
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.courseRow}>
                          {availableCourses.map((course) => {
                            const isSelected = values.curso === course.nome;

                            return (
                                <Pressable
                                    key={course.id}
                                    onPress={() => handleChange("curso", course.nome)}
                                    style={[
                                      styles.courseChip,
                                      isSelected && styles.courseChipSelected,
                                    ]}
                                >
                                  <Text
                                      style={[
                                        styles.courseChipText,
                                        isSelected && styles.courseChipTextSelected,
                                      ]}
                                  >
                                    {course.nome}
                                  </Text>
                                </Pressable>
                            );
                          })}
                        </View>
                      </ScrollView>
                  )}
                  {errors.curso ? (
                      <Text style={styles.errorText}>{errors.curso}</Text>
                  ) : null}
                  {values.curso ? (
                      <Text style={styles.selectedCourseText}>
                        Selecionado: {values.curso}
                      </Text>
                  ) : null}
                </View>

                <TextInput
                    label="Semestre"
                    keyboardType="numeric"
                    placeholder="Ex: 1"
                    value={values.semestre}
                    onChangeText={(text) => handleChange("semestre", text)}
                    error={errors.semestre}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    required
                />

                <TextInput
                    ref={telefoneRef}
                    label="Telefone"
                    keyboardType="phone-pad"
                    placeholder="(11) 99999-9999"
                    value={values.telefone}
                    onChangeText={(text) => handleChange("telefone", text)}
                    error={errors.telefone}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={() => cepRef.current?.focus()}
                    required
                />
              </Card>

              {/* ── Endereço ── */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Endereço</Text>
              </View>

              <Card variant="elevated" style={styles.formCard}>
                <View style={styles.inlineAction}>
                  <View style={styles.inlineField}>
                    <TextInput
                        ref={cepRef}
                        label="CEP"
                        keyboardType="numeric"
                        placeholder="00000-000"
                        value={values.cep}
                        onChangeText={(text) => handleChange("cep", text)}
                        error={errors.cep}
                        returnKeyType="next"
                        blurOnSubmit={false}
                        // ↓ AQUI ESTÁ A MUDANÇA ↓
                        onSubmitEditing={() => handleCepLookup()}
                        required
                    />
                  </View>
                  <View style={styles.inlineButton}>
                    {cepLoading ? (
                        <ActivityIndicator
                            size="small"
                            color={palette.primary}
                            style={{ paddingVertical: 14 }}
                        />
                    ) : (
                        <Button
                            title="Buscar"
                            variant="secondary"
                            onPress={handleCepLookup}
                        />
                    )}
                  </View>
                </View>

                <TextInput
                    ref={logradouroRef}
                    label="Logradouro"
                    placeholder="Rua, número, complemento"
                    value={values.logradouro}
                    onChangeText={(text) => handleChange("logradouro", text)}
                    error={errors.logradouro}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={() => numeroRef.current?.focus()}
                    required
                />

                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <TextInput
                        ref={numeroRef}
                        label="Número"
                        value={values.numero}
                        onChangeText={(text) => handleChange("numero", text)}
                        error={errors.numero}
                        returnKeyType="next"
                        blurOnSubmit={false}
                        onSubmitEditing={() => bairroRef.current?.focus()}
                        required
                    />
                  </View>
                  <View style={{ flex: 2 }}>
                    <TextInput
                        ref={bairroRef}
                        label="Bairro"
                        value={values.bairro}
                        onChangeText={(text) => handleChange("bairro", text)}
                        error={errors.bairro}
                        returnKeyType="next"
                        blurOnSubmit={false}
                        onSubmitEditing={() => cidadeRef.current?.focus()}
                        required
                    />
                  </View>
                </View>

                <TextInput
                    ref={cidadeRef}
                    label={`Cidade${loadingCities ? " (carregando...)" : ""}`}
                    value={values.cidade}
                    onChangeText={(text) => handleChange("cidade", text)}
                    error={errors.cidade}
                    placeholder={cities.slice(0, 3).join(", ")}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={() => estadoRef.current?.focus()}
                    required
                />

                <TextInput
                    ref={estadoRef}
                    label={`Estado${loadingStates ? " (carregando...)" : ""}`}
                    value={values.estado}
                    onChangeText={(text) => handleChange("estado", text.toUpperCase())}
                    error={errors.estado}
                    placeholder={states.slice(0, 5).join(", ")}
                    returnKeyType="send"
                    onSubmitEditing={handleSubmit}
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
              <TouchableOpacity
                  style={styles.listLink}
                  onPress={() => router.push("/studentsList")}
                  activeOpacity={0.75}
              >
                <Text style={styles.listLinkText}>Ver alunos cadastrados →</Text>
              </TouchableOpacity>

              <View style={{ height: 32 }} />
            </ScreenContainer>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
    marginTop: 25,
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
  courseListBox: {
    marginTop: 10,
    marginBottom: 12,
  },
  courseLabel: {
    color: palette.text,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
  },
  loadingColunm: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  helperText: {
    color: palette.textMuted,
    fontSize: 13,
  },
  courseRow: {
    flexDirection: "column",
    gap: 10,
    paddingVertical: 4,
  },
  courseChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: palette.surfaceAlt,
    borderWidth: 1,
    borderColor: palette.border,
    alignSelf: "flex-start", // ← faz o chip abraçar o texto
  },
  courseChipSelected: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  courseChipText: {
    color: palette.text,
    fontWeight: "700",
  },
  courseChipTextSelected: {
    color: "#fff",
  },
  errorText: {
    color: palette.danger,
    fontSize: 12,
    marginTop: 8,
  },
  selectedCourseText: {
    color: palette.textMuted,
    fontSize: 12,
    marginTop: 8,
  },

  // Section
  sectionHeader: {
    marginTop: 20,
    marginBottom: 8,
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
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },

  // CEP row
  inlineAction: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-end",
  },
  inlineField: { flex: 1 },
  inlineButton: { paddingBottom: 16 },

  // Número + Bairro row
  row: {
    flexDirection: "row",
    gap: 12,
  },

  // Submit
  submitArea: {
    marginTop: 20,
  },

  // List link
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
