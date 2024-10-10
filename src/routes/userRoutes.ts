import { FastifyInstance } from 'fastify';
import * as controllers from '../controllers';
import { loginModel, signupModel } from '../models/user';
import { utils } from '../utils/utils';

async function userRouter(fastify: FastifyInstance) {
    fastify.post(
        '/login',
        {
            schema: {
                body: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string', minLength: 8 },
                    },
                },
            },
            preValidation: utils.preValidation(loginModel),
        },
        controllers.login,
    );
    fastify.post(
        '/signup',
        {
            schema: {
                body: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string', minLength: 8 },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                    },
                },
            },
            preValidation: utils.preValidation(signupModel),
        },
        controllers.signUp,
    );
}

export default userRouter;
