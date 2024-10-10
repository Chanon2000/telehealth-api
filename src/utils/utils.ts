import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { FastifyReply, FastifyRequest } from 'fastify';
import Joi from 'joi';
import * as JWT from 'jsonwebtoken';

export const prisma = new PrismaClient();

export const utils = {
    genSalt: (saltRounds: number, value: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(saltRounds, (err, salt) => {
                if (err) return reject(err);
                bcrypt.hash(value, salt, (err, hash) => {
                if (err) return reject(err);
                    resolve(hash);
                });
            });
        });
    },
    compareHash: (hash: string, value: string): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(value, hash, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    },
    getTokenFromHeader: (authorizationHeader: string | undefined,): string | null => {
        if (!authorizationHeader) return null;
        const token = authorizationHeader.replace('Bearer ', '');
        return token || null;
    },
    verifyToken: (token: string): any => {
        try {
            return JWT.verify(token, process.env.APP_JWT_SECRET as string);
        } catch (err) {
            return null;
        }
    },
    validateSchema: (schema: Joi.ObjectSchema) => {
        return (data: any) => {
          const { error } = schema.validate(data);
            if (error) {
                throw new Error(error.details[0].message);
            }
        };
    },
    preValidation: (schema: Joi.ObjectSchema) => {
      return (
        request: FastifyRequest,
        reply: FastifyReply,
        done: (err?: Error) => void,
      ) => {
        const { error } = schema.validate(request.body);
        if (error) {
          return done(error);
        }
        done();
      };
    },
    isOverlappingMeeting: async (id: number, date_start: Date, date_end: Date) => {
        return (await prisma.meeting.count({
            where: {
                userId: id,
                AND: [
                    {
                        date_start: {
                            lte: date_end,
                        },
                    },
                    {
                        date_end: {
                            gte: date_start,
                        },
                    },
                ],
            },
        })) > 0
    }
};
  