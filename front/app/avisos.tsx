import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ScreenContainer } from "@/components/ui";
import { palette } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import api from "@/services/api";
import { Aviso } from "@/types";

function AvisoCard({ aviso }: { aviso: Aviso }) {
  return (
    <View style={styles.avisoCard}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <MaterialIcons name="campaign" size={24} color={palette.primary} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.avisoTitle}>{aviso.titulo}</Text>
          <Text style={styles.avisoDate}>
            {new Date(aviso.data_criacao).toLocaleDateString("pt-BR")}
          </Text>
        </View>
      </View>
      <Text style={styles.avisoMessage}>{aviso.mensagem}</Text>
    </View>
  );
}

export default function AvisosList() {
  const router = useRouter();
  const { user } = useAuth();
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const fetchAvisos = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/avisos");
        setAvisos(data);
      } catch (error) {
        setLoadError("Falha ao carregar avisos.");
      } finally {
        setLoading(false);
      }
    };

    fetchAvisos();
  }, []);

  const canCreate = user?.perfil.toLowerCase() === "professor" || user?.perfil.toLowerCase() === "admin";

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.heroBrand}>
            <MaterialIcons name="campaign" size={16} color="rgba(255,255,255,0.9)" />
            <Text style={styles.heroBrandText}>Mural de Avisos</Text>
          </View>
          {canCreate && (
            <Pressable
              style={({ pressed }) => [styles.registerBtn, pressed && { opacity: 0.8 }]}
              onPress={() => router.push("/criar-aviso")}
            >
              <Text style={styles.registerBtnText}>+ Criar Novo Aviso</Text>
            </Pressable>
          )}
        </View>
        <Text style={styles.heroSubtitle}>
          Avisos e comunicados importantes para a comunidade acadêmica.
        </Text>
      </View>

      {loadError ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{loadError}</Text>
        </View>
      ) : null}

      {loading ? (
        <View style={styles.loadingCard}>
          <ActivityIndicator color={palette.primary} />
          <Text style={styles.emptySubtitle}>Carregando avisos...</Text>
        </View>
      ) : avisos.length === 0 ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconBox}>
            <MaterialIcons name="notifications-off" size={32} color={palette.primary} />
          </View>
          <Text style={styles.emptyTitle}>Nenhum aviso encontrado</Text>
          <Text style={styles.emptySubtitle}>Ainda não há nenhum aviso publicado.</Text>
        </View>
      ) : (
        <ScrollView style={styles.list}>
          {avisos.map((aviso) => (
            <AvisoCard key={aviso.id} aviso={aviso} />
          ))}
        </ScrollView>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: palette.primary,
    borderRadius: 28,
    padding: 18,
    marginTop: 25,
    marginBottom: 16,
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
  },
  heroBrandText: {
    color: "#fff",
    fontSize: 16,
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
  heroSubtitle: {
    color: "#d8ebff",
    fontSize: 13,
    lineHeight: 19,
  },
  errorCard: {
    marginBottom: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "rgba(220, 38, 38, 0.08)",
  },
  errorText: {
    color: "#b91c1c",
    fontWeight: "600",
  },
  loadingCard: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 10,
  },
  emptyCard: {
    alignItems: "center",
    padding: 32,
    gap: 10,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: palette.primary + "12",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  emptySubtitle: {
    color: palette.textMuted,
  },
  list: {
    flex: 1,
  },
  avisoCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
    marginBottom: 12,
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
  headerInfo: {
    flex: 1,
  },
  avisoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: palette.text,
  },
  avisoDate: {
    fontSize: 12,
    color: palette.textMuted,
  },
  avisoMessage: {
    fontSize: 14,
    lineHeight: 20,
    color: palette.text,
  },
});