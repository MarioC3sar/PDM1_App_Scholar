import React, { useState } from "react";
import { StyleSheet, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Card } from "@/components/ui";
import { useAcademicData } from "@/hooks/use-academic-data";
import { palette } from "@/constants/theme";

export default function StudentsList() {
    const router = useRouter();
    const { students } = useAcademicData();
    const [feedback, setFeedback] = useState("");

    // O JSX que vai para a tela precisa estar dentro do return()
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {students.map((student) => (
                <Card key={student.id}>
                    <Text style={styles.itemTitle}>{student.nome}</Text>
                    <Text style={styles.itemText}>Matricula: {student.matricula}</Text>
                    <Text style={styles.itemText}>Curso: {student.curso}</Text>
                    <Text style={styles.itemText}>Email: {student.email}</Text>
                    <Text style={styles.itemText}>
                        Local: {student.logradouro}, {student.numero} - {student.bairro} - {student.cidade} - {student.estado}
                    </Text>
                </Card>
            ))}
        </ScrollView>
    );
}

// Movido para fora do componente para melhor performance
const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 16, // Cria um espaçamento automático entre os Cards
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: palette.primary,
        marginBottom: 4,
    },
    itemText: {
        fontSize: 14,
        fontWeight: "bold",
        color: palette.secondary,
        marginBottom: 4,
    }
});