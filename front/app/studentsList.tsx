import React, { useState, useMemo } from "react";
import {
    StyleSheet,
    Text,
    ScrollView,
    View,
    TextInput,
    TouchableOpacity,
    Pressable,
    Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { Card } from "@/components/ui";
import { useAcademicData } from "@/hooks/use-academic-data";
import { palette } from "@/constants/theme";

type FilterKey = "nome" | "curso" | "matricula" | "cidade" | "bairro" | "email";

const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
    { key: "nome", label: "Nome" },
    { key: "curso", label: "Curso" },
    { key: "matricula", label: "Matrícula" },
    { key: "cidade", label: "Cidade" },
    { key: "bairro", label: "Bairro" },
    { key: "email", label: "E-mail" },
];

export default function StudentsList() {
    const router = useRouter();
    const { students } = useAcademicData();

    const [query, setQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<FilterKey>("nome");

    const filtered = useMemo(() => {
        if (!query.trim()) return students;
        const q = query.toLowerCase().trim();
        return students.filter((s) => {
            const value = String(s[activeFilter] ?? "").toLowerCase();
            return value.includes(q);
        });
    }, [students, query, activeFilter]);

    const handleRegister = () => {
        router.push("/studentsAdd"); // ajuste a rota conforme seu projeto
    };

    return (
        <View style={styles.root}>
            {/* ── Header ── */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerEyebrow}>GESTÃO</Text>
                    <Text style={styles.headerTitle}>Alunos</Text>
                </View>
                <TouchableOpacity style={styles.registerBtn} onPress={handleRegister} activeOpacity={0.82}>
                    <Text style={styles.registerBtnText}>＋ Cadastrar</Text>
                </TouchableOpacity>
            </View>

            {/* ── Search bar ── */}
            <View style={styles.searchRow}>
                <View style={styles.searchBox}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder={`Buscar por ${FILTER_OPTIONS.find(f => f.key === activeFilter)?.label ?? ""}…`}
                        placeholderTextColor={palette.secondary + "80"}
                        value={query}
                        onChangeText={setQuery}
                        autoCorrect={false}
                        autoCapitalize="none"
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => setQuery("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                            <Text style={styles.clearBtn}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* ── Filter chips ── */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.chipsScroll}
                contentContainerStyle={styles.chipsContent}
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

            {/* ── Count ── */}
            <Text style={styles.resultCount}>
                {filtered.length} {filtered.length === 1 ? "aluno encontrado" : "alunos encontrados"}
            </Text>

            {/* ── List ── */}
            <ScrollView
                style={styles.list}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            >
                {filtered.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>🎓</Text>
                        <Text style={styles.emptyTitle}>Nenhum aluno encontrado</Text>
                        <Text style={styles.emptySubtitle}>Tente ajustar os filtros ou a busca</Text>
                    </View>
                ) : (
                    filtered.map((student) => (
                        <Card key={student.id}>
                            <View style={styles.cardHeader}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>
                                        {String(student.nome ?? "?")[0].toUpperCase()}
                                    </Text>
                                </View>
                                <View style={styles.cardHeaderInfo}>
                                    <Text style={styles.itemTitle}>{student.nome}</Text>
                                    <Text style={styles.matriculaTag}>#{student.matricula}</Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.infoRow}>
                                <InfoItem icon="🎓" label="Curso" value={student.curso} />
                                <InfoItem icon="✉️" label="E-mail" value={student.email} />
                            </View>

                            <View style={styles.addressRow}>
                                <Text style={styles.addressIcon}>📍</Text>
                                <Text style={styles.addressText} numberOfLines={2}>
                                    {student.logradouro}, {student.numero} – {student.bairro},{" "}
                                    {student.cidade} / {student.estado}
                                </Text>
                            </View>
                        </Card>
                    ))
                )}
                <View style={{ height: 32 }} />
            </ScrollView>
        </View>
    );
}

// ── Sub-component ──────────────────────────────────────────────
function InfoItem({ icon, label, value }: { icon: string; label: string; value: string }) {
    return (
        <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>{icon}</Text>
            <View>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
            </View>
        </View>
    );
}

// ── Styles ─────────────────────────────────────────────────────
const RADIUS = 14;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: palette.background,
    },

    // Header
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 12,
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
    registerBtn: {
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
    registerBtnText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 14,
        letterSpacing: 0.3,
    },

    // Search
    searchRow: {
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: palette.primary + "0D",
        borderRadius: RADIUS,
        borderWidth: 1.5,
        borderColor: palette.primary + "20",
        paddingHorizontal: 14,
        paddingVertical: 10,
        gap: 10,
    },
    searchIcon: { fontSize: 16 },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: palette.primary,
        fontWeight: "500",
    },
    clearBtn: {
        fontSize: 13,
        color: palette.secondary,
        fontWeight: "700",
    },

    // Chips
    chipsScroll:
        { marginBottom: 4,
        flexGrow: 0},
    chipsContent: {
        paddingHorizontal: 20,
        gap: 8,
        alignItems: "center",
    },
    chip: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 99,
        borderWidth: 1.5,
        borderColor: palette.primary + "30",
        backgroundColor: "transparent",
        alignSelf: "flex-start"
    },
    chipActive: {
        backgroundColor: palette.primary,
        borderColor: palette.primary,
    },
    chipText: {
        fontSize: 13,
        fontWeight: "600",
        color: palette.secondary,
    },
    chipTextActive: {
        color: "#fff",
    },

    // Count
    resultCount: {
        fontSize: 12,
        color: palette.secondary + "90",
        fontWeight: "600",
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 6,
        letterSpacing: 0.3,
    },

    // List
    list: { flex: 1 },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 4,
        gap: 12,
    },

    // Card internals
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 12,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: palette.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "800",
    },
    cardHeaderInfo: { flex: 1 },
    itemTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: palette.primary,
        marginBottom: 2,
    },
    matriculaTag: {
        fontSize: 12,
        fontWeight: "600",
        color: palette.secondary + "99",
        letterSpacing: 0.5,
    },
    divider: {
        height: 1,
        backgroundColor: palette.primary + "15",
        marginBottom: 12,
    },
    infoRow: {
        gap: 8,
        marginBottom: 10,
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
    },
    infoIcon: { fontSize: 14, marginTop: 1 },
    infoLabel: {
        fontSize: 10,
        fontWeight: "700",
        color: palette.secondary + "80",
        letterSpacing: 0.8,
        textTransform: "uppercase",
    },
    infoValue: {
        fontSize: 13,
        fontWeight: "500",
        color: palette.secondary,
    },
    addressRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 6,
        backgroundColor: palette.primary + "08",
        borderRadius: 8,
        padding: 8,
    },
    addressIcon: { fontSize: 13, marginTop: 1 },
    addressText: {
        flex: 1,
        fontSize: 12,
        color: palette.secondary,
        fontWeight: "500",
        lineHeight: 18,
    },

    // Empty state
    emptyState: {
        alignItems: "center",
        marginTop: 64,
        gap: 8,
    },
    emptyIcon: { fontSize: 48 },
    emptyTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: palette.primary,
    },
    emptySubtitle: {
        fontSize: 13,
        color: palette.secondary + "90",
    },
});