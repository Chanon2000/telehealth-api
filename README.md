
# Fastify, Typescript, Prisma, MySQL

## How to use

### 1. Clone this repo 


### 2. Start API, Database and Adminer in docker
```sh
docker-compose up
```


## Access Swagger at http://localhost:8000/docs"
![swagger](./docs/swagger-image.png)

##  Database diagram
![database diagram](./docs/dbdiagram-image.png)

##  Access Database Adminer at http://localhost:8080/
![database diagram](./docs/adminer-image.png)


# Telehealth API Documentation

This API allows users to sign up, log in, and manage their appointments (meetings) in the Telehealth system. Users can create, update, delete, and retrieve meetings. The API also includes user authentication endpoints for login and signup.

## API Endpoints

### 1. POST /api/user/login

**Description**: Login a user into the system.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

### 2. POST /api/user/signup

**Description**: signup a user into the system.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "your_password",
  "firstName": "user_firstname",
  "lastName": "user_lastname",
}
```

### 3. POST /api/meeting/

**Description**: create a new meeting

**Request header**: Authorization: Bearer <token>

**Request Body**:
```json
{
  "title": "test 1",
  "date_start": "2024-10-13T06:48:12.423Z",
  "date_end": "2024-10-14T06:48:12.423Z"
}
```

### 4. PUT /api/meeting/

**Description**: Updates an existing meeting

**Request header**: Authorization: Bearer <token>

**Request Body**:

```json
{
    "meetingId": 1,
    "title": "test 1",
    "date_start": "2024-10-13T06:48:12.423Z",
    "date_end": "2024-10-14T06:48:12.423Z"
}
```

### 5. DELETE /api/meeting/:meetingId

**Description**: Updates an existing meeting

**Request header**: Authorization: Bearer <token>

### 6. GET /api/meeting/:meetingId

**Description**: Retrieves a specific meeting by its ID.

**Request header**: Authorization: Bearer <token>

### 7. GET /api/meeting/

**Description**: Retrieves all meetings for the logged-in user.

**Request header**: Authorization: Bearer <token>