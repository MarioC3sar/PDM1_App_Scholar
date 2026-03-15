import { Button, Card, ScreenContainer } from "@/components/ui";
import { Grade } from "@/types";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function GradesScreen() {
  const router = useRouter();
  const [grades, setGrades] = useState<Grade[]>([]);

  // Simular carregamento de boletim
  useEffect(() => {
    // Dados simulados de boletim
    const mockGrades: Grade[] = [
      {
        id: "1",
        studentId: "1",
        studentNome: "João Silva",
        courseId: "1",
        courseNome: "Desenvolvimento Web",
        nota1: 8.5,
        nota2: 9.0,
        media: 8.75,
        situacao: "aprovado",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        studentId: "1",
        studentNome: "João Silva",
        courseId: "2",
        courseNome: "Banco de Dados",
        nota1: 7.0,
        nota2: 7.5,
        media: 7.25,
        situacao: "aprovado",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3",
        studentId: "1",
        studentNome: "João Silva",
        courseId: "3",
        courseNome: "Arquitetura de Software",
        nota1: 6.0,
        nota2: 5.5,
        media: 5.75,
        situacao: "reprovado",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    setGrades(mockGrades);
  }, []);

  const getSituacaoColor = (situacao: string) => {
    switch (situacao) {
      case "aprovado":
        return "#34C759";
      case "reprovado":
        return "#FF3B30";
      default:
        return "#FFA500";
    }
  };

  const getSituacaoText = (situacao: string) => {
    switch (situacao) {
      case "aprovado":
        return "Aprovado";
      case "reprovado":
        return "Reprovado";
      default:
        return "Pendente";
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Button
          title="← Voltar"
          onPress={() => router.back()}
          variant="secondary"
          size="small"
        />
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.title}>Boletim Acadêmico</Text>
        <Text style={styles.subtitle}>Visualize suas notas e situação</Text>
      </View>

      <FlatList
        scrollEnabled={false}
        data={grades}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card variant="elevated" style={styles.gradeCard}>
            <View style={styles.cardHeader}>
              <View style={styles.courseSection}>
                <Text style={styles.courseName}>{item.courseNome}</Text>
              </View>
              <View
                style={[
                  styles.situacaoBadge,
                  { backgroundColor: getSituacaoColor(item.situacao) },
                ]}
              >
                <Text style={styles.situacaoText}>
                  {getSituacaoText(item.situacao)}
                </Text>
              </View>
            </View>

            <View style={styles.gradesRow}>
              <View style={styles.gradeItem}>
                <Text style={styles.gradeLabel}>Nota 1</Text>
                <Text style={styles.gradeValue}>{item.nota1.toFixed(1)}</Text>
              </View>
              <View style={styles.gradeItem}>
                <Text style={styles.gradeLabel}>Nota 2</Text>
                <Text style={styles.gradeValue}>{item.nota2.toFixed(1)}</Text>
              </View>
              <View style={[styles.gradeItem, styles.mediaItem]}>
                <Text style={styles.gradeLabel}>Média</Text>
                <Text style={styles.mediaValue}>{item.media.toFixed(2)}</Text>
              </View>
            </View>
          </Card>
        )}
        ListEmptyComponent={
          <Card>
            <Text style={styles.emptyText}>Nenhuma nota cadastrada ainda.</Text>
          </Card>
        }
      />

      <View style={styles.resumoSection}>
        <Card variant="outlined" style={styles.resumoCard}>
          <Text style={styles.resumoTitle}>Resumo do Semestre</Text>
          <View style={styles.resumoRow}>
            <View style={styles.resumoItem}>
              <Text style={styles.resumoLabel}>Disciplinas</Text>
              <Text style={styles.resumoValue}>{grades.length}</Text>
            </View>
            <View style={styles.resumoItem}>
              <Text style={styles.resumoLabel}>Aprovadas</Text>
              <Text style={[styles.resumoValue, { color: "#34C759" }]}>
                {grades.filter((g) => g.situacao === "aprovado").length}
              </Text>
            </View>
            <View style={styles.resumoItem}>
              <Text style={styles.resumoLabel}>Reprovadas</Text>
              <Text style={[styles.resumoValue, { color: "#FF3B30" }]}>
                {grades.filter((g) => g.situacao === "reprovado").length}
              </Text>
            </View>
          </View>
        </Card>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 20,
  },
  titleSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#999",
  },
  gradeCard: {
    marginVertical: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  courseSection: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  situacaoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  situacaoText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  gradesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  gradeItem: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  gradeLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  gradeValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#007AFF",
  },
  mediaItem: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 8,
    borderRadius: 8,
  },
  mediaValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#34C759",
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  resumoSection: {
    marginTop: 20,
  },
  resumoCard: {
    marginVertical: 0,
  },
  resumoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  resumoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  resumoItem: {
    alignItems: "center",
  },
  resumoLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  resumoValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
});
