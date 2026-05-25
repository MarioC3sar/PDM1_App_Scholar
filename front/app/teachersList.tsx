
import React, { useState, useMemo } from "react";
import {
    StyleSheet,
    Text,
    ScrollView,
    View,
    TextInput,
    TouchableOpacity,
    Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { Card } from "@/components/ui";
import { useAcademicData } from "@/hooks/use-academic-data";
import { palette } from "@/constants/theme";

type FilterKey = "nome" | "titulacao" | "area" | "tempoDocencia" | "email";

const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
    { key: "nome",         label: "Nome" },
    { key: "titulacao",    label: "Titulação" },
    { key: "area",         label: "Área" },
    { key: "tempoDocencia",label: "Tempo" },
    { key: "email",        label: "E-mail" },
];

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

export default function TeachersList() {
    const router = useRouter();
    const { teachers } = useAcademicData();

    const [query, setQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<FilterKey>("nome");

    const filtered = useMemo(() => {
        if (!query.trim()) return teachers;
        const q = query.toLowerCase().trim();
        return teachers.filter((t) =>
            String(t[activeFilter] ?? "").toLowerCase().includes(q),
        );
    }, [teachers, query, activeFilter]);

    return (
        <View style={styles.root}>
            {/* ── Header ── */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerEyebrow}>GESTÃO</Text>
                    <Text style={styles.headerTitle}>Professores</Text>
                </View>
                <TouchableOpacity
                    style={styles.registerBtn}
                    onPress={() => router.push("/teachersAdd")}
                    activeOpacity={0.82}
                >
                    <Text style={styles.registerBtnText}>＋ Cadastrar</Text>
                </TouchableOpacity>
            </View>

            {/* ── Search bar ── */}
            <View style={styles.searchRow}>
                <View style={styles.searchBox}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder={`Buscar por ${FILTER_OPTIONS.find((f) => f.key === activeFilter)?.label ?? ""}…`}
                        placeholderTextColor={palette.primary + "50"}
                        value={query}
                        onChangeText={setQuery}
                        autoCorrect={false}
                        autoCapitalize="none"
                    />
                    {query.length > 0 && (
                        <TouchableOpacity
                            onPress={() => setQuery("")}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
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
                {filtered.length} {filtered.length === 1 ? "professor encontrado" : "professores encontrados"}
            </Text>

            {/* ── List ── */}
            <ScrollView
                style={styles.list}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            >
                {filtered.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>👨‍🏫</Text>
                        <Text style={styles.emptyTitle}>Nenhum professor encontrado</Text>
                        <Text style={styles.emptySubtitle}>Tente ajustar os filtros ou a busca</Text>
                    </View>
                ) : (
                    filtered.map((teacher) => (
                        <Card key={teacher.id}>
                            {/* Card header */}
                            <View style={styles.cardHeader}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>
                                        {String(teacher.nome ?? "?")[0].toUpperCase()}
                                    </Text>
                                </View>
                                <View style={styles.cardHeaderInfo}>
                                    <Text style={styles.itemTitle}>{teacher.nome}</Text>
                                    <View style={styles.titulacaoBadge}>
                                        <Text style={styles.titulacaoText}>{teacher.titulacao}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            {/* Info rows */}
                            <View style={styles.infoRow}>
                                <InfoItem icon="🔬" label="Área" value={teacher.area} />
                                <InfoItem icon="✉️" label="E-mail" value={teacher.email} />
                            </View>

                            {/* Tempo de docência */}
                            <View style={styles.tempoRow}>
                                <Text style={styles.tempoIcon}>⏱️</Text>
                                <Text style={styles.tempoText}>
                                    {teacher.tempoDocencia} de docência
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
        color: palette.primary + "80",
        fontWeight: "700",
    },

    // Chips
    chipsScroll: {
        marginBottom: 4,
        flexGrow: 0,
    },
    chipsContent: {
        paddingHorizontal: 20,
        gap: 8,
        alignItems: "center",
    },
    chip: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 99,
        borderWidth: 1.5,
        borderColor: palette.primary + "30",
        backgroundColor: "transparent",
        alignSelf: "flex-start",
    },
    chipActive: {
        backgroundColor: palette.primary,
        borderColor: palette.primary,
    },
    chipText: {
        fontSize: 13,
        fontWeight: "600",
        color: palette.primary + "90",
    },
    chipTextActive: {
        color: "#fff",
    },

    // Count
    resultCount: {
        fontSize: 12,
        color: palette.primary + "70",
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
        marginBottom: 4,
    },
    titulacaoBadge: {
        alignSelf: "flex-start",
        backgroundColor: palette.primary + "18",
        borderRadius: 99,
        paddingHorizontal: 10,
        paddingVertical: 3,
    },
    titulacaoText: {
        fontSize: 11,
        fontWeight: "700",
        color: palette.primary,
        letterSpacing: 0.3,
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
        color: palette.primary + "70",
        letterSpacing: 0.8,
        textTransform: "uppercase",
    },
    infoValue: {
        fontSize: 13,
        fontWeight: "500",
        color: palette.primary + "CC",
    },
    tempoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: palette.primary + "08",
        borderRadius: 8,
        padding: 8,
    },
    tempoIcon: { fontSize: 13 },
    tempoText: {
        fontSize: 12,
        color: palette.primary + "CC",
        fontWeight: "500",
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
        color: palette.primary + "70",
    },
});