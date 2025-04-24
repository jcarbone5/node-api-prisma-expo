import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RegisterInput, LoginInput } from '@/schemas/auth.schema';

const prisma = new PrismaClient();

const generateAccessToken = (userId: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no está definido');
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const generateRefreshToken = (userId: string): string => {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_REFRESH_SECRET no está definido');
  }
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

const generateAuthTokens = (userId: string) => {
  return {
    accessToken: generateAccessToken(userId),
    refreshToken: generateRefreshToken(userId)
  };
};

export const register = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (existingUser) {
    throw new Error('El usuario ya existe');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword
    }
  });

  const { password, ...userWithoutPassword } = user;
  const tokens = generateAuthTokens(user.id);

  return {
    user: userWithoutPassword,
    tokens
  };
};

export const login = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  const validPassword = await bcrypt.compare(data.password, user.password);

  if (!validPassword) {
    throw new Error('Credenciales inválidas');
  }

  const { password, ...userWithoutPassword } = user;
  const tokens = generateAuthTokens(user.id);

  return {
    user: userWithoutPassword,
    tokens
  };
};

export const refreshToken = async (token: string) => {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_REFRESH_SECRET no está definido');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET) as { id: string };
    const tokens = generateAuthTokens(decoded.id);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens
    };
  } catch (error) {
    throw new Error('Refresh token inválido');
  }
}; 