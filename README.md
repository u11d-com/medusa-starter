![v2 Build Status](https://img.shields.io/github/actions/workflow/status/u11d-com/medusa-starter/docker_build_v2.yml?branch=v2&label=Medusa%20v2%20build) ![v1 Build Status](https://img.shields.io/github/actions/workflow/status/u11d-com/medusa-starter/docker_build_v1.yml?branch=v1&label=Medusa%20v1%20build)

# Project Starter Templates for Medusa Commerce Platform

## Introduction
This project provides developers with starter templates for both the backend and storefront using the **Medusa framework**. The primary objectives are to demonstrate:

- How to configure a development environment using **Docker Compose**.
- How to structure a **GitHub workflow pipeline** for building and deploying a Medusa project.

## About Medusa
[Medusa](https://medusajs.com/) is a modular commerce framework designed for building advanced e-commerce applications without reinventing core commerce logic. Medusa’s flexible architecture allows developers to create:

- Scalable e-commerce stores
- Multi-vendor marketplaces
- Any application requiring foundational commerce functionality

All modules are open-source and available on npm, providing full customization and extensibility.


## Project Structure Overview
The `medusa-starter` repository is organized to provide a clear, modular structure for managing both the backend and storefront of a Medusa-based commerce platform. The setup leverages Docker Compose for service orchestration and includes essential configuration files for streamlined development, testing, and deployment.

### Directory Layout
```bash
medusa-starter/
├── .github/                 # GitHub workflows and automation scripts
├── .vscode/                 # VS Code workspace settings
├── backend/                 # Medusa backend services
│   ├── .dockerignore        # Defines files to exclude from Docker builds
│   ├── Dockerfile           # Instructions to build the backend Docker image
│   └── start.sh             # Script to handle migrations, admin user creation, and start backend
├── storefront/              # Next.js storefront application
│   ├── .dockerignore        # Defines files to exclude from Docker builds
│   └── Dockerfile           # Instructions to build the storefront Docker image
├── .editorconfig            # Maintains consistent coding styles
├── compose.seed.yaml        # Docker Compose file for database seeding
├── compose.storefront.yaml  # Docker Compose file for storefront services
├── compose.yaml             # Main Docker Compose file orchestrating all services
├── LICENSE                  # License information
└── README.md                # Project documentation
```

### Key Components
- `.github/` - Contains GitHub Actions workflows to automate CI/CD processes, ensuring smooth integration and deployment pipelines.
- `.vscode/` - Houses workspace settings to standardize development environments across teams using Visual Studio Code.
- `backend/` - This directory includes the Medusa backend setup:
  - `.dockerignore`: Lists files and directories to ignore during Docker builds.
  - `Dockerfile`: Defines the build instructions for the backend container.
  - `start.sh`: A shell script to automate database migrations, create an admin user if necessary, and start the Medusa backend in cluster mode.
- `storefront/` - The Next.js storefront application:
  - `.dockerignore`: Specifies files to exclude from the Docker image build.
  - `Dockerfile`: Instructions for building the storefront Docker image.
- Docker Compose Files:
  - `compose.yaml`: The primary file orchestrating PostgreSQL, Redis, and the Medusa backend services.
  - `compose.storefront.yaml`: Manages the storefront container separately to ensure modular service management.
  - `compose.seed.yaml`: Handles database seeding tasks.
  - `compose.db.yaml`: Can be used to deploy database separately.
- Other Configurations:
  - `.editorconfig`: Ensures consistent code formatting across different editors and IDEs.
  - `LICENSE`: Provides licensing information for the repository.
  - `README.md`: Offers comprehensive project documentation.

## Installation & Setup

### Prerequisites
Ensure you have the following installed:

- [Docker](https://docs.docker.com/get-started/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

### Cloning the Repository
Run the following command:

```bash
git clone https://github.com/u11d-com/medusa-starter.git
cd medusa-starter
```

## Setup Using Medusa CLI

You can use the `create-medusa-app` command to generate a starter Medusa project.

### 1. Start Databases
Run the following command to start the database services:

```bash
docker compose -f compose.db.yaml up -d
```

- **PostgreSQL** will be available at `localhost:5432`.
- **Redis** will be available at `localhost:6379`.
- Default credentials:

  ```plaintext
  POSTGRES_USER: medusa-starter
  POSTGRES_PASSWORD: medusa-password
  POSTGRES_DB: medusa-starter
  ```

Modify `compose.db.yaml` to change these values.

### 2. Create a Medusa Project
Follow the [Medusa installation guide](https://docs.medusajs.com/learn/installation) to create your first project using `create-medusa-app`.

### 3. Add Containerization
Use the Docker setup provided in this repository to containerize your project. Copy files from the `backend` and `storefront` directories to their respective locations in your project. Then, use these files to build Docker images for your application.

## Setup Using Git

### 1. Initialize the Backend Repository

Run the following commands:

```bash
cd backend
git init
git remote add origin https://github.com/medusajs/medusa-starter-default.git
git pull origin master
cd ..
```

This sets up the Medusa backend starter template (Medusa v2).

### 2. Initialize the Storefront Repository

Run the following commands:

```bash
cd storefront
git init
git remote add origin https://github.com/medusajs/nextjs-starter-medusa.git
git pull origin main
cd ..
```

This sets up the Medusa storefront starter template (Medusa v2).

---

## Running the Development Environment

### 1. Start the Medusa Backend and Services

```bash
docker compose up --build -d
```

### 2. Seed the Database

Run this command once (unless the database volume is deleted):

```bash
docker compose -f compose.seed.yaml run --rm seed
```

### 3. Start the Storefront
You need NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY value from Medusa backend admin panel.
Log in to `localhost:9000/app` with credentials from `compose.yaml` file:

  ```plaintext
  MEDUSA_ADMIN_EMAIL: admin@medusa-test.com
  MEDUSA_ADMIN_PASSWORD: supersecret
  ```
You can find publishable key value in dashboard settings. Change it's value in `compose.storefront.yaml` file and run command:

```bash
docker compose -f compose.storefront.yaml up --build
```

### 4. Stopping the Development Environment

To stop services, run:

- Stop the storefront:

  ```bash
  docker compose -f compose.storefront.yaml down
  ```

- Stop the backend and other services:

  ```bash
  docker compose down
  ```

---

## Notes

- `docker compose up -d` initializes the backend services for Medusa.
- The database seeding step pre-populates the database with sample data and is only required when setting up a new database.
- Storefront services are started separately for better modularity.
- Shutting down the environment when not in use frees system resources.

Your environment should now be up and running! You can access the storefront and backend services as configured in the compose files.

---

## Customization

This project is designed to be flexible.

### Replacing the Default Templates

You can replace the backend and storefront templates with your own code while preserving the following essential files:

- `Dockerfile`
- `.dockerignore`

### Backend Customization

The backend runs on **Node.js** and can be customized using **TypeScript**. Replace the provided template with your own implementation while ensuring compatibility with Medusa.

### Storefront Customization

The storefront runs on **Next.js**. To create a new storefront, use:

```bash
npx create-next-app@latest
```

Once your custom backend and storefront are ready, the provided Docker Compose configuration will handle deployment.

---

## Deployment

This project includes a pre-configured **GitHub workflow pipeline** for building and deploying Medusa-based applications.

### Image Tags

The workflow generates images with the following tags:

- `medusajs-backend:<tag>`
- `medusajs-storefront:<tag>`

(Replace `<tag>` with the version or commit identifier.)

For Medusa v1, we provide the latest available starter configuration:

- `medusajs-backend:1.20.10-latest`
- `medusajs-storefront:1.18.1-latest`

For Medusa v2, we provide the latest available starter configuration:

- `medusajs-backend:<medusa-version>-latest`
- `medusajs-storefront:<medusa-version>-latest`

### Customizing Deployment

The GitHub workflow can be customized for different cloud providers (e.g., AWS, Google Cloud). Modify `.github/workflows` to:

- Add deployment steps.
- Configure cloud provider settings.
- Integrate with CI/CD pipelines.

This ensures flexibility for production environments.

---

## Appendices

### Contact Information

For support or inquiries, visit:

[Uninterrupted](https://uninterrupted.tech/)

---
:heart: _Technology made with passion by u11d_
