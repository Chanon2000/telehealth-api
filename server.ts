import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import Fastify from 'fastify';
import loadConfig from './src/config/env.config';
import meetingRouter from './src/routes/meetingRoutes';
import userRouter from './src/routes/userRoutes';

loadConfig();

const port = Number(process.env.API_PORT) || 8000;
const host = String(process.env.API_HOST);

const fastify = Fastify({
  logger: true,
});

// Declare a route
fastify.get('/', function (request, reply) {
  reply.send({ hello: 'world' });
});

fastify.register(cors, {
  origin: ['http://localhost:8000'],
});
fastify.register(helmet);

const swaggerOptions = {
  swagger: {
      info: {
          title: "Telehealth API Documentation",
          description: "The Telehealth system includes 7 main API routes for managing patient appointments: Patients can view all appointments, get details of a specific appointment, create a new appointment, update an existing appointment, and cancel an appointment. Additionally, patients can retrieve information about available doctors for scheduling appointments.",
          version: "1.0.0",
      },
      schemes: ["http", "https"],
      consumes: ["application/json"],
      produces: ["application/json"],
  },
};

const swaggerUiOptions = {
  routePrefix: "/docs",
  exposeRoute: true,
};

fastify.register(fastifySwagger, swaggerOptions);
fastify.register(fastifySwaggerUi, swaggerUiOptions);

fastify.register(userRouter, { prefix: '/api/user' });
fastify.register(meetingRouter, { prefix: '/api/meeting' });

// Run the server!
fastify.listen({ port, host }, function (err, _address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  // Server is now listening on ${address}
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});