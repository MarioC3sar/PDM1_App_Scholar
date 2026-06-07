import { palette } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { getDashboardStats } from "@/services/dashboard-service";
import { getDisciplinesFromApi } from "@/services/discipline-service";
import { getStudentsFromApi } from "@/services/student-service";
import { getTeachersFromApi } from "@/services/teacher-service";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type Role = "aluno" | "professor" | "admin";

const modules: {
  title: string;
  description: string;
  route: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  roles: Role[];
}[] = [
  {
    title: "Cadastro de Alunos",
    description: "Gerenciar alunos matriculados",
    route: "/studentsAdd",
    icon: "school",
    roles: ["admin"],
  },
  {
    title: "Cadastro de Professores",
    description: "Gerenciar corpo docente",
    route: "/teachersAdd",
    icon: "person",
    roles: ["admin"],
  },
  {
    title: "Cadastro de Disciplinas",
    description: "Gerenciar grade curricular",
    route: "/courses",
    icon: "menu-book",
    roles: ["admin"],
  },
  {
    title: "Consulta de Boletim",
    description: "Visualizar notas e situação",
    route: "/grades",
    icon: "assessment",
    roles: ["admin", "aluno"],
  },
  {
    title: "Editar Notas",
    description: "Consulte disciplinas e altere notas",
    route: "/gradeEditor",
    icon: "edit",
    roles: ["professor", "admin"],
  },
];

const quickAccess: {
  label: string;
  route: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  roles: Role[];
}[] = [
  { label: "Ver todos os alunos",   route: "/studentsList", icon: "school",     roles: ["admin"] },
  {label: "Ver todos os professores", route: "/teachersList", icon: "person",     roles: ["admin"] },
  { label: "Consultar boletins",    route: "/grades",       icon: "assessment", roles: ["admin", "aluno"] },
  { label: "Adicionar disciplina",  route: "/courses",      icon: "menu-book",  roles: ["admin"] },
  { label: "Editar notas",          route: "/gradeEditor",  icon: "edit",       roles: ["professor", "admin"] },
];

export default function DashboardScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const isAdmin = user?.perfil === "admin";
  const [studentCount, setStudentCount] = useState<number | null>(null);
  const [teacherCount, setTeacherCount] = useState<number | null>(null);
  const [disciplineCount, setDisciplineCount] = useState<number | null>(null);
  const [approvalRate, setApprovalRate] = useState<number | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    if (!isAdmin) {
      setLoadingStats(false);
      return;
    }

    let mounted = true;

    const hydrateStats = async () => {
      setLoadingStats(true);
      setStatsError("");

      try {
        const [students, teachers, disciplines, dashboardStats] = await Promise.all([
          getStudentsFromApi(),
          getTeachersFromApi(),
          getDisciplinesFromApi(),
          getDashboardStats(),
        ]);

        if (!mounted) return;

        setStudentCount(students.length);
        setTeacherCount(teachers.length);
        setDisciplineCount(disciplines.length);
        setApprovalRate(dashboardStats.approvalRate);

      } catch (error) {
        if (!mounted) return;
        setStatsError(
          error instanceof Error ? error.message : "Falha ao carregar indicadores.",
        );
        setStudentCount(0);
        setTeacherCount(0);
        setDisciplineCount(0);
        setApprovalRate(0);
      } finally {
        if (mounted) {
          setLoadingStats(false);
        }
      }
    };

    hydrateStats().catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, [isAdmin]);

  const visibleModules = modules.filter((m) =>
      user ? m.roles.includes(user.perfil) : false,
  );
  const visibleQuick = quickAccess.filter((q) =>
      user ? q.roles.includes(user.perfil) : false,
  );

  const stats = isAdmin
    ? [
        {
          label: "Alunos",
          value: loadingStats ? "..." : studentCount ?? 0,
          icon: "school" as keyof typeof MaterialIcons.glyphMap,
        },
        {
          label: "Professores",
          value: loadingStats ? "..." : teacherCount ?? 0,
          icon: "person" as keyof typeof MaterialIcons.glyphMap,
        },
        {
          label: "Disciplinas",
          value: loadingStats ? "..." : disciplineCount ?? 0,
          icon: "menu-book" as keyof typeof MaterialIcons.glyphMap,
        },
        {
          label: "Aprovação",
          value: loadingStats ? "..." : `${(approvalRate ?? 0).toFixed(0)}%`,
          icon: "trending-up" as keyof typeof MaterialIcons.glyphMap,
        },

      ]
    : [];

  return (
      <ScrollView
          style={styles.root}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
      >
        {/* ── Hero header ── */}
        <View style={styles.hero}>
          <View style={styles.glowOne} />
          <View style={styles.glowTwo} />

          {/* Welcome */}
          <View style={styles.welcomeRow}>
            <View>
              <Text style={styles.welcomeLabel}>Bem-vindo,</Text>
              <Text style={styles.heroUserName}>{user?.nome}</Text>
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.82}>
              <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
          </View>




        </View>

        {statsError ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{statsError}</Text>
          </View>
        ) : null}

        {/* ── Stats card (overlapping hero) ── */}
        {isAdmin && (
          <View style={styles.statsCard}>
            {stats.map((s) => (
                <View key={s.label} style={styles.statItem}>
                  <View style={styles.statIcon}>
                    <MaterialIcons name={s.icon} size={18} color={palette.primary} />
                  </View>
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
            ))}
          </View>
        )}

        {/* ── Modules grid ── */}
        {visibleModules.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Módulos</Text>
              <View style={styles.moduleGrid}>
                {visibleModules.map((mod) => (
                    <Pressable
                        key={mod.route}
                        style={({ pressed }) => [styles.moduleCard, pressed && styles.moduleCardPressed]}
                        onPress={() => router.push(mod.route as never)}
                    >
                      <View style={styles.moduleIconBox}>
                        <MaterialIcons name={mod.icon} size={22} color={palette.primary} />
                      </View>
                      <Text style={styles.moduleTitle}>{mod.title}</Text>
                      <Text style={styles.moduleDescription}>{mod.description}</Text>
                    </Pressable>
                ))}
              </View>
            </>
        )}

        {/* ── Quick access list ── */}
        {visibleQuick.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Acesso Rápido</Text>
              <View style={styles.quickCard}>
                {visibleQuick.map((item, i) => (
                    <Pressable
                        key={item.label}
                        style={({ pressed }) => [
                          styles.quickRow,
                          i < visibleQuick.length - 1 && styles.quickRowBorder,
                          pressed && styles.quickRowPressed,
                        ]}
                        onPress={() => router.push(item.route as never)}
                    >
                      <View style={styles.quickIconBox}>
                        <MaterialIcons name={item.icon} size={15} color={palette.primary} />
                      </View>
                      <Text style={styles.quickLabel}>{item.label}</Text>
                      <MaterialIcons name="chevron-right" size={18} color={palette.primary + "40"} />
                    </Pressable>
                ))}
              </View>
            </>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    paddingBottom: 28,
  },

  // Hero
  hero: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: palette.primary,
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 52,
    marginBottom: -32,
  },
  glowOne: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.08)",
    top: -60,
    right: -50,
  },
  glowTwo: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.05)",
    bottom: -40,
    left: -20,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  brandBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandDot: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  brandText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    fontWeight: "700",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40
  },
  notifBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  notifDot: {
    position: "absolute",
    top: 7,
    right: 7,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#f87171",
    borderWidth: 1.5,
    borderColor: palette.primary,
  },
  welcomeRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  welcomeLabel: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 2,
  },
  heroUserName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  logoutBtn: {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },

  errorCard: {
    marginHorizontal: 18,
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

  // Stats card
  statsCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 18,
    paddingVertical: 18,
    paddingHorizontal: 8,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 6,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 5,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: palette.primary + "12",
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    color: palette.text,
    fontSize: 16,
    fontWeight: "800",
  },
  statLabel: {
    color: palette.textMuted,
    fontSize: 10,
    textAlign: "center",
    lineHeight: 13,
  },

  // Section title
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: palette.background,
    marginBottom: 12,
    paddingHorizontal: 18,
  },

  // Modules grid
  moduleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 18,
    gap: 12,
    marginBottom: 24,
  },
  moduleCard: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  moduleCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  moduleIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: palette.primary + "12",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  moduleTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: palette.text,
    lineHeight: 18,
    marginBottom: 3,
  },
  moduleDescription: {
    fontSize: 11,
    color: palette.textMuted,
    lineHeight: 15,
  },

  // Quick access
  quickCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 18,
    borderWidth: 1,
    borderColor: palette.border,
    overflow: "hidden",
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 8,
  },
  quickRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  quickRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  quickRowPressed: {
    backgroundColor: palette.primary + "08",
  },
  quickIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: palette.primary + "12",
    alignItems: "center",
    justifyContent: "center",
  },
  quickLabel: {
    flex: 1,
    fontSize: 14,
    color: palette.text,
    fontWeight: "500",
  },
});
