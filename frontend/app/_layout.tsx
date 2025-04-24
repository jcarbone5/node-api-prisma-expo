import { Stack, useSegments, useRouter } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toast } from "../src/components/Toast";
import { useAuthStore } from "../src/store/authStore";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "react-native";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const { initialize, isLoading, isAuthenticated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const inAuthGroup = segments[0] === "(auth)";
      const inAppGroup = segments[0] === "(app)";

      if (isAuthenticated && (inAuthGroup || !inAppGroup)) {
        router.replace("/(app)/profile");
      } else if (!isAuthenticated && !inAuthGroup) {
        router.replace("/(auth)/login");
      }

      SplashScreen.hideAsync();
    }
  }, [isLoading, isAuthenticated, segments]);

  if (isLoading) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
      <StatusBar barStyle="default" />
      <Toast />
    </QueryClientProvider>
  );
}
