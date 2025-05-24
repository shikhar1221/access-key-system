# Access Key System

This repository contains two microservices:

1.  **Key Management Service**: Manages the creation, retrieval, and deletion of access keys.
2.  **Token Info Service**: Handles token-related information and rate limiting.

## Prerequisites

Before running the services, ensure you have the following installed:

*   Node.js (v14 or higher recommended)
*   npm or yarn
*   Docker and Docker Compose (for database and Redis)

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

3.  **Start the databases and Redis using Docker Compose:**

    Navigate to the root of the project and run:

    ```bash
    docker-compose up -d
    ```

    This will start the PostgreSQL database and Redis instances required by the services.

4.  **Install dependencies for each service:**

    Navigate into each service directory and install dependencies:

    ```bash
    cd key-management-service
    npm install # or yarn install
    cd ../token-info-service
    npm install # or yarn install
    cd ..
    ```

## Running the Microservices

After completing the setup, you can run the services using Docker Compose.

1.  **Build and run the Docker containers:**

    Navigate to the root of the project and run:

    ```bash
    docker-compose up --build -d
    ```

    This command will build the Docker images for both services (based on the Dockerfiles created) and start the containers, along with the database and Redis containers.

2.  **Verify the running containers:**

    You can check the status of the running containers with:

    ```bash
    docker-compose ps
    ```

3.  **Access the services:**

    The services should be accessible on the ports defined in the `docker-compose.yml` file (e.g., 3000 for Key Management Service and 3001 for Token Info Service, update if necessary).

4.  **Stop the services:**

    To stop the running containers, navigate to the root of the project and run:

    ```bash
    docker-compose down
    ```

Alternatively, you can still run the services individually as described below, but using Docker Compose is recommended for a complete environment.

### Running Individually (Alternative)

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