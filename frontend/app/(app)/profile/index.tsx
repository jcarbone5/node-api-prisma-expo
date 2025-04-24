import React from "react";
import { View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProfileSchema,
  UpdateProfileInput,
} from "../../../src/schemas/auth";
import { FormInput } from "../../../src/components/FormInput";
import { Button } from "../../../src/components/Button";
import { useLogout, useUpdateProfile, useProfile } from "../../../src/hooks/useAuth";

export default function ProfileScreen() {
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { mutate: logout } = useLogout();
  const { data: profile } = useProfile();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      birthDate: "",
    },
  });

  React.useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        lastName: profile.lastName,
        email: profile.email,
        birthDate: profile.birthDate,
      });
    }
  }, [profile, reset]);

  const onSubmit = (data: UpdateProfileInput) => {
    updateProfile(data);
  };

  return (
    <View style={styles.container}>
      <FormInput
        control={control}
        name="name"
        label="Nombre"
        placeholder="Ingresa tu nombre"
        error={errors.name?.message}
      />

      <FormInput
        control={control}
        name="lastName"
        label="Apellido"
        placeholder="Ingresa tu apellido"
        error={errors.lastName?.message}
      />

      <FormInput
        control={control}
        name="email"
        label="Correo electrónico"
        placeholder="Ingresa tu correo"
        error={errors.email?.message}
        keyboardType="email-address"
      />

      <FormInput
        control={control}
        name="birthDate"
        label="Fecha de nacimiento"
        placeholder="YYYY-MM-DD"
        error={errors.birthDate?.message}
      />

      <Button
        title="Actualizar perfil"
        onPress={handleSubmit(onSubmit)}
        loading={isPending}
      />

      <Button
        title="Cambiar contraseña"
        variant="secondary"
        onPress={() => router.push("/profile/password")}
      />

      <Button
        title="Cerrar sesión"
        variant="secondary"
        onPress={logout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    gap: 16,
  },
});
