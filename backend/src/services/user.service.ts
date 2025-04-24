import { PrismaClient } from '@prisma/client';
import { UpdateUserInput } from '@/schemas/user.schema';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const updateProfile = async (userId: string, data: UpdateUserInput) => {
  if (data.email) {
    const existingUser = await prisma.user.findUnique({
      where: { 
        email: data.email,
        NOT: { id: userId }
      }
    });

    if (existingUser) {
      throw new Error('El email ya está en uso');
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data
  });

  const { password, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

export const updatePassword = async (userId: string, currentPassword: string, newPassword: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const validPassword = await bcrypt.compare(currentPassword, user.password);
  if (!validPassword) {
    throw new Error('La contraseña actual es incorrecta');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  });

  const { password, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
}; 