import { z } from 'zod';

// Schema para actualizar foto de perfil
export const updateProfilePictureSchema = z.object({
  profilePicture: z.string()
    .min(1, 'La imagen es requerida en formato base64')
});

// Schema para actualizar banner
export const updateBannerSchema = z.object({
  banner: z.string()
    .min(1, 'La imagen del banner es requerida en formato base64')
});

// Schema para actualizar información del perfil
export const updateProfileInfoSchema = z.object({
  username: z.string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(50, 'El nombre de usuario no puede tener más de 50 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'El nombre de usuario solo puede contener letras, números y guiones bajos')
    .optional(),
  
  biography: z.string()
    .max(500, 'La biografía no puede tener más de 500 caracteres')
    .optional(),
  
  favoriteGenres: z.array(
    z.number().int().positive('Los IDs de géneros deben ser números positivos')
  ).optional()
});

// Tipos TypeScript derivados de los schemas
export type UpdateProfilePictureType = z.infer<typeof updateProfilePictureSchema>;
export type UpdateBannerType = z.infer<typeof updateBannerSchema>;
export type UpdateProfileInfoType = z.infer<typeof updateProfileInfoSchema>;

// Tipos para las respuestas
export interface OwnProfileResponse {
  id: bigint;
  username: string;
  email: string;
  friendCode: string | null;
  profilePicture: string | null;
  banner: string | null;
  biography: string | null;
  createdAt: Date;
  favoriteGenres: Array<{
    id: bigint;
    name: string;
  }>;
  likedBooks: Array<{
    id: bigint;
    title: string;
    description: string | null;
    coverImage: string | null;
    author: {
      username: string;
    };
  }>;
  ownBooks: Array<{
    id: bigint;
    title: string;
    description: string | null;
    coverImage: string | null;
    published: boolean;
    createdAt: Date;
  }>;
  stats: {
    friendsCount: number;
    followersCount: number;
    booksWritten: number;
    booksLiked: number;
  };
}

export interface UserProfileResponse {
  id: bigint;
  username: string;
  friendCode: string | null;
  profilePicture: string | null;
  banner: string | null;
  biography: string | null;
  createdAt: Date;
  favoriteGenres: Array<{
    id: bigint;
    name: string;
  }>;
  publishedBooks: Array<{
    id: bigint;
    title: string;
    description: string | null;
    coverImage: string | null;
    createdAt: Date;
  }>;
  stats: {
    followersCount: number;
    booksPublished: number;
  };
}