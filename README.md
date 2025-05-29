# Access Key System

This repository contains two microservices:

1.  **Key Management Service**: Manages the creation, retrieval, and deletion of access keys.
2.  **Token Info Service**: Handles token-related information and rate limiting.

## Prerequisites

Before running the services, ensure you have the following installed:

*   Node.js (v20 or higher recommended)
*   npm or yarn

## Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/shikhar1221/access-key-system.git
    cd access-key-system
    ```

2.  **Set up environment variables:**

    Each service has an `.env` file. Copy the `.env.example` files (if they exist) or create `.env` files in the `key-management-service` and `token-info-service` directories based on your configuration.

    ```bash
    cp key-management-service/.env.example key-management-service/.env
    cp token-info-service/.env.example token-info-service/.env
    # Edit the .env files with your specific configurations
    ```

3.  **Set up PostgreSQL:**

    Install PostgreSQL and create a database and user. Ensure the credentials match the `DATABASE_URL` in your `.env` files. Example `DATABASE_URL` format:

    ```
    postgresql://[user]:[password]@[host]:[port]/[database]
    ```

4.  **Set up Redis:**

    Install and run a Redis server. Ensure the connection details match the `REDIS_URL` in your `.env` files. Example `REDIS_URL` format:

    ```
    redis://[host]:[port]
    ```

After setting up the database and Redis manually, you can follow the "Running Individually (Alternative)" steps above to start the Key Management Service and Token Info Service.

4.  **Install dependencies for each service:**

    Navigate into each service directory and install dependencies:

    ```bash
    cd key-management-service
    npm install --legacy-peer-deps # or yarn install
    cd ../token-info-service
    npm install --legacy-peer-deps # or yarn install
    cd ..
    ```

## Running the Microservices

After completing the setup, you can run each service individually.

### Key Management Service

Navigate to the `key-management-service` directory and run:

```bash
cd key-management-service
npm run start:dev # or yarn start:dev
```

This will start the Key Management Service in development mode.

### Token Info Service

Navigate to the `token-info-service` directory and run:

```bash
cd token-info-service
npm run start:dev # or yarn start:dev
```

This will start the Token Info Service in development mode.

Both services should now be running and connected to the database and Redis.

## Running with Docker Compose

To run both services and their dependencies (PostgreSQL and Redis) using Docker Compose, navigate to the root directory of the project and run:

```bash
docker-compose up -d --build
```

This command will build the Docker images for both services (if they haven't been built yet or if there are changes) and start all containers in detached mode.

To run tests within the Docker containers:

```bash
docker exec key_management_service npm run test:e2e
docker exec token_info_service npm run test:e2e
```

PS: The swagger-doc for APIs is available at localhost:3000/api and localhost:5000/api. For testing, symbols like ETH, BTC, etc., can be used in token info service.
