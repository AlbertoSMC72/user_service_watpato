// src/repos/profileRepository.ts
import { PrismaClient, Prisma } from '@prisma/client';
import { UpdateProfileInfoType } from '../models/profileModels';
import { serializeBigInt } from '../utils/bigintHelper';

const prisma = new PrismaClient();

export class ProfileRepository {
  
  static async getUserById(userId: number) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: BigInt(userId) },
        select: {
          id: true,
          username: true,
          email: true,
          friendCode: true,
          profilePicture: true,
          banner: true,
          biography: true,
          createdAt: true
        }
      });
      
      return user ? serializeBigInt(user) : null;
    } catch (error) {
      console.error('Error en ProfileRepository.getUserById:', error);
      throw error;
    }
  }

  static async getFavoriteGenres(userId: number) {
    try {
      const userWithGenres = await prisma.user.findUnique({
        where: { id: BigInt(userId) },
        include: {
          userFavGenres: {
            include: {
              genre: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      });

      const genres = userWithGenres?.userFavGenres.map((ufg: { genre: { id: bigint; name: string } }) => ufg.genre) || [];
      return serializeBigInt(genres);
    } catch (error) {
      console.error('Error en ProfileRepository.getFavoriteGenres:', error);
      throw error;
    }
  }

  static async getLikedBooks(userId: number) {
    try {
      const likedBooks = await prisma.bookLike.findMany({
        where: { 
          userId: BigInt(userId) 
        },
        include: {
          book: {
            include: {
              author: {
                select: {
                  username: true
                }
              }
            }
          }
        }
      });

      // Mapear y filtrar libros con autores válidos
      const books = likedBooks
        .filter((like: any) => like.book.author !== null)
        .map((like: any) => ({
          id: like.book.id,
          title: like.book.title,
          description: like.book.description,
          coverImage: like.book.coverImage,
          author: {
            username: like.book.author!.username
          }
        }));
        
      return serializeBigInt(books);
    } catch (error) {
      console.error('Error en ProfileRepository.getLikedBooks:', error);
      throw error;
    }
  }

  static async getOwnBooks(userId: number) {
    try {
      const books = await prisma.book.findMany({
        where: { authorId: BigInt(userId) },
        select: {
          id: true,
          title: true,
          description: true,
          coverImage: true,
          published: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      });
      
      return serializeBigInt(books);
    } catch (error) {
      console.error('Error en ProfileRepository.getOwnBooks:', error);
      throw error;
    }
  }

  static async getPublishedBooks(userId: number) {
    try {
      const books = await prisma.book.findMany({
        where: { 
          authorId: BigInt(userId),
          published: true 
        },
        select: {
          id: true,
          title: true,
          description: true,
          coverImage: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      });
      
      return serializeBigInt(books);
    } catch (error) {
      console.error('Error en ProfileRepository.getPublishedBooks:', error);
      throw error;
    }
  }

  static async getUserStats(userId: number) {
    try {
      const [friendsCount, followersCount, booksWritten, booksLiked] = await Promise.all([
        // Contar amigos
        prisma.userFriend.count({
          where: { userId: BigInt(userId) }
        }),
        // Contar seguidores
        prisma.userSubscription.count({
          where: { userId: BigInt(userId) }
        }),
        // Contar libros escritos
        prisma.book.count({
          where: { authorId: BigInt(userId) }
        }),
        // Contar libros que le gustan
        prisma.bookLike.count({
          where: { userId: BigInt(userId) }
        })
      ]);

      return {
        friendsCount,
        followersCount,
        booksWritten,
        booksLiked
      };
    } catch (error) {
      console.error('Error en ProfileRepository.getUserStats:', error);
      throw error;
    }
  }

  static async getPublicStats(userId: number) {
    try {
      const [followersCount, booksPublished] = await Promise.all([
        // Contar seguidores
        prisma.userSubscription.count({
          where: { userId: BigInt(userId) }
        }),
        // Contar libros publicados
        prisma.book.count({
          where: { 
            authorId: BigInt(userId),
            published: true 
          }
        })
      ]);

      return {
        followersCount,
        booksPublished
      };
    } catch (error) {
      console.error('Error en ProfileRepository.getPublicStats:', error);
      throw error;
    }
  }

  static async userExists(userId: number): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: BigInt(userId) }
      });
      return !!user;
    } catch (error) {
      console.error('Error en ProfileRepository.userExists:', error);
      throw error;
    }
  }

  static async usernameExists(username: string, excludeUserId?: number): Promise<boolean> {
    try {
      const user = await prisma.user.findFirst({
        where: {
          username,
          ...(excludeUserId && { id: { not: BigInt(excludeUserId) } })
        }
      });
      return !!user;
    } catch (error) {
      console.error('Error en ProfileRepository.usernameExists:', error);
      throw error;
    }
  }

  static async validateGenres(genreIds: number[]): Promise<boolean> {
    try {
      const count = await prisma.genre.count({
        where: {
          id: { in: genreIds.map(id => BigInt(id)) }
        }
      });
      return count === genreIds.length;
    } catch (error) {
      console.error('Error en ProfileRepository.validateGenres:', error);
      throw error;
    }
  }

  static async updateProfilePicture(userId: number, profilePicture: string) {
    try {
      const user = await prisma.user.update({
        where: { id: BigInt(userId) },
        data: { profilePicture },
        select: {
          id: true,
          username: true,
          profilePicture: true
        }
      });
      
      return serializeBigInt(user);
    } catch (error) {
      console.error('Error en ProfileRepository.updateProfilePicture:', error);
      throw error;
    }
  }

  static async updateBanner(userId: number, banner: string) {
    try {
      const user = await prisma.user.update({
        where: { id: BigInt(userId) },
        data: { banner },
        select: {
          id: true,
          username: true,
          banner: true
        }
      });
      
      return serializeBigInt(user);
    } catch (error) {
      console.error('Error en ProfileRepository.updateBanner:', error);
      throw error;
    }
  }

  static async updateProfileInfo(userId: number, profileData: UpdateProfileInfoType) {
    try {
      // Usar una transacción para actualizar tanto el usuario como los géneros favoritos
      const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // Actualizar información básica del usuario
        const updatedUser = await tx.user.update({
          where: { id: BigInt(userId) },
          data: {
            ...(profileData.username && { username: profileData.username }),
            ...(profileData.biography !== undefined && { biography: profileData.biography })
          },
          select: {
            id: true,
            username: true,
            biography: true
          }
        });

        // Actualizar géneros favoritos si se proporcionan
        if (profileData.favoriteGenres) {
          // Eliminar géneros favoritos existentes
          await tx.userFavGenre.deleteMany({
            where: { userId: BigInt(userId) }
          });

          // Agregar nuevos géneros favoritos
          if (profileData.favoriteGenres.length > 0) {
            await tx.userFavGenre.createMany({
              data: profileData.favoriteGenres.map(genreId => ({
                userId: BigInt(userId),
                genreId: BigInt(genreId)
              }))
            });
          }
        }

        // Obtener géneros favoritos actualizados
        const favoriteGenres = await tx.userFavGenre.findMany({
          where: { userId: BigInt(userId) },
          include: {
            genre: {
              select: {
                id: true,
                name: true
              }
            }
          }
        });

        return {
          ...updatedUser,
          favoriteGenres: favoriteGenres.map((ufg: { genre: { id: bigint; name: string } }) => ufg.genre)
        };
      });
      
      return serializeBigInt(result);
    } catch (error) {
      console.error('Error en ProfileRepository.updateProfileInfo:', error);
      throw error;
    }
  }
}