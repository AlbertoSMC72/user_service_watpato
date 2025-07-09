import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Profile Microservice API',
      version: '1.0.0',
      description: 'API para la gestión de perfiles de usuario en Watpato',
      contact: {
        name: 'Equipo de Desarrollo',
        email: 'dev@watpato.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      },
      {
        url: 'https://api.watpato.com',
        description: 'Servidor de producción'
      }
    ],
    components: {
      schemas: {
        // Esquemas de respuesta
        OwnProfile: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único del usuario'
            },
            username: {
              type: 'string',
              description: 'Nombre de usuario'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Correo electrónico del usuario'
            },
            friendCode: {
              type: 'string',
              nullable: true,
              description: 'Código de amigo único'
            },
            profilePicture: {
              type: 'string',
              format: 'uri',
              nullable: true,
              description: 'URL de la foto de perfil'
            },
            banner: {
              type: 'string',
              format: 'uri',
              nullable: true,
              description: 'URL de la imagen de banner'
            },
            biography: {
              type: 'string',
              nullable: true,
              description: 'Biografía del usuario'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación de la cuenta'
            },
            favoriteGenres: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Genre'
              }
            },
            likedBooks: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/LikedBook'
              }
            },
            ownBooks: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/OwnBook'
              }
            },
            stats: {
              $ref: '#/components/schemas/UserStats'
            }
          }
        },
        UserProfile: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único del usuario'
            },
            username: {
              type: 'string',
              description: 'Nombre de usuario'
            },
            friendCode: {
              type: 'string',
              nullable: true,
              description: 'Código de amigo único'
            },
            profilePicture: {
              type: 'string',
              format: 'uri',
              nullable: true,
              description: 'URL de la foto de perfil'
            },
            banner: {
              type: 'string',
              format: 'uri',
              nullable: true,
              description: 'URL de la imagen de banner'
            },
            biography: {
              type: 'string',
              nullable: true,
              description: 'Biografía del usuario'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación de la cuenta'
            },
            favoriteGenres: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Genre'
              }
            },
            publishedBooks: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/PublishedBook'
              }
            },
            stats: {
              $ref: '#/components/schemas/PublicStats'
            }
          }
        },
        Genre: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único del género'
            },
            name: {
              type: 'string',
              description: 'Nombre del género'
            }
          }
        },
        LikedBook: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único del libro'
            },
            title: {
              type: 'string',
              description: 'Título del libro'
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Descripción del libro'
            },
            coverImage: {
              type: 'string',
              format: 'uri',
              nullable: true,
              description: 'URL de la portada del libro'
            },
            author: {
              type: 'object',
              properties: {
                username: {
                  type: 'string',
                  description: 'Nombre del autor'
                }
              }
            }
          }
        },
        OwnBook: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único del libro'
            },
            title: {
              type: 'string',
              description: 'Título del libro'
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Descripción del libro'
            },
            coverImage: {
              type: 'string',
              format: 'uri',
              nullable: true,
              description: 'URL de la portada del libro'
            },
            published: {
              type: 'boolean',
              description: 'Si el libro está publicado'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación del libro'
            }
          }
        },
        PublishedBook: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único del libro'
            },
            title: {
              type: 'string',
              description: 'Título del libro'
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Descripción del libro'
            },
            coverImage: {
              type: 'string',
              format: 'uri',
              nullable: true,
              description: 'URL de la portada del libro'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de publicación del libro'
            }
          }
        },
        UserStats: {
          type: 'object',
          properties: {
            friendsCount: {
              type: 'integer',
              description: 'Número de amigos'
            },
            followersCount: {
              type: 'integer',
              description: 'Número de seguidores'
            },
            booksWritten: {
              type: 'integer',
              description: 'Número de libros escritos'
            },
            booksLiked: {
              type: 'integer',
              description: 'Número de libros que le gustan'
            }
          }
        },
        PublicStats: {
          type: 'object',
          properties: {
            followersCount: {
              type: 'integer',
              description: 'Número de seguidores'
            },
            booksPublished: {
              type: 'integer',
              description: 'Número de libros publicados'
            }
          }
        },
        // Esquemas de request
        UpdateProfilePictureRequest: {
          type: 'object',
          required: ['profilePicture'],
          properties: {
            profilePicture: {
              type: 'string',
              format: 'uri',
              description: 'URL de la nueva foto de perfil'
            }
          }
        },
        UpdateBannerRequest: {
          type: 'object',
          required: ['banner'],
          properties: {
            banner: {
              type: 'string',
              format: 'uri',
              description: 'URL de la nueva imagen de banner'
            }
          }
        },
        UpdateProfileInfoRequest: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              minLength: 3,
              maxLength: 50,
              pattern: '^[a-zA-Z0-9_]+$',
              description: 'Nuevo nombre de usuario (solo letras, números y guiones bajos)'
            },
            biography: {
              type: 'string',
              maxLength: 500,
              description: 'Nueva biografía del usuario'
            },
            favoriteGenres: {
              type: 'array',
              items: {
                type: 'integer',
                minimum: 1
              },
              description: 'Array de IDs de géneros favoritos'
            }
          }
        },
        // Esquemas de respuesta estándar
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              description: 'Mensaje descriptivo del resultado'
            },
            data: {
              type: 'object',
              description: 'Datos de respuesta'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Mensaje de error'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  code: {
                    type: 'string'
                  },
                  message: {
                    type: 'string'
                  },
                  path: {
                    type: 'array',
                    items: {
                      type: 'string'
                    }
                  }
                }
              },
              description: 'Detalles específicos de los errores de validación'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts'], // Ruta a los archivos que contienen las anotaciones
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Profile API Documentation'
  }));

  // Endpoint para obtener la especificación JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};