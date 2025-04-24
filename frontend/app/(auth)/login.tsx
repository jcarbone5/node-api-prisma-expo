import React from "react";
import { View, StyleSheet } from "react-native";
import { Link, router } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "../../src/schemas/auth";
import { FormInput } from "../../src/components/FormInput";
import { Button } from "../../src/components/Button";
import { useLogin } from "../../src/hooks/useAuth";

export default function LoginScreen() {
  const { mutate: login, isPending } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginInput) => {
    login(data, {
      onSuccess: () => {
        router.replace("/(app)/profile");
      },
    });
  };

  return (
    <View style={styles.container}>
      <FormInput
        control={control}
        name="email"
        label="Correo electrónico"
        placeholder="tu@email.com"
        error={errors.email?.message}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <FormInput
        control={control}
        name="password"
        label="Contraseña"
        placeholder="Contraseña"
        error={errors.password?.message}
        secureTextEntry
      />

      <Button
        title="Iniciar Sesión"
        onPress={handleSubmit(onSubmit)}
        loading={isPending}
      />

      <Link href="/register" style={styles.link}>
        ¿No tienes cuenta? Regístrate
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#007AFF",
  },
});
