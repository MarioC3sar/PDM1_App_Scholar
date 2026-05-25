import { Card, ScreenContainer } from "@/components/ui";
import { palette } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type Role = "aluno" | "professor" | "admin";

const shortcuts: Array<{
  title: string;
  description: string;
  route: string;
  icon: string;
  roles: Role[];
}> = [
  {
    title: "Alunos",
    description: "Consulte dados dos estudantes.",
    route: "/studentsList",
    icon: "🎓",
    roles: ["admin"],
  },
  {
    title: "Professores",
    description: "Mantenha titulacao, area e tempo de docencia.",
    route: "/teachersList",
    icon: "👨‍🏫",
    roles: ["admin"],
  },
  {
    title: "Disciplinas",
    description: "Defina professor responsavel, curso e semestre.",
    route: "/courses",
    icon: "📚",
    roles: ["admin"],
  },
  {
    title: "Boletim",
    description: "Acompanhe notas, medias e situacao do aluno.",
    route: "/grades",
    icon: "📊",
    roles: ["admin", "professor", "aluno"],
  },
];

const ROLE_LABEL: Record<Role, string> = {
  admin: "Administrador",
  professor: "Professor",
  aluno: "Aluno",
};

export default function DashboardScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const visibleShortcuts = shortcuts.filter((s) =>
      user ? s.roles.includes(user.perfil) : false,
  );

  const role: Role = user?.perfil ?? "aluno";
  const initial = String(user?.nome ?? "?")[0].toUpperCase();

  return (
      <ScrollView
          style={styles.root}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerEyebrow}>BEM-VINDO</Text>
            <Text style={styles.headerTitle}>Dashboard</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.82}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>

        {/* ── User card ── */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.nome}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{ROLE_LABEL[role]}</Text>
            </View>
          </View>
          <MaterialIcons name="account-circle" size={36} color={palette.primary + "40"} />
        </View>

        {/* ── Section title ── */}
        <Text style={styles.sectionEyebrow}>MENU</Text>
        <Text style={styles.sectionTitle}>Acessos rápidos</Text>

        {/* ── Shortcut cards ── */}
        <View style={styles.cardList}>
          {visibleShortcuts.map((shortcut) => (
              <Pressable
                  key={shortcut.route}
                  style={({ pressed }) => [styles.shortcutCard, pressed && styles.shortcutCardPressed]}
                  onPress={() => router.push(shortcut.route as never)}
              >
                <View style={styles.shortcutIconBox}>
                  <Text style={styles.shortcutIcon}>{shortcut.icon}</Text>
                </View>
                <View style={styles.shortcutInfo}>
                  <Text style={styles.shortcutTitle}>{shortcut.title}</Text>
                  <Text style={styles.shortcutDescription}>{shortcut.description}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={22} color={palette.primary + "60"} />
              </Pressable>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
  );
}

const RADIUS = 14;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerEyebrow: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    color: palette.primary + "90",
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: palette.primary,
    letterSpacing: -0.5,
  },
  logoutBtn: {
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
  logoutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.3,
  },

  // User card
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: palette.primary + "0D",
    borderRadius: RADIUS,
    borderWidth: 1.5,
    borderColor: palette.primary + "20",
    padding: 16,
    marginBottom: 28,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: palette.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: palette.primary,
  },
  roleBadge: {
    alignSelf: "flex-start",
    backgroundColor: palette.primary + "18",
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  roleText: {
    fontSize: 11,
    fontWeight: "700",
    color: palette.primary,
    letterSpacing: 0.4,
  },

  // Section
  sectionEyebrow: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    color: palette.primary + "90",
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: palette.primary,
    letterSpacing: -0.3,
    marginBottom: 14,
  },

  // Shortcut cards
  cardList: {
    gap: 12,
  },
  shortcutCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#fff",
    borderRadius: RADIUS,
    borderWidth: 1.5,
    borderColor: palette.primary + "15",
    padding: 16,
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  shortcutCardPressed: {
    opacity: 0.75,
    backgroundColor: palette.primary + "08",
  },
  shortcutIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: palette.primary + "12",
    alignItems: "center",
    justifyContent: "center",
  },
  shortcutIcon: {
    fontSize: 20,
  },
  shortcutInfo: {
    flex: 1,
    gap: 3,
  },
  shortcutTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: palette.primary,
  },
  shortcutDescription: {
    fontSize: 12,
    fontWeight: "500",
    color: palette.primary + "80",
    lineHeight: 17,
  },
});