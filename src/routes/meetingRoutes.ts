import { FastifyInstance } from 'fastify';
import * as controllers from '../controllers';
import { checkValidRequest, checkValidUser } from '../helpers/authHelper';
import { meetingCreateModel, meetingUpdateModel } from '../models/meeting';
import { utils } from '../utils/utils';


async function meetingRouter(fastify: FastifyInstance) {
    fastify.decorateRequest('authUser', null);
    fastify.post('/',
      {
        schema: {
          body: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              date_start: { type: 'string', format: 'date-time' },
              date_end: { type: 'string', format: 'date-time' },
            },
            required: ['date_start', 'date_end', 'title'],
          },
        },
        preValidation: utils.preValidation(meetingCreateModel),
        preHandler: [checkValidRequest, checkValidUser],
      },
      controllers.createMeeting,
    );
    fastify.put('/',
      {
        schema: {
          body: {
            type: 'object',
            properties: {
              meetingId: { type: 'number' },
              title: { type: 'string' },
              date_start: { type: 'string', format: 'date-time' },
              date_end: { type: 'string', format: 'date-time' },
            },
            required: ['meetingId', 'date_start', 'date_end', 'title'],
          },
        },
        preValidation: utils.preValidation(meetingUpdateModel),
        preHandler: [checkValidRequest, checkValidUser],
      },
      controllers.updateMeeting,
    );
    fastify.get('/',
      {
        preHandler: [checkValidRequest, checkValidUser],
      },
      controllers.getMeetingsByUser,
    );
    fastify.get('/:meetingId',
      {
        schema: {
          params: {
            type: 'object',
            properties: {
              meetingId: { type: 'integer' },
            },
            required: ['meetingId'],
          },
        },
        preHandler: [checkValidRequest, checkValidUser],
      },
      controllers.getMeetingById,
    );
    fastify.delete( '/:meetingId',
      {
        schema: {
          params: {
            type: 'object',
            properties: {
              meetingId: { type: 'integer' },
            },
            required: ['meetingId'],
          },
        },
        preHandler: [checkValidRequest, checkValidUser],
      },
      controllers.deleteMeeting,
    );
}
  
export default meetingRouter;