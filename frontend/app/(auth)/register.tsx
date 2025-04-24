import React from "react";
import { View, StyleSheet } from "react-native";
import { Link, router } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "../../src/schemas/auth";
import { FormInput } from "../../src/components/FormInput";
import { Button } from "../../src/components/Button";
import { useRegister } from "../../src/hooks/useAuth";

export default function RegisterScreen() {
  const { mutate: register, isPending } = useRegister();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      password: "",
      birthDate: "",
    },
  });

  const onSubmit = (data: RegisterInput) => {
    register(data, {
      onSuccess: () => {
        router.replace("/(app)/profile");
      },
    });
  };

  return (
    <View style={styles.container}>
      <FormInput
        control={control}
        name="name"
        label="Nombre"
        placeholder="Tu nombre"
        error={errors.name?.message}
      />

      <FormInput
        control={control}
        name="lastName"
        label="Apellido"
        placeholder="Tu apellido"
        error={errors.lastName?.message}
      />

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
        name="birthDate"
        label="Fecha de nacimiento"
        placeholder="YYYY-MM-DD"
        error={errors.birthDate?.message}
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
        title="Registrarse"
        onPress={handleSubmit(onSubmit)}
        loading={isPending}
      />

      <Link href="/login" style={styles.link}>
        ¿Ya tienes cuenta? Inicia sesión
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