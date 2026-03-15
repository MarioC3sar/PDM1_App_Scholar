import { Card, ScreenContainer } from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function DashboardScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const menuItems = [
    {
      id: "students",
      title: "Cadastro de Alunos",
      description: "Gerenciar informações dos alunos",
      icon: "👨‍🎓",
      route: "/students",
    },
    {
      id: "teachers",
      title: "Cadastro de Professores",
      description: "Gerenciar informações dos professores",
      icon: "👨‍🏫",
      route: "/teachers",
    },
    {
      id: "courses",
      title: "Cadastro de Disciplinas",
      description: "Gerenciar disciplinas e cursos",
      icon: "📚",
      route: "/courses",
    },
    {
      id: "grades",
      title: "Visualizar Boletim",
      description: "Consultar notas e situação acadêmica",
      icon: "📊",
      route: "/grades",
    },
  ];

  return (
    <ScreenContainer>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bem-vindo!</Text>
          <Text style={styles.userName}>{user?.name || "Usuário"}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      <ScrollView
        style={styles.menuContainer}
        showsVerticalScrollIndicator={false}
      >
        {menuItems.map((item) => (
          <Card
            key={item.id}
            onPress={() => router.push(item.route as any)}
            variant="elevated"
            style={styles.menuCard}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardIcon}>{item.icon}</Text>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
              </View>
              <Text style={styles.cardArrow}>›</Text>
            </View>
          </Card>
        ))}
      </ScrollView>

      {/* Footer Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>AppScholar v1.0.0</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  greeting: {
    fontSize: 14,
    color: "#999",
    marginBottom: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  menuContainer: {
    flex: 1,
    marginBottom: 16,
  },
  menuCard: {
    marginVertical: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: "#999",
  },
  cardArrow: {
    fontSize: 24,
    color: "#007AFF",
    fontWeight: "300",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  footerText: {
    fontSize: 12,
    color: "#999",
  },
});
