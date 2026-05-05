import { Button, Card, ScreenContainer, TextInput } from "@/components/ui";
import { palette } from "@/constants/theme";
import { useAcademicData } from "@/hooks/use-academic-data";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function GradesScreen() {
  const router = useRouter();
  const { grades } = useAcademicData();
  const [matricula, setMatricula] = useState("");
  const [filteredMatricula, setFilteredMatricula] = useState("");

  useEffect(() => {
    if (!matricula && grades[0]) {
      setMatricula(grades[0].matricula);
      setFilteredMatricula(grades[0].matricula);
    }
  }, [grades, matricula]);

  const filteredGrades = useMemo(
    () =>
      grades.filter((grade) =>
        filteredMatricula ? grade.matricula.includes(filteredMatricula) : true,
      ),
    [filteredMatricula, grades],
  );

  const average = useMemo(() => {
    if (filteredGrades.length === 0) {
      return 0;
    }

    const total = filteredGrades.reduce((sum, grade) => sum + grade.media, 0);
    return total / filteredGrades.length;
  }, [filteredGrades]);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Button title="Voltar" variant="secondary" onPress={() => router.back()} />
      </View>

      <Text style={styles.title}>Visualizacao de boletim</Text>
      <Text style={styles.subtitle}>
        Consulte disciplina, nota 1, nota 2, media e situacao por matricula.
      </Text>

      <Card variant="elevated">
        <TextInput
          label="Matricula"
          value={matricula}
          onChangeText={setMatricula}
          placeholder="Ex: 2024001"
        />
        <Button title="Consultar boletim" onPress={() => setFilteredMatricula(matricula)} />
      </Card>

      {filteredGrades.map((grade) => (
        <Card key={grade.id}>
          <Text style={styles.itemTitle}>{grade.disciplina}</Text>
          <Text style={styles.itemText}>Aluno: {grade.aluno}</Text>
          <Text style={styles.itemText}>Nota 1: {grade.nota1.toFixed(1)}</Text>
          <Text style={styles.itemText}>Nota 2: {grade.nota2.toFixed(1)}</Text>
          <Text style={styles.itemText}>Media: {grade.media.toFixed(1)}</Text>
          <Text
            style={[
              styles.status,
              grade.situacao === "Aprovado"
                ? styles.success
                : grade.situacao === "Reprovado"
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
        <Text style={styles.itemText}>Registros encontrados: {filteredGrades.length}</Text>
        <Text style={styles.itemText}>Media geral: {average.toFixed(2)}</Text>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
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
  itemTitle: {
    color: palette.primary,
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 8,
  },
  itemText: {
    color: palette.textMuted,
    marginBottom: 4,
  },
  status: {
    alignSelf: "flex-start",
    marginTop: 8,
    borderRadius: 999,
    overflow: "hidden",
    paddingHorizontal: 12,
    paddingVertical: 6,
    color: "#ffffff",
    fontWeight: "700",
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
    fontWeight: "700",
    marginBottom: 8,
  },
});
