import { Button, Card, ScreenContainer, TextInput } from "@/components/ui";
import { palette } from "@/constants/theme";
import api from "@/services/api";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type GradeItem = {
  id: number;
  disciplina: string;
  nota1: number | null;
  nota2: number | null;
  media: number | null;
  faltas: number;
  situacao: string;
  aluno?: string;
};

type MyGradesResponse = {
  aluno: string;
  matricula: string;
  disciplinas: GradeItem[];
};

export default function GradesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [matriculaInput, setMatriculaInput] = useState("");
  const [searchedMatricula, setSearchedMatricula] = useState("");
  const [grades, setGrades] = useState<GradeItem[]>([]);
  const [studentName, setStudentName] = useState("");
  const [studentMatricula, setStudentMatricula] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isStudentView = user?.perfil === "aluno";

  useEffect(() => {
    if (user?.perfil === "professor") {
      router.replace("/gradeEditor");
    }
  }, [router, user?.perfil]);

  useEffect(() => {
    if (!isStudentView) {
      return;
    }

    const loadMyGrades = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get<MyGradesResponse>("/notas/me");
        setGrades(response.data.disciplinas ?? []);
        setStudentName(response.data.aluno);
        setStudentMatricula(response.data.matricula);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Falha ao carregar boletim.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadMyGrades().catch(() => undefined);
  }, [isStudentView]);

  const loadGradesByMatricula = async () => {
    const targetMatricula = matriculaInput.trim();

    if (!targetMatricula) {
      setError("Informe a matrícula para consultar o boletim.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.get<MyGradesResponse>(`/notas/${targetMatricula}`);
      setGrades(response.data.disciplinas ?? []);
      setStudentName(response.data.aluno);
      setStudentMatricula(response.data.matricula);
      setSearchedMatricula(targetMatricula);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Falha ao carregar boletim.",
      );
      setGrades([]);
      setStudentName("");
      setStudentMatricula("");
      setSearchedMatricula("");
    } finally {
      setLoading(false);
    }
  };

  const displayedGrades = useMemo(() => grades, [grades]);

  const average = useMemo(() => {
    if (displayedGrades.length === 0) {
      return 0;
    }

    const total = displayedGrades.reduce((sum, grade) => sum + (grade.media ?? 0), 0);
    return total / displayedGrades.length;
  }, [displayedGrades]);

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <View style={styles.heroHeader}>
          <Button title="Voltar" variant="secondary" onPress={() => router.back()} />
          <View style={styles.heroBadge}>
            <MaterialIcons name="assessment" size={16} color={palette.primary} />
            <Text style={styles.heroBadgeText}>Boletim</Text>
          </View>
        </View>
        <Text style={styles.title}>Visualização de boletim</Text>
        <Text style={styles.subtitle}>
          Consulte disciplina, nota 1, nota 2, média, faltas e situação.
        </Text>
      </View>

      {isStudentView ? (
        <Card variant="elevated">
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={palette.primary} />
              <Text style={styles.itemText}>Carregando seu boletim...</Text>
            </View>
          ) : error ? (
            <Text style={[styles.itemText, styles.dangerText]}>{error}</Text>
          ) : (
            <>
              <View style={styles.summaryTop}>
                <View style={styles.summaryAvatar}>
                  <Text style={styles.summaryAvatarText}>
                    {String(studentName || user?.nome || "?")[0].toUpperCase()}
                  </Text>
                </View>
                <View style={styles.summaryInfo}>
                  <Text style={styles.summaryLabel}>Aluno logado</Text>
                  <Text style={styles.summaryName}>{studentName}</Text>
                  <Text style={styles.summaryMeta}>Matrícula: {studentMatricula}</Text>
                </View>
              </View>

              <View style={styles.metricsRow}>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{displayedGrades.length}</Text>
                  <Text style={styles.metricLabel}>Disciplinas</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{average.toFixed(1)}</Text>
                  <Text style={styles.metricLabel}>Média geral</Text>
                </View>
              </View>
            </>
          )}
        </Card>
      ) : (
        <Card variant="elevated">
          <TextInput
            label="Matrícula"
            value={matriculaInput}
            onChangeText={setMatriculaInput}
            placeholder="Ex: 2024001"
          />
          <Button title="Consultar boletim" onPress={loadGradesByMatricula} />
          {studentName ? (
            <View style={styles.resultBanner}>
              <MaterialIcons name="person" size={18} color={palette.primary} />
              <Text style={styles.resultText}>
                Resultado: {studentName} ({searchedMatricula})
              </Text>
            </View>
          ) : null}
        </Card>
      )}

      {error && !isStudentView ? (
        <Card variant="outlined">
          <Text style={[styles.itemText, styles.dangerText]}>{error}</Text>
        </Card>
      ) : null}

      {loading && !isStudentView ? (
        <Card variant="elevated">
          <View style={styles.loadingRow}>
            <ActivityIndicator color={palette.primary} />
            <Text style={styles.itemText}>Carregando boletim...</Text>
          </View>
        </Card>
      ) : null}

      {displayedGrades.map((grade) => (
        <Card key={grade.id} variant="outlined" style={styles.gradeCard}>
          <View style={styles.gradeHeader}>
            <View style={styles.gradeTitleWrap}>
              <Text style={styles.itemTitle}>{grade.disciplina}</Text>
              {!isStudentView && grade.aluno ? (
                <Text style={styles.itemText}>Aluno: {grade.aluno}</Text>
              ) : null}
            </View>
            <View
              style={[
                styles.statusDot,
                grade.situacao === "APROVADO"
                  ? styles.statusDotApproved
                  : grade.situacao === "REPROVADO"
                    ? styles.statusDotRejected
                    : styles.statusDotOngoing,
              ]}
            />
          </View>

          <View style={styles.gradeGrid}>
            <View style={styles.gradeMetric}>
              <Text style={styles.metricLabel}>Nota 1</Text>
              <Text style={styles.gradeValue}>{formatValue(grade.nota1)}</Text>
            </View>
            <View style={styles.gradeMetric}>
              <Text style={styles.metricLabel}>Nota 2</Text>
              <Text style={styles.gradeValue}>{formatValue(grade.nota2)}</Text>
            </View>
            <View style={styles.gradeMetric}>
              <Text style={styles.metricLabel}>Média</Text>
              <Text style={styles.gradeValue}>{formatValue(grade.media)}</Text>
            </View>
            <View style={styles.gradeMetric}>
              <Text style={styles.metricLabel}>Faltas</Text>
              <Text style={styles.gradeValue}>{grade.faltas}</Text>
            </View>
          </View>

          <Text
            style={[
              styles.status,
              grade.situacao === "APROVADO"
                ? styles.success
                : grade.situacao === "REPROVADO"
                  ? styles.danger
                  : styles.pending,
            ]}
          >
            {grade.situacao}
          </Text>
        </Card>
      ))}

      <Card style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Resumo</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryStatValue}>{displayedGrades.length}</Text>
            <Text style={styles.summaryStatLabel}>Registros</Text>
          </View>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryStatValue}>{average.toFixed(2)}</Text>
            <Text style={styles.summaryStatLabel}>Média geral</Text>
          </View>
        </View>
      </Card>
    </ScreenContainer>
  );
}

const formatValue = (value: number | null) => {
  if (value === null) {
    return "-";
  }

  return value.toFixed(1);
};

const styles = StyleSheet.create({
  hero: {
    backgroundColor: palette.primary,
    borderRadius: 26,
    padding: 18,
    marginBottom: 16,
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 6,
    overflow: "hidden",
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  heroBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  title: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: "#fff",
    marginBottom: 6,
  },
  subtitle: {
    color: "#d8ebff",
    lineHeight: 20,
    marginBottom: 2,
  },
  itemTitle: {
    color: palette.primary,
    fontWeight: "800" as const,
    fontSize: 16,
    marginBottom: 2,
  },
  itemText: {
    color: palette.textMuted,
    marginBottom: 4,
  },
  dangerText: {
    color: palette.danger,
  },
  summaryTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },
  summaryAvatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: palette.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryAvatarText: {
    color: palette.primary,
    fontSize: 20,
    fontWeight: "800",
  },
  summaryInfo: {
    flex: 1,
    gap: 2,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.6,
    color: palette.primary + "90",
  },
  summaryName: {
    fontSize: 16,
    fontWeight: "800",
    color: palette.text,
  },
  summaryMeta: {
    fontSize: 12,
    color: palette.textMuted,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: palette.surfaceAlt,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  metricValue: {
    color: palette.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 2,
  },
  metricLabel: {
    color: palette.textMuted,
    fontSize: 11,
    fontWeight: "600",
  },
  resultBanner: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: palette.primarySoft,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  resultText: {
    color: palette.primary,
    fontSize: 12,
    fontWeight: "700",
    flex: 1,
  },
  gradeCard: {
    backgroundColor: "#fff",
  },
  gradeHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 10,
  },
  gradeTitleWrap: {
    flex: 1,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    marginTop: 4,
  },
  statusDotApproved: {
    backgroundColor: palette.success,
  },
  statusDotRejected: {
    backgroundColor: palette.danger,
  },
  statusDotOngoing: {
    backgroundColor: palette.warning,
  },
  gradeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },
  gradeMetric: {
    minWidth: "45%",
    flexGrow: 1,
    backgroundColor: palette.surfaceAlt,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  gradeValue: {
    color: palette.text,
    fontSize: 16,
    fontWeight: "800",
  },
  status: {
    alignSelf: "flex-start" as const,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    color: "#ffffff",
    fontWeight: "700" as const,
  },
  success: {
    backgroundColor: palette.success,
  },
  danger: {
    backgroundColor: palette.danger,
  },
  pending: {
    backgroundColor: palette.secondary,
  },
  summaryCard: {
    backgroundColor: palette.surfaceAlt,
  },
  summaryTitle: {
    color: palette.text,
    fontWeight: "800" as const,
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 10,
  },
  summaryStat: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  summaryStatValue: {
    color: palette.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 2,
  },
  summaryStatLabel: {
    color: palette.textMuted,
    fontSize: 11,
    fontWeight: "600",
  },
  loadingRow: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 10,
  },
});
