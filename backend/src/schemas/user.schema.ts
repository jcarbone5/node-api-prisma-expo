import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').optional(),
  email: z.string().email('Email inválido').optional(),
  birthDate: z.string().transform((str) => new Date(str)).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'La contraseña actual debe tener al menos 6 caracteres'),
  newPassword: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres')
});

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>; 