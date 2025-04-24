import React from "react";
import { View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updatePasswordSchema,
  UpdatePasswordInput,
} from "../../../src/schemas/auth";
import { FormInput } from "../../../src/components/FormInput";
import { Button } from "../../../src/components/Button";
import { useUpdatePassword } from "../../../src/hooks/useAuth";

export default function PasswordScreen() {
  const { mutate: updatePassword, isPending } = useUpdatePassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = (data: UpdatePasswordInput) => {
    updatePassword(data, {
      onSuccess: () => {
        router.back();
      },
    });
  };

  return (
    <View style={styles.container}>
      <FormInput
        control={control}
        name="currentPassword"
        label="Contraseña actual"
        placeholder="Ingresa tu contraseña actual"
        error={errors.currentPassword?.message}
        secureTextEntry
      />

      <FormInput
        control={control}
        name="newPassword"
        label="Nueva contraseña"
        placeholder="Ingresa tu nueva contraseña"
        error={errors.newPassword?.message}
        secureTextEntry
      />

      <Button
        title="Cambiar contraseña"
        onPress={handleSubmit(onSubmit)}
        loading={isPending}
      />

      <Button
        title="Cancelar"
        variant="secondary"
        onPress={() => router.back()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
});
