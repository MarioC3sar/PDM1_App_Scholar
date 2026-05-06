import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { AcademicProvider } from "@/contexts/app-data-context";
import { AuthProvider } from "@/contexts/auth-context";
import { useAuth } from "@/hooks/use-auth";
import { useColorScheme } from "@/hooks/use-color-scheme";

function RootNavigator() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "login";

    if (!isAuthenticated && !inAuthGroup) {
      // Redireciona para o login caso nao esteja autenticado e tente acessar outra rota
      router.replace("/login");
    } else if (isAuthenticated && inAuthGroup) {
      // Redireciona para o dashboard caso ja esteja autenticado e tente acessar o login
      router.replace("/(tabs)/dashboard");
    }
  }, [isAuthenticated, loading, segments, router]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" />
        <Stack.Screen name="students" />
        <Stack.Screen name="teachers" />
        <Stack.Screen name="courses" />
        <Stack.Screen name="grades" />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AcademicProvider>
        <RootNavigator />
      </AcademicProvider>
    </AuthProvider>
  );
}