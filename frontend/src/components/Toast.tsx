import React, { useEffect } from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { create } from "zustand";

interface ToastState {
  message: string | null;
  type: "success" | "error";
  show: boolean;
  setToast: (message: string, type: "success" | "error") => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  type: "success",
  show: false,
  setToast: (message, type) => set({ message, type, show: true }),
  hideToast: () => set({ show: false }),
}));

export function Toast() {
  const { message, type, show, hideToast } = useToastStore();
  const opacity = new Animated.Value(0);

  useEffect(() => {
    if (show) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => hideToast());
    }
  }, [show]);

  if (!show) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        type === "error" ? styles.errorContainer : styles.successContainer,
        { opacity },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  successContainer: {
    backgroundColor: "#4caf50",
  },
  errorContainer: {
    backgroundColor: "#f44336",
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
}); 