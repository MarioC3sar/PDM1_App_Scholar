import React, { useMemo, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Card, ScreenContainer } from "@/components/ui";
import { palette } from "@/constants/theme";
import { useAcademicData } from "@/hooks/use-academic-data";

type FilterKey = "nome" | "curso" | "matricula" | "cidade" | "bairro" | "email";

const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: "nome",      label: "Nome" },
  { key: "curso",     label: "Curso" },
  { key: "matricula", label: "Matrícula" },
  { key: "cidade",    label: "Cidade" },
  { key: "bairro",    label: "Bairro" },
  { key: "email",     label: "E-mail" },
];

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

export default function StudentsList() {
  const router = useRouter();
  const { students } = useAcademicData();

  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("nome");

  const filtered = useMemo(() => {
    if (!query.trim()) return students;
    const q = query.toLowerCase().trim();
    return students.filter((s) =>
        String(s[activeFilter] ?? "").toLowerCase().includes(q),
    );
  }, [students, query, activeFilter]);

  return (
      <ScreenContainer>
        {/* ── Hero ── */}
        <View style={styles.hero}>
          <View style={styles.glowOne} />
          <View style={styles.glowTwo} />

          <View style={styles.heroTop}>
            <View style={styles.heroBrand}>
              <MaterialIcons name="group" size={16} color="rgba(255,255,255,0.9)" />
              <Text style={styles.heroBrandText}>Gestão de Alunos</Text>
            </View>
            <Pressable
                style={({ pressed }) => [styles.registerBtn, pressed && { opacity: 0.8 }]}
                onPress={() => router.push("/studentsAdd")}
            >
              <Text style={styles.registerBtnText}>+ Cadastrar</Text>
            </Pressable>
          </View>

          <Text style={styles.heroTitle}>Alunos</Text>
          <Text style={styles.heroSubtitle}>
            Filtre por nome, matrícula, curso ou endereço e encontre registros rapidamente.
          </Text>
        </View>

        {/* ── Search card ── */}
        <View style={styles.searchCard}>
          <Text style={styles.searchLabel}>
            Buscar por {FILTER_OPTIONS.find((f) => f.key === activeFilter)?.label}
          </Text>

          <View style={styles.searchBox}>
            <MaterialIcons name="search" size={18} color={palette.textMuted} />
            <TextInput
                style={styles.searchInput}
                placeholder="Digite para pesquisar..."
                placeholderTextColor={palette.textMuted}
                value={query}
                onChangeText={setQuery}
                autoCorrect={false}
                autoCapitalize="none"
            />
            {query.length > 0 && (
                <Pressable onPress={() => setQuery("")}>
                  <MaterialIcons name="close" size={18} color={palette.textMuted} />
                </Pressable>
            )}
          </View>

          <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipsScroll}
              contentContainerStyle={styles.chipsRow}
          >
            {FILTER_OPTIONS.map((opt) => {
              const active = activeFilter === opt.key;
              return (
                  <Pressable
                      key={opt.key}
                      style={[styles.chip, active && styles.chipActive]}
                      onPress={() => { setActiveFilter(opt.key); setQuery(""); }}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {opt.label}
                    </Text>
                  </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Count ── */}
        <Text style={styles.resultCount}>
          {filtered.length} {filtered.length === 1 ? "aluno encontrado" : "alunos encontrados"}
        </Text>

        {/* ── List ── */}
        <View style={styles.list}>
          {filtered.length === 0 ? (
              <View style={styles.emptyCard}>
                <View style={styles.emptyIconBox}>
                  <MaterialIcons name="school" size={32} color={palette.primary} />
                </View>
                <Text style={styles.emptyTitle}>Nenhum aluno encontrado</Text>
                <Text style={styles.emptySubtitle}>Ajuste os filtros ou a busca.</Text>
              </View>
          ) : (
              filtered.map((student) => (
                  <View key={student.id} style={styles.studentCard}>
                    {/* Card header */}
                    <View style={styles.cardHeader}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                          {String(student.nome ?? "?")[0].toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.headerInfo}>
                        <Text style={styles.studentName}>{student.nome}</Text>
                        <Text style={styles.matricula}>Mat: {student.matricula}</Text>
                      </View>
                    </View>

                    <View style={styles.metaGrid}>
                      <MetaRow icon="menu-book"   label="Curso"    value={student.curso} />
                      <MetaRow icon="email"       label="E-mail"   value={student.email} />
                      <MetaRow
                          icon="location-on"
                          label="Endereço"
                          value={`${student.logradouro}, ${student.numero} - ${student.bairro}`}
                      />
                      <MetaRow
                          icon="place"
                          label="Cidade"
                          value={`${student.cidade} / ${student.estado}`}
                      />
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
  registerBtn: {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  registerBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  heroTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  heroSubtitle: {
    color: "#d8ebff",
    fontSize: 13,
    lineHeight: 19,
  },

  // Search card
  searchCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
    marginBottom: 12,
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: palette.primary,
    marginBottom: 10,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: palette.background,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },
  searchInput: {
    flex: 1,
    color: palette.text,
    fontSize: 14,
    fontWeight: "500",
  },
  chipsScroll: { flexGrow: 0 },
  chipsRow: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "#fff",
  },
  chipActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  chipText: {
    color: palette.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  chipTextActive: { color: "#fff" },

  // Count
  resultCount: {
    color: palette.textMuted,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 10,
  },

  // List
  list: { gap: 12 },

  // Student card
  studentCard: {
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
  avatarText: {
    color: palette.primary,
    fontSize: 18,
    fontWeight: "800",
  },
  headerInfo: { flex: 1 },
  studentName: {
    fontSize: 15,
    fontWeight: "700",
    color: palette.text,
    marginBottom: 2,
  },
  matricula: {
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
  },
});