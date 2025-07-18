// src/controllers/profileController.ts
import { Request, Response } from 'express';
import { ProfileService } from '../services/profileService';
import { 
  updateProfilePictureSchema, 
  updateBannerSchema, 
  updateProfileInfoSchema 
} from '../models/profileModels';

export class ProfileController {
  
  static async getOwnProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        res.status(400).json({ 
          success: false, 
          message: 'ID de usuario inválido' 
        });
        return;
      }

      const profile = await ProfileService.getOwnProfile(userId);
      
      if (!profile) {
        res.status(404).json({ 
          success: false, 
          message: 'Perfil no encontrado' 
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: profile
      });

    } catch (error) {
      console.error('Error en getOwnProfile:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error interno del servidor' 
      });
    }
  }

  static async getUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        res.status(400).json({ 
          success: false, 
          message: 'ID de usuario inválido' 
        });
        return;
      }

      const profile = await ProfileService.getUserProfile(userId);
      
      if (!profile) {
        res.status(404).json({ 
          success: false, 
          message: 'Usuario no encontrado' 
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: profile
      });

    } catch (error) {
      console.error('Error en getUserProfile:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error interno del servidor' 
      });
    }
  }

  static async updateProfilePicture(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        res.status(400).json({ 
          success: false, 
          message: 'ID de usuario inválido' 
        });
        return;
      }

      // Validar datos con Zod
      const validationResult = updateProfilePictureSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: validationResult.error.errors
        });
        return;
      }

      const { profilePicture } = validationResult.data;
      
      const updatedUser = await ProfileService.updateProfilePicture(userId, profilePicture);
      
      res.status(200).json({
        success: true,
        message: 'Foto de perfil actualizada exitosamente',
        data: updatedUser
      });

    } catch (error) {
      console.error('Error en updateProfilePicture:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error interno del servidor' 
      });
    }
  }

  static async updateBanner(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        res.status(400).json({ 
          success: false, 
          message: 'ID de usuario inválido' 
        });
        return;
      }

      // Validar datos con Zod
      const validationResult = updateBannerSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: validationResult.error.errors
        });
        return;
      }

      const { banner } = validationResult.data;
      
      const updatedUser = await ProfileService.updateBanner(userId, banner);
      
      res.status(200).json({
        success: true,
        message: 'Imagen de banner actualizada exitosamente',
        data: updatedUser
      });

    } catch (error) {
      console.error('Error en updateBanner:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error interno del servidor' 
      });
    }
  }

  static async updateProfileInfo(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        res.status(400).json({ 
          success: false, 
          message: 'ID de usuario inválido' 
        });
        return;
      }

      // Validar datos con Zod
      const validationResult = updateProfileInfoSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: validationResult.error.errors
        });
        return;
      }

      const profileData = validationResult.data;
      
      const updatedProfile = await ProfileService.updateProfileInfo(userId, profileData);
      
      res.status(200).json({
        success: true,
        message: 'Perfil actualizado exitosamente',
        data: updatedProfile
      });

    } catch (error) {
      console.error('Error en updateProfileInfo:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error interno del servidor' 
      });
    }
  }

  static async toggleFollowUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const targetUserId = parseInt(req.params.targetUserId);
      
      if (isNaN(userId) || isNaN(targetUserId)) {
        res.status(400).json({ 
          success: false, 
          message: 'ID de usuario inválido' 
        });
        return;
      }

      // Verificar que no se esté siguiendo a sí mismo
      if (userId === targetUserId) {
        res.status(400).json({ 
          success: false, 
          message: 'No puedes seguirte a ti mismo' 
        });
        return;
      }

      const result = await ProfileService.toggleFollowUser(userId, targetUserId);
      
      res.status(200).json({
        success: true,
        message: result.message,
        data: result
      });

    } catch (error) {
      console.error('Error en toggleFollowUser:', error);
      if (error instanceof Error) {
        res.status(400).json({ 
          success: false, 
          message: error.message 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: 'Error interno del servidor' 
        });
      }
    }
  }
}