import { Card, ScreenContainer } from "@/components/ui";
import { palette } from "@/constants/theme";
import { useAcademicData } from "@/hooks/use-academic-data";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const shortcuts = [
  {
    title: "Cadastro de alunos",
    description: "Registre dados pessoais e logradouro do estudante.",
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
      <View style={styles.heroHeader}>
        <View style={styles.userSection}>
          <Text style={styles.userName}>{user?.nome}</Text>
          <MaterialIcons name="account-circle" size={54} color={palette.primary} />
        </View>
        <Pressable style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Sair</Text>
        </Pressable>
      </View>

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
  heroHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
    gap: 16,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: palette.text,
  },
  logoutButton: {
    backgroundColor: palette.accent,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  logoutText: {
    color: palette.text,
    fontWeight: "700",
  },
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