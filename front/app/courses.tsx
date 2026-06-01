import { Button, Card, ErrorMessage, ScreenContainer, TextInput } from "@/components/ui";
import { palette } from "@/constants/theme";
import { useAcademicData } from "@/hooks/use-academic-data";
import { useForm } from "@/hooks/use-form";
import { CourseFormData } from "@/types";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

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
    if (!value.trim()) errors[field] = "Campo obrigatorio.";
  });
  return errors;
};

function MetaRow({
                   icon,
                   label,
                   value,
                 }: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
}) {
  return (
      <View style={styles.metaRow}>
        <View style={styles.metaIcon}>
          <MaterialIcons name={icon} size={15} color={palette.primary} />
        </View>
        <View style={styles.metaText}>
          <Text style={styles.metaLabel}>{label}</Text>
          <Text style={styles.metaValue} numberOfLines={2}>{value}</Text>
        </View>
      </View>
  );
}

export default function CoursesScreen() {
  const router = useRouter();
  const { teachers, courses, addCourse, loadDisciplines, loadingDisciplines } = useAcademicData();
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let mounted = true;
    const hydrateDisciplines = async () => {
      setLoadError("");
      try {
        await loadDisciplines();
      } catch (error) {
        if (!mounted) return;
        setLoadError(error instanceof Error ? error.message : "Falha ao carregar disciplinas.");
      }
    };
    hydrateDisciplines().catch(() => undefined);
    return () => { mounted = false; };
  }, [loadDisciplines]);

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
        {/* ── Hero ── */}
        <View style={styles.hero}>
          <View style={styles.glowOne} />
          <View style={styles.glowTwo} />

          <View style={styles.heroTop}>
            <View style={styles.heroBrand}>
              <MaterialIcons name="menu-book" size={16} color="rgba(255,255,255,0.9)" />
              <Text style={styles.heroBrandText}>Gestão de Disciplinas</Text>
            </View>
          </View>

          <Text style={styles.heroSubtitle}>
            Use os professores já cadastrados para preencher o responsável pela disciplina.
          </Text>
        </View>

        {/* ── Error ── */}
        {loadError ? (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>{loadError}</Text>
            </View>
        ) : null}

        {/* ── Form ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nova Disciplina</Text>
        </View>

        <View style={styles.formCard}>
          <ErrorMessage message={errors.submit ?? ""} visible={!!errors.submit} />

          <TextInput
              label="Nome da disciplina"
              value={values.nome}
              onChangeText={(text) => handleChange("nome", text)}
              error={errors.nome}
              required
          />
          <TextInput
              label="Carga horária"
              keyboardType="numeric"
              value={values.cargaHoraria}
              onChangeText={(text) => handleChange("cargaHoraria", text)}
              error={errors.cargaHoraria}
              required
          />
          <TextInput
              label="Professor responsável"
              value={values.professorResponsavel}
              onChangeText={(text) => handleChange("professorResponsavel", text)}
              error={errors.professorResponsavel}
              placeholder={teachers.map((t) => t.nome).join(", ")}
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
              title={loading ? "Salvando..." : "Cadastrar Disciplina"}
              loading={loading}
              onPress={handleSubmit}
          />
        </View>

        {/* ── List section ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Disciplinas Cadastradas</Text>
          <Text style={styles.resultCount}>{courses.length} no total</Text>
        </View>

        <View style={styles.list}>
          {loadingDisciplines ? (
              <View style={styles.loadingCard}>
                <ActivityIndicator color={palette.primary} />
                <Text style={styles.emptySubtitle}>Carregando disciplinas...</Text>
              </View>
          ) : courses.length === 0 ? (
              <View style={styles.emptyCard}>
                <View style={styles.emptyIconBox}>
                  <MaterialIcons name="menu-book" size={32} color={palette.primary} />
                </View>
                <Text style={styles.emptyTitle}>Nenhuma disciplina cadastrada</Text>
                <Text style={styles.emptySubtitle}>Preencha o formulário acima para adicionar.</Text>
              </View>
          ) : (
              courses.map((course) => (
                  <View key={course.id} style={styles.courseCard}>
                    <View style={styles.cardHeader}>
                      <View style={styles.avatar}>
                        <MaterialIcons name="menu-book" size={20} color={palette.primary} />
                      </View>
                      <View style={styles.headerInfo}>
                        <Text style={styles.courseName}>{course.nome}</Text>
                        <Text style={styles.courseTag}>Semestre {course.semestre}</Text>
                      </View>
                    </View>

                    <View style={styles.metaGrid}>
                      <MetaRow icon="schedule"   label="Carga Horária"        value={`${course.cargaHoraria}h`} />
                      <MetaRow icon="person"     label="Professor Responsável" value={course.professorResponsavel} />
                      <MetaRow icon="school"     label="Curso"                 value={course.curso} />
                    </View>
                  </View>
              ))
          )}
        </View>

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

  // Error
  errorCard: {
    marginBottom: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "rgba(220, 38, 38, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(220, 38, 38, 0.18)",
  },
  errorText: {
    color: "#b91c1c",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },

  // Section header
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: palette.text,
  },
  resultCount: {
    fontSize: 12,
    fontWeight: "600",
    color: palette.textMuted,
  },

  // Form card
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
    marginBottom: 24,
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },

  // List
  list: { gap: 12 },

  loadingCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  // Course card
  courseCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: palette.primary + "18",
    alignItems: "center",
    justifyContent: "center",
  },
  headerInfo: { flex: 1 },
  courseName: {
    fontSize: 15,
    fontWeight: "700",
    color: palette.text,
    marginBottom: 2,
  },
  courseTag: {
    fontSize: 12,
    fontWeight: "600",
    color: palette.primary,
  },

  // Meta rows
  metaGrid: { gap: 8 },
  metaRow: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: palette.background,
    borderRadius: 14,
    padding: 10,
  },
  metaIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: palette.border,
  },
  metaText: { flex: 1, justifyContent: "center" },
  metaLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    color: palette.primary + "90",
    marginBottom: 1,
    textTransform: "uppercase",
  },
  metaValue: {
    fontSize: 13,
    color: palette.text,
    lineHeight: 18,
    fontWeight: "500",
  },

  // Empty
  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 32,
    alignItems: "center",
    gap: 10,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: palette.primary + "12",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: palette.text,
  },
  emptySubtitle: {
    fontSize: 13,
    color: palette.textMuted,
    textAlign: "center",
  },
});