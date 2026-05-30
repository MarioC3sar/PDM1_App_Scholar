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
  const { isAuthenticated, loading, user } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const firstAccess = user?.perfil !== "admin" && (user?.firstAccess ?? false);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "login";
    const inFirstAccessGroup = segments[0] === "firstAccess";
    const currentRoute = segments[0] ?? "";

    const adminOnlyRoutes = new Set(["students", "studentsList", "teachers", "teachersList", "courses"]);
    const professorOnlyRoutes = new Set(["gradeEditor"]);
    const professorBlockedRoutes = new Set(["grades"]);

    if (!isAuthenticated && !inAuthGroup) {
      // Redireciona para o login caso nao esteja autenticado e tente acessar outra rota
      router.replace("/login");
    } else if (isAuthenticated && firstAccess && !inFirstAccessGroup) {
      router.replace("/firstAccess");
    } else if (isAuthenticated && !firstAccess && inFirstAccessGroup) {
      // Redireciona para o dashboard caso ja esteja autenticado e tente acessar o login
      router.replace("/(tabs)/dashboard");
    } else if (isAuthenticated && !firstAccess && inAuthGroup) {
      // Redireciona para o dashboard caso ja esteja autenticado e tente acessar o login
      router.replace("/(tabs)/dashboard");
    } else if (
      isAuthenticated &&
      !firstAccess &&
      adminOnlyRoutes.has(currentRoute) &&
      user?.perfil !== "admin"
    ) {
      router.replace("/(tabs)/dashboard");
    } else if (
      isAuthenticated &&
      !firstAccess &&
      professorOnlyRoutes.has(currentRoute) &&
      user?.perfil !== "professor"
    ) {
      router.replace("/(tabs)/dashboard");
    } else if (
      isAuthenticated &&
      !firstAccess &&
      professorBlockedRoutes.has(currentRoute) &&
      user?.perfil === "professor"
    ) {
      router.replace("/gradeEditor");
    }
  }, [firstAccess, isAuthenticated, loading, segments, router, user?.perfil]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" />
        <Stack.Screen name="firstAccess" />
        <Stack.Screen name="studentsList" />
        <Stack.Screen name="students" />
        <Stack.Screen name="teachersList" />
        <Stack.Screen name="teachers" />
        <Stack.Screen name="courses" />
        <Stack.Screen name="grades" />
        <Stack.Screen name="gradeEditor" />
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
