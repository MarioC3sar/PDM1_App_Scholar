import { Button, Card, ScreenContainer, TextInput } from "@/components/ui";
import { palette } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { getApiErrorMessage } from "@/services/api";
import {
  getAllDisciplines,
  getDisciplineGrades,
  ProfessorGradeItem,
  EditableDisciplineSummary,
  getProfessorDisciplines,
  updateStudentGrade,
} from "@/services/grade-service";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type DraftState = {
  nota1: string;
  nota2: string;
  faltas: string;
};

const getDefaultDraft = (grade: ProfessorGradeItem): DraftState => ({
  nota1: grade.nota1 === null ? "" : String(grade.nota1),
  nota2: grade.nota2 === null ? "" : String(grade.nota2),
  faltas: String(grade.faltas ?? 0),
});

const parseOptionalNumber = (value: string): number | undefined => {
  const normalized = value.trim();

  if (!normalized) {
    return undefined;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const GradeEditorScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.perfil === "admin";
  const [disciplines, setDisciplines] = useState<EditableDisciplineSummary[]>([]);
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<number | null>(null);
  const [selectedGrades, setSelectedGrades] = useState<ProfessorGradeItem[]>([]);
  const [search, setSearch] = useState("");
  const [loadingDisciplines, setLoadingDisciplines] = useState(false);
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<Record<number, DraftState>>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadDisciplines = async () => {
      setLoadingDisciplines(true);
      setError("");

      try {
        if (isAdmin) {
          const response = await getAllDisciplines();
          setDisciplines(response);

          if (response.length > 0) {
            setSelectedDisciplineId((current) => current ?? response[0].id);
          }
        } else {
          const response = await getProfessorDisciplines();
          setDisciplines(response.disciplinas);

          if (response.disciplinas.length > 0) {
            setSelectedDisciplineId((current) => current ?? response.disciplinas[0].id);
          }
        }
      } catch (requestError) {
        setError(getApiErrorMessage(requestError, "Falha ao carregar disciplinas."));
      } finally {
        setLoadingDisciplines(false);
      }
    };

    loadDisciplines().catch(() => undefined);
  }, [isAdmin]);

  useEffect(() => {
    if (!selectedDisciplineId) {
      setSelectedGrades([]);
      return;
    }

    const loadGrades = async () => {
      setLoadingGrades(true);
      setError("");
      setSuccess("");
      setEditingId(null);

      try {
        const response = await getDisciplineGrades(selectedDisciplineId);
        setSelectedGrades(response.alunos);
        setDrafts(
          response.alunos.reduce<Record<number, DraftState>>((acc, grade) => {
            acc[grade.id] = getDefaultDraft(grade);
            return acc;
          }, {}),
        );
      } catch (requestError) {
        setError(
          getApiErrorMessage(requestError, "Falha ao carregar notas da disciplina."),
        );
      } finally {
        setLoadingGrades(false);
      }
    };

    loadGrades().catch(() => undefined);
  }, [selectedDisciplineId]);

  useEffect(() => {
    if (!success) return;

    const timeout = setTimeout(() => setSuccess(""), 2500);
    return () => clearTimeout(timeout);
  }, [success]);

  const filteredGrades = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return selectedGrades;
    }

    return selectedGrades.filter((grade) => {
      return (
        grade.aluno.toLowerCase().includes(normalizedSearch) ||
        grade.matricula.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [search, selectedGrades]);

  const selectedDiscipline = useMemo(
    () => disciplines.find((disciplina) => disciplina.id === selectedDisciplineId) ?? null,
    [disciplines, selectedDisciplineId],
  );

  const onSave = async (grade: ProfessorGradeItem) => {
    const draft = drafts[grade.id];

    if (!draft) {
      return;
    }

    const payload = {
      nota1: parseOptionalNumber(draft.nota1),
      nota2: parseOptionalNumber(draft.nota2),
      faltas: parseOptionalNumber(draft.faltas),
    };

    const hasInvalidDraft =
      (draft.nota1.trim() !== "" && payload.nota1 === undefined) ||
      (draft.nota2.trim() !== "" && payload.nota2 === undefined) ||
      (draft.faltas.trim() !== "" && payload.faltas === undefined);

    if (hasInvalidDraft) {
      setError("Valores inválidos. Verifique as notas e faltas informadas.");
      return;
    }

    setSavingId(grade.id);
    setError("");

    try {
      const response = await updateStudentGrade(grade.id, payload);

      setSelectedGrades((current) =>
        current.map((item) =>
          item.id === grade.id
            ? {
                ...item,
                nota1: response.nota.nota1,
                nota2: response.nota.nota2,
                media: response.nota.media,
                faltas: response.nota.faltas,
                situacao: response.nota.situacao,
              }
            : item,
        ),
      );

      setDrafts((current) => ({
        ...current,
        [grade.id]: {
          nota1: response.nota.nota1 === null ? "" : String(response.nota.nota1),
          nota2: response.nota.nota2 === null ? "" : String(response.nota.nota2),
          faltas: String(response.nota.faltas),
        },
      }));
      setEditingId(null);
      setSuccess(`Notas de ${grade.aluno} atualizadas com sucesso.`);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Falha ao salvar alterações."));
    } finally {
      setSavingId(null);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <View style={styles.heroTop}>

          <View style={styles.heroBadge}>
            <MaterialIcons name="edit" size={16} color={palette.background} />
            <Text style={styles.heroBadgeText}>{isAdmin ? "Admin" : "Professor"}</Text>
          </View>
        </View>
        <Text style={styles.title}>Grade de edição</Text>
        <Text style={styles.subtitle}>
          {isAdmin
            ? "Selecione a disciplina e revise as notas de qualquer turma."
            : "Selecione a disciplina, revise as notas e salve no banco."}
        </Text>
      </View>

      {error ? (
        <Card variant="outlined" style={styles.alertCard}>
          <Text style={styles.alertText}>{error}</Text>
        </Card>
      ) : null}

      {success ? (
        <Card variant="outlined" style={[styles.alertCard, styles.successCard]}>
          <Text style={styles.successText}>{success}</Text>
        </Card>
      ) : null}

      <Card variant="elevated">
        <Text style={styles.sectionTitle}>Disciplinas</Text>

        {loadingDisciplines ? (
          <View style={styles.centerRow}>
            <ActivityIndicator color={palette.primary} />
            <Text style={styles.helperText}>Carregando disciplinas...</Text>
          </View>
        ) : disciplines.length === 0 ? (
          <Text style={styles.helperText}>
            {isAdmin
              ? "Nenhuma disciplina cadastrada."
              : "Nenhuma disciplina vinculada ao professor."}
          </Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.disciplineRow}>
              {disciplines.map((discipline) => {
                const isSelected = discipline.id === selectedDisciplineId;

                return (
                  <Pressable
                    key={discipline.id}
                    onPress={() => setSelectedDisciplineId(discipline.id)}
                    style={[
                      styles.disciplineChip,
                      isSelected && styles.disciplineChipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.disciplineChipTitle,
                        isSelected && styles.disciplineChipTitleSelected,
                      ]}
                    >
                      {discipline.nome}
                    </Text>
                    <Text
                      style={[
                        styles.disciplineChipMeta,
                        isSelected && styles.disciplineChipMetaSelected,
                      ]}
                    >
                      {discipline.curso.nome} - {discipline.semestre}o semestre
                    </Text>
                    {isAdmin && discipline.professor ? (
                      <Text
                        style={[
                          styles.disciplineChipMeta,
                          isSelected && styles.disciplineChipMetaSelected,
                        ]}
                      >
                        Professor: {discipline.professor.nome}
                      </Text>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        )}
      </Card>

      {selectedDiscipline ? (
        <Card variant="elevated">
          <Text style={styles.sectionTitle}>{selectedDiscipline.nome}</Text>
          <Text style={styles.helperText}>
            Curso: {selectedDiscipline.curso.nome} | Semestre: {selectedDiscipline.semestre}
          </Text>
          {isAdmin && selectedDiscipline.professor ? (
            <Text style={styles.helperText}>
              Professor: {selectedDiscipline.professor.nome}
            </Text>
          ) : null}
          <TextInput
            label="Buscar aluno"
            value={search}
            onChangeText={setSearch}
            placeholder="Nome ou matrícula"
          />
        </Card>
      ) : null}

      {loadingGrades ? (
        <Card variant="elevated">
          <View style={styles.centerRow}>
            <ActivityIndicator color={palette.primary} />
            <Text style={styles.helperText}>Carregando alunos...</Text>
          </View>
        </Card>
      ) : (
        filteredGrades.map((grade) => {
          const isEditing = editingId === grade.id;
          const draft = drafts[grade.id] ?? getDefaultDraft(grade);

          return (
            <Card key={grade.id} variant="outlined">
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.studentName}>{grade.aluno}</Text>
                  <Text style={styles.helperText}>Matrícula: {grade.matricula}</Text>
                </View>

                <Pressable
                  onPress={() =>
                    setEditingId((current) => (current === grade.id ? null : grade.id))
                  }
                  style={styles.iconButton}
                >
                  <MaterialIcons
                    name={isEditing ? "close" : "edit"}
                    size={20}
                    color={palette.primary}
                  />
                </Pressable>
              </View>

              <View style={styles.gradeGrid}>
                <View style={styles.gradeItem}>
                  <Text style={styles.label}>Nota 1</Text>
                  <Text style={styles.value}>
                    {grade.nota1 === null ? "-" : grade.nota1.toFixed(1)}
                  </Text>
                </View>
                <View style={styles.gradeItem}>
                  <Text style={styles.label}>Nota 2</Text>
                  <Text style={styles.value}>
                    {grade.nota2 === null ? "-" : grade.nota2.toFixed(1)}
                  </Text>
                </View>
                <View style={styles.gradeItem}>
                  <Text style={styles.label}>Média</Text>
                  <Text style={styles.value}>
                    {grade.media === null ? "-" : grade.media.toFixed(1)}
                  </Text>
                </View>
                <View style={styles.gradeItem}>
                  <Text style={styles.label}>Faltas</Text>
                  <Text style={styles.value}>{grade.faltas}</Text>
                </View>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  grade.situacao === "APROVADO"
                    ? styles.statusApproved
                    : grade.situacao === "REPROVADO"
                      ? styles.statusRejected
                      : styles.statusOngoing,
                ]}
              >
                <Text style={styles.statusText}>{grade.situacao}</Text>
              </View>

              {isEditing ? (
                <View style={styles.editBox}>
                  <TextInput
                    label="Nota 1"
                    keyboardType="decimal-pad"
                    value={draft.nota1}
                    onChangeText={(value) =>
                      setDrafts((current) => ({
                        ...current,
                        [grade.id]: { ...(current[grade.id] ?? draft), nota1: value },
                      }))
                    }
                    placeholder="0.0"
                  />
                  <TextInput
                    label="Nota 2"
                    keyboardType="decimal-pad"
                    value={draft.nota2}
                    onChangeText={(value) =>
                      setDrafts((current) => ({
                        ...current,
                        [grade.id]: { ...(current[grade.id] ?? draft), nota2: value },
                      }))
                    }
                    placeholder="0.0"
                  />
                  <TextInput
                    label="Faltas"
                    keyboardType="number-pad"
                    value={draft.faltas}
                    onChangeText={(value) =>
                      setDrafts((current) => ({
                        ...current,
                        [grade.id]: { ...(current[grade.id] ?? draft), faltas: value },
                      }))
                    }
                    placeholder="0"
                  />

                  <View style={styles.actionsRow}>
                    <Button
                      title="Salvar Alterações"
                      onPress={() => onSave(grade)}
                      loading={savingId === grade.id}
                    />
                    <Button
                      title="Cancelar"
                      variant="secondary"
                      onPress={() => {
                        setEditingId(null);
                        setDrafts((current) => ({
                          ...current,
                          [grade.id]: getDefaultDraft(grade),
                        }));
                      }}
                    />
                  </View>
                </View>
              ) : null}
            </Card>
          );
        })
      )}

      {selectedDiscipline && !loadingGrades ? (
        <Card variant="elevated">
          <Text style={styles.sectionTitle}>Resumo</Text>
          <Text style={styles.helperText}>Alunos listados: {filteredGrades.length}</Text>
          <Text style={styles.helperText}>Total na disciplina: {selectedGrades.length}</Text>
        </Card>
      ) : null}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  hero: {
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
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  heroBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 6,
  },
  subtitle: {
    color: "#d8ebff",
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: palette.text,
    marginBottom: 12,
  },
  helperText: {
    color: palette.textMuted,
    lineHeight: 18,
  },
  centerRow: {
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  alertCard: {
    marginBottom: 12,
    borderColor: palette.danger,
  },
  successCard: {
    borderColor: palette.success,
  },
  alertText: {
    color: palette.danger,
    fontWeight: "600",
  },
  successText: {
    color: palette.success,
    fontWeight: "600",
  },
  disciplineRow: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 4,
  },
  disciplineChip: {
    width: 240,
    minWidth: 240,
    maxWidth: 280,
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderRadius: 16,
    backgroundColor: palette.surfaceAlt,
    borderWidth: 1,
    borderColor: palette.border,
    flexShrink: 0,
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 6,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  disciplineChipSelected: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  disciplineChipTitle: {
    fontWeight: "800",
    color: palette.text,
    fontSize: 15,
    lineHeight: 20,
  },
  disciplineChipTitleSelected: {
    color: "#fff",
  },
  disciplineChipMeta: {
    fontSize: 12,
    color: palette.textMuted,
    lineHeight: 16,
  },
  disciplineChipMetaSelected: {
    color: "rgba(255,255,255,0.85)",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.primary + "12",
  },
  studentName: {
    fontWeight: "800",
    color: palette.text,
    fontSize: 16,
    marginBottom: 2,
  },
  gradeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },
  gradeItem: {
    minWidth: "45%",
    flexGrow: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: palette.surfaceAlt,
  },
  label: {
    fontSize: 12,
    color: palette.textMuted,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "800",
    color: palette.text,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12,
  },
  statusApproved: {
    backgroundColor: palette.success,
  },
  statusRejected: {
    backgroundColor: palette.danger,
  },
  statusOngoing: {
    backgroundColor: palette.secondary,
  },
  statusText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 12,
  },
  editBox: {
    gap: 8,
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
});
