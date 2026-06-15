import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput as RNTextInput,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import { Button, Card, ErrorMessage, ScreenContainer, TextInput } from "@/components/ui";
import { palette } from "@/constants/theme";
import api from "@/services/api";
import { Aviso } from "@/types";

type PerfilAlvo = "todos" | "ALUNO" | "PROFESSOR";

export default function CriarAvisoScreen() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [perfilAlvo, setPerfilAlvo] = useState<PerfilAlvo>("todos");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const mensagemRef = React.useRef<RNTextInput>(null);

  const handlePublicar = async () => {
    if (!titulo.trim() || !mensagem.trim()) {
      setError("Título e mensagem são obrigatórios.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/avisos", { titulo, mensagem, perfil_alvo: perfilAlvo });
      router.back();
    } catch (err) {
      setError("Falha ao publicar aviso. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <View style={styles.heroBrand}>
          <MaterialIcons name="add-alert" size={16} color="rgba(255,255,255,0.9)" />
          <Text style={styles.heroBrandText}>Criar Novo Aviso</Text>
        </View>
        <Text style={styles.heroSubtitle}>
          Escreva e publique um novo aviso para todos os alunos.
        </Text>
      </View>

      <Card variant="elevated" style={styles.formCard}>
        <ErrorMessage message={error} visible={!!error} />

        <TextInput
          label="Título do Aviso"
          placeholder="Ex: Lembrete de Matrícula"
          value={titulo}
          onChangeText={setTitulo}
          returnKeyType="next"
          onSubmitEditing={() => mensagemRef.current?.focus()}
          blurOnSubmit={false}
          required
        />

        <TextInput
          ref={mensagemRef}
          label="Mensagem"
          placeholder="Digite a mensagem completa do aviso aqui..."
          value={mensagem}
          onChangeText={setMensagem}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          required
        />

        <View style={styles.radioContainer}>
          <Text style={styles.radioLabel}>Enviar para:</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[styles.radioButton, perfilAlvo === "todos" && styles.radioButtonActive]}
              onPress={() => setPerfilAlvo("todos")}
            >
              <Text style={styles.radioText}>Todos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radioButton, perfilAlvo === "ALUNO" && styles.radioButtonActive]}
              onPress={() => setPerfilAlvo("ALUNO")}
            >
              <Text style={styles.radioText}>Alunos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                perfilAlvo === "PROFESSOR" && styles.radioButtonActive,
              ]}
              onPress={() => setPerfilAlvo("PROFESSOR")}
            >
              <Text style={styles.radioText}>Professores</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>

      <View style={styles.submitArea}>
        <Button
          title={loading ? "Publicando..." : "Publicar Aviso"}
          loading={loading}
          onPress={handlePublicar}
        />
      </View>
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
  heroBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 18,
  },
  heroBrandText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  heroSubtitle: {
    color: "#d8ebff",
    fontSize: 13,
    lineHeight: 19,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
  },
  submitArea: {
    marginTop: 20,
  },
  radioContainer: {
    marginTop: 16,
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: palette.text,
    marginBottom: 8,
  },
  radioGroup: {
    flexDirection: "row",
    gap: 12,
  },
  radioButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: palette.border,
  },
  radioButtonActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  radioText: {
    fontWeight: "600",
  },
});
