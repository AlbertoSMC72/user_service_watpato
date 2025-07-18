// src/services/profileService.ts
import { ProfileRepository } from '../repos/profileRepository';
import { NotificationService } from './notificationService';
import { 
  UpdateProfilePictureType, 
  UpdateBannerType, 
  UpdateProfileInfoType,
  OwnProfileResponse,
  UserProfileResponse
} from '../models/profileModels';

export class ProfileService {
  
  static async getOwnProfile(userId: number): Promise<OwnProfileResponse | null> {
    try {
      // Obtener datos básicos del usuario
      const user = await ProfileRepository.getUserById(userId);
      if (!user) {
        return null;
      }

      // Obtener géneros favoritos
      const favoriteGenres = await ProfileRepository.getFavoriteGenres(userId);

      // Obtener libros que le gustan
      const likedBooks = await ProfileRepository.getLikedBooks(userId);

      // Obtener sus propios libros
      const ownBooks = await ProfileRepository.getOwnBooks(userId);

      // Obtener estadísticas
      const stats = await ProfileRepository.getUserStats(userId);

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        friendCode: user.friendCode,
        profilePicture: user.profilePicture,
        banner: user.banner,
        biography: user.biography,
        createdAt: user.createdAt,
        favoriteGenres,
        likedBooks,
        ownBooks,
        stats
      };

    } catch (error) {
      console.error('Error en ProfileService.getOwnProfile:', error);
      throw new Error('Error al obtener el perfil del usuario');
    }
  }

  static async getUserProfile(userId: number): Promise<UserProfileResponse | null> {
    try {
      // Obtener datos básicos del usuario (sin email para perfiles ajenos)
      const user = await ProfileRepository.getUserById(userId);
      if (!user) {
        return null;
      }

      // Obtener géneros favoritos
      const favoriteGenres = await ProfileRepository.getFavoriteGenres(userId);

      // Obtener solo libros publicados para perfiles ajenos
      const publishedBooks = await ProfileRepository.getPublishedBooks(userId);

      // Obtener estadísticas públicas
      const publicStats = await ProfileRepository.getPublicStats(userId);

      return {
        id: user.id,
        username: user.username,
        friendCode: user.friendCode,
        profilePicture: user.profilePicture,
        banner: user.banner,
        biography: user.biography,
        createdAt: user.createdAt,
        favoriteGenres,
        publishedBooks,
        stats: publicStats
      };

    } catch (error) {
      console.error('Error en ProfileService.getUserProfile:', error);
      throw new Error('Error al obtener el perfil del usuario');
    }
  }

  static async updateProfilePicture(userId: number, profilePicture: string) {
    try {
      // Verificar que el usuario existe
      const userExists = await ProfileRepository.userExists(userId);
      if (!userExists) {
        throw new Error('Usuario no encontrado');
      }

      // Actualizar la foto de perfil
      const updatedUser = await ProfileRepository.updateProfilePicture(userId, profilePicture);
      
      return {
        id: updatedUser.id,
        username: updatedUser.username,
        profilePicture: updatedUser.profilePicture
      };

    } catch (error) {
      console.error('Error en ProfileService.updateProfilePicture:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error al actualizar la foto de perfil');
    }
  }

  static async updateBanner(userId: number, banner: string) {
    try {
      // Verificar que el usuario existe
      const userExists = await ProfileRepository.userExists(userId);
      if (!userExists) {
        throw new Error('Usuario no encontrado');
      }

      // Actualizar el banner
      const updatedUser = await ProfileRepository.updateBanner(userId, banner);
      
      return {
        id: updatedUser.id,
        username: updatedUser.username,
        banner: updatedUser.banner
      };

    } catch (error) {
      console.error('Error en ProfileService.updateBanner:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error al actualizar el banner');
    }
  }

  static async updateProfileInfo(userId: number, profileData: UpdateProfileInfoType) {
    try {
      // Verificar que el usuario existe
      const userExists = await ProfileRepository.userExists(userId);
      if (!userExists) {
        throw new Error('Usuario no encontrado');
      }

      // Si se está actualizando el username, verificar que no esté en uso
      if (profileData.username) {
        const usernameExists = await ProfileRepository.usernameExists(profileData.username, userId);
        if (usernameExists) {
          throw new Error('El nombre de usuario ya está en uso');
        }
      }

      // Si se están actualizando géneros favoritos, verificar que existan
      if (profileData.favoriteGenres && profileData.favoriteGenres.length > 0) {
        const validGenres = await ProfileRepository.validateGenres(profileData.favoriteGenres);
        if (!validGenres) {
          throw new Error('Uno o más géneros no son válidos');
        }
      }

      // Actualizar la información del perfil
      const updatedProfile = await ProfileRepository.updateProfileInfo(userId, profileData);
      
      return updatedProfile;

    } catch (error) {
      console.error('Error en ProfileService.updateProfileInfo:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error al actualizar la información del perfil');
    }
  }

  static async toggleFollowUser(userId: number, targetUserId: number) {
    try {
      const result = await ProfileRepository.toggleFollowUser(userId, targetUserId);

      if (result.action === 'followed') {
        // Obtener el username del seguidor para la notificación
        const followerUser = await ProfileRepository.getUserById(userId);
        
        // Enviar notificación al usuario que fue seguido (de forma asíncrona)
        if (followerUser) {
          NotificationService.sendNewFollowerNotification(targetUserId, followerUser.username)
            .catch(error => {
              console.error('Error al enviar notificación:', error);
            });
        }

        return {
          success: true,
          message: 'Usuario seguido exitosamente',
          data: result
        };
      } else {
        return {
          success: true,
          message: 'Usuario dejado de seguir exitosamente',
          data: result
        };
      }
    } catch (error) {
      console.error('Error en ProfileService.toggleFollowUser:', error);
      throw new Error('Error al seguir al usuario');
    }
  }
}