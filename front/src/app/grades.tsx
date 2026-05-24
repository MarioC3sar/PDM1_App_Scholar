import { Button, Card, ScreenContainer, TextInput } from "@/components/ui";
import { palette } from "@/constants/theme";
import { useAcademicData } from "@/hooks/use-academic-data";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function GradesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { grades, updateGrade } = useAcademicData();
  const [matricula, setMatricula] = useState("");
  const [filteredMatricula, setFilteredMatricula] = useState("");
  const [editingGradeId, setEditingGradeId] = useState<string | null>(null);
  const [nota1Draft, setNota1Draft] = useState("");
  const [nota2Draft, setNota2Draft] = useState("");

  const canEditGrades = user?.perfil === "professor" || user?.perfil === "admin";
  const isStudentView = user?.perfil === "aluno";

  useEffect(() => {
    if (isStudentView && user?.matricula) {
      setMatricula(user.matricula);
      setFilteredMatricula(user.matricula);
      return;
    }

    if (!matricula && grades[0]) {
      setMatricula(grades[0].matricula);
      setFilteredMatricula(grades[0].matricula);
    }
  }, [grades, isStudentView, matricula, user?.matricula]);

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
          editable={!isStudentView}
        />
        <Button
          title="Consultar boletim"
          onPress={() => setFilteredMatricula(matricula)}
          disabled={isStudentView}
        />
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

          {canEditGrades ? (
            <View style={styles.editSection}>
              {editingGradeId === grade.id ? (
                <>
                  <TextInput
                    label="Nota 1"
                    value={nota1Draft}
                    onChangeText={setNota1Draft}
                    keyboardType="numeric"
                    placeholder={String(grade.nota1)}
                  />
                  <TextInput
                    label="Nota 2"
                    value={nota2Draft}
                    onChangeText={setNota2Draft}
                    keyboardType="numeric"
                    placeholder={String(grade.nota2)}
                  />
                  <View style={styles.editActions}>
                    <Button
                      title="Salvar"
                      onPress={async () => {
                        const nextNota1 = Number(nota1Draft);
                        const nextNota2 = Number(nota2Draft);
                        await updateGrade(grade.id, { nota1: nextNota1, nota2: nextNota2 });
                        setEditingGradeId(null);
                        setNota1Draft("");
                        setNota2Draft("");
                      }}
                    />
                    <Button
                      title="Cancelar"
                      variant="secondary"
                      onPress={() => {
                        setEditingGradeId(null);
                        setNota1Draft("");
                        setNota2Draft("");
                      }}
                    />
                  </View>
                </>
              ) : (
                <Button
                  title="Alterar notas"
                  variant="secondary"
                  onPress={() => {
                    setEditingGradeId(grade.id);
                    setNota1Draft(String(grade.nota1));
                    setNota2Draft(String(grade.nota2));
                  }}
                />
              )}
            </View>
          ) : null}
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
  editSection: {
    marginTop: 12,
    gap: 10,
  },
  editActions: {
    flexDirection: "row",
    gap: 10,
  },
});
