import { Card, ScreenContainer } from "@/components/ui";
import { palette } from "@/constants/theme";
import { useAcademicData } from "@/hooks/use-academic-data";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const shortcuts = [
  {
    title: "Cadastro de alunos",
    description: "Registre dados pessoais e endereco do estudante.",
    route: "/students",
  },
  {
    title: "Cadastro de professores",
    description: "Mantenha titulacao, area e tempo de docencia.",
    route: "/teachers",
  },
  {
    title: "Cadastro de disciplinas",
    description: "Defina professor responsavel, curso e semestre.",
    route: "/courses",
  },
  {
    title: "Consulta de boletim",
    description: "Acompanhe notas, medias e situacao do aluno.",
    route: "/grades",
  },
];

export default function DashboardScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { students, teachers, courses, grades } = useAcademicData();

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <View>
          <Text style={styles.overline}>Painel academico</Text>
          <Text style={styles.title}>AppScholar</Text>
          <Text style={styles.subtitle}>
            Gerencie alunos, professores, disciplinas e boletins em um unico fluxo.
          </Text>
        </View>

        <Pressable style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Sair</Text>
        </Pressable>
      </View>

      <View style={styles.metricsRow}>
        <Card style={styles.metricCard}>
          <Text style={styles.metricValue}>{students.length}</Text>
          <Text style={styles.metricLabel}>Alunos</Text>
        </Card>
        <Card style={styles.metricCard}>
          <Text style={styles.metricValue}>{teachers.length}</Text>
          <Text style={styles.metricLabel}>Professores</Text>
        </Card>
        <Card style={styles.metricCard}>
          <Text style={styles.metricValue}>{courses.length}</Text>
          <Text style={styles.metricLabel}>Disciplinas</Text>
        </Card>
        <Card style={styles.metricCard}>
          <Text style={styles.metricValue}>{grades.length}</Text>
          <Text style={styles.metricLabel}>Notas</Text>
        </Card>
      </View>

      <Card style={styles.sessionCard}>
        <Text style={styles.sessionTitle}>Usuario conectado</Text>
        <Text style={styles.sessionText}>{user?.nome}</Text>
        <Text style={styles.sessionText}>{user?.email}</Text>
        <Text style={styles.sessionBadge}>{user?.perfil}</Text>
      </Card>

      <Text style={styles.sectionTitle}>Acessos rapidos</Text>

      {shortcuts.map((shortcut) => (
        <Card
          key={shortcut.route}
          variant="elevated"
          style={styles.shortcutCard}
          onPress={() => router.push(shortcut.route as never)}
        >
          <Text style={styles.shortcutTitle}>{shortcut.title}</Text>
          <Text style={styles.shortcutDescription}>{shortcut.description}</Text>
        </Card>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: palette.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    gap: 16,
  },
  overline: {
    color: "#d6e6f7",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: "#eef4fb",
    fontSize: 15,
    lineHeight: 22,
  },
  logoutButton: {
    alignSelf: "flex-start",
    backgroundColor: palette.accent,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  logoutText: {
    color: palette.text,
    fontWeight: "700",
  },
  metricsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    width: "47%",
    borderColor: palette.border,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "700",
    color: palette.primary,
  },
  metricLabel: {
    marginTop: 6,
    color: palette.textMuted,
  },
  sessionCard: {
    backgroundColor: palette.surfaceAlt,
    borderColor: palette.surfaceAlt,
  },
  sessionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: palette.textMuted,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  sessionText: {
    color: palette.text,
    marginBottom: 4,
  },
  sessionBadge: {
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: "#ffffff",
    color: palette.secondary,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontWeight: "700",
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: palette.text,
    marginTop: 20,
    marginBottom: 12,
  },
  shortcutCard: {
    borderColor: palette.border,
  },
  shortcutTitle: {
    color: palette.text,
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 6,
  },
  shortcutDescription: {
    color: palette.textMuted,
    lineHeight: 20,
  },
});
