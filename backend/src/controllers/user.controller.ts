import { Request, Response } from 'express';
import { getProfile as getProfileService, updateProfile as updateProfileService, updatePassword as updatePasswordService } from '@/services/user.service';
import { updateUserSchema, updatePasswordSchema } from '@/schemas/user.schema';
import { ZodError } from 'zod';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await getProfileService(req.user!.id);
    res.json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const data = updateUserSchema.parse(req.body);
    const updatedUser = await updateProfileService(req.user!.id, data);
    res.json(updatedUser);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ 
        message: 'Error de validación', 
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    } else if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const data = updatePasswordSchema.parse(req.body);
    const updatedUser = await updatePasswordService(req.user!.id, data.currentPassword, data.newPassword);
    res.json({ message: 'Contraseña actualizada exitosamente', user: updatedUser });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ 
        message: 'Error de validación', 
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    } else if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}; 