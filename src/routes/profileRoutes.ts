// src/routes/profileRoutes.ts
import { Router } from 'express';
import { ProfileController } from '../controllers/profileController';

const router = Router();

/**
 * @swagger
 * /api/profile/me/{userId}:
 *   get:
 *     summary: Obtener perfil propio completo
 *     description: Obtiene toda la información del perfil del usuario autenticado, incluyendo datos privados como email, libros no publicados y estadísticas completas.
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único del usuario
 *         example: 1
 *     responses:
 *       200:
 *         description: Perfil obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/OwnProfile'
 *             example:
 *               success: true
 *               data:
 *                 id: "1"
 *                 username: "usuario123"
 *                 email: "usuario@example.com"
 *                 friendCode: "#USER123"
 *                 profilePicture: "https://example.com/profile.jpg"
 *                 banner: "https://example.com/banner.jpg"
 *                 biography: "Escritor apasionado de ciencia ficción"
 *                 createdAt: "2024-01-15T10:30:00Z"
 *                 favoriteGenres:
 *                   - id: "1"
 *                     name: "Ciencia Ficción"
 *                   - id: "2"
 *                     name: "Fantasía"
 *                 likedBooks: []
 *                 ownBooks: []
 *                 stats:
 *                   friendsCount: 15
 *                   followersCount: 42
 *                   booksWritten: 3
 *                   booksLiked: 28
 *       400:
 *         description: ID de usuario inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "ID de usuario inválido"
 *       404:
 *         description: Perfil no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Perfil no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/me/:userId', ProfileController.getOwnProfile);

/**
 * @swagger
 * /api/profile/user/{userId}:
 *   get:
 *     summary: Obtener perfil público de otro usuario
 *     description: Obtiene la información pública del perfil de otro usuario, excluyendo datos privados como email y libros no publicados.
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único del usuario a consultar
 *         example: 2
 *     responses:
 *       200:
 *         description: Perfil público obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/UserProfile'
 *             example:
 *               success: true
 *               data:
 *                 id: "2"
 *                 username: "otroautor"
 *                 friendCode: "#AUTOR456"
 *                 profilePicture: "https://example.com/profile2.jpg"
 *                 banner: "https://example.com/banner2.jpg"
 *                 biography: "Escritora de fantasía épica"
 *                 createdAt: "2023-11-20T08:15:00Z"
 *                 favoriteGenres:
 *                   - id: "2"
 *                     name: "Fantasía"
 *                   - id: "3"
 *                     name: "Aventura"
 *                 publishedBooks: []
 *                 stats:
 *                   followersCount: 156
 *                   booksPublished: 5
 *       400:
 *         description: ID de usuario inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/user/:userId', ProfileController.getUserProfile);

/**
 * @swagger
 * /api/profile/profile-picture/{userId}:
 *   patch:
 *     summary: Actualizar foto de perfil
 *     description: Actualiza únicamente la foto de perfil del usuario especificado.
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único del usuario
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfilePictureRequest'
 *           example:
 *             profilePicture: "https://example.com/nueva-foto.jpg"
 *     responses:
 *       200:
 *         description: Foto de perfil actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         username:
 *                           type: string
 *                         profilePicture:
 *                           type: string
 *             example:
 *               success: true
 *               message: "Foto de perfil actualizada exitosamente"
 *               data:
 *                 id: "1"
 *                 username: "usuario123"
 *                 profilePicture: "https://example.com/nueva-foto.jpg"
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/profile-picture/:userId', ProfileController.updateProfilePicture);

/**
 * @swagger
 * /api/profile/banner/{userId}:
 *   patch:
 *     summary: Actualizar imagen de banner
 *     description: Actualiza únicamente la imagen de banner del perfil del usuario especificado.
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único del usuario
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBannerRequest'
 *           example:
 *             banner: "https://example.com/nuevo-banner.jpg"
 *     responses:
 *       200:
 *         description: Imagen de banner actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         username:
 *                           type: string
 *                         banner:
 *                           type: string
 *             example:
 *               success: true
 *               message: "Imagen de banner actualizada exitosamente"
 *               data:
 *                 id: "1"
 *                 username: "usuario123"
 *                 banner: "https://example.com/nuevo-banner.jpg"
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/banner/:userId', ProfileController.updateBanner);

/**
 * @swagger
 * /api/profile/info/{userId}:
 *   patch:
 *     summary: Actualizar información del perfil
 *     description: Actualiza la información del perfil incluyendo username, biografía y géneros favoritos. Todos los campos son opcionales.
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único del usuario
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileInfoRequest'
 *           examples:
 *             updateAll:
 *               summary: Actualizar todos los campos
 *               value:
 *                 username: "nuevousuario123"
 *                 biography: "Nueva biografía actualizada"
 *                 favoriteGenres: [1, 2, 5]
 *             updateUsername:
 *               summary: Solo actualizar username
 *               value:
 *                 username: "nuevousuario123"
 *             updateGenres:
 *               summary: Solo actualizar géneros favoritos
 *               value:
 *                 favoriteGenres: [1, 3, 7, 10]
 *             clearBiography:
 *               summary: Limpiar biografía
 *               value:
 *                 biography: ""
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         username:
 *                           type: string
 *                         biography:
 *                           type: string
 *                           nullable: true
 *                         favoriteGenres:
 *                           type: array
 */
router.patch('/info/:userId', ProfileController.updateProfileInfo);

/**
 * @swagger
 * /api/profile/follow/{userId}/{targetUserId}:
 *   post:
 *     summary: Seguir o dejar de seguir a un usuario
 *     description: Alterna el estado de seguimiento de un usuario. Si ya lo sigues, lo dejas de seguir. Si no lo sigues, comienzas a seguirlo.
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del usuario que realiza la acción
 *         example: 1
 *       - in: path
 *         name: targetUserId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del usuario a seguir/dejar de seguir
 *         example: 2
 *     responses:
 *       200:
 *         description: Acción completada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         action:
 *                           type: string
 *                           enum: [followed, unfollowed]
 *                         message:
 *                           type: string
 *             examples:
 *               followed:
 *                 summary: Usuario seguido
 *                 value:
 *                   success: true
 *                   message: "Usuario seguido exitosamente"
 *                   data:
 *                     action: "followed"
 *                     message: "Usuario seguido exitosamente"
 *                     data:
 *                       id: "123"
 *                       userId: "1"
 *                       followerId: "2"
 *               unfollowed:
 *                 summary: Usuario dejado de seguir
 *                 value:
 *                   success: true
 *                   message: "Usuario dejado de seguir exitosamente"
 *                   data:
 *                     action: "unfollowed"
 *                     message: "Usuario dejado de seguir exitosamente"
 *       400:
 *         description: Datos inválidos o error en la operación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidIds:
 *                 summary: IDs inválidos
 *                 value:
 *                   success: false
 *                   message: "ID de usuario inválido"
 *               selfFollow:
 *                 summary: Intentar seguirse a sí mismo
 *                 value:
 *                   success: false
 *                   message: "No puedes seguirte a ti mismo"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/follow/:userId/:targetUserId', ProfileController.toggleFollowUser);

export default router;