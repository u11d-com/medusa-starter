# Project Starter Templates for Medusa Commerce Platform

## Introduction
This project provides starter templates to help developers set up both the backend and storefront for the **Medusa** platform (version v1). Its primary goals are to demonstrate:

- How to configure a development environment using **Docker Compose**.
- How to structure a **GitHub workflow pipeline** for building a product-ready applications.

## About Medusa
[Medusa](https://medusajs.com/) is a set of commerce modules and tools designed to enable the creation of rich, reliable, and performant commerce applications without reinventing core commerce logic. Medusa’s flexible modules can be customized to build:
- Advanced e-commerce stores
- Marketplaces
- Any product requiring foundational commerce features

All modules are open-source and available on npm, giving developers full control and extensibility.

---

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
- Other Configurations:
  - `.editorconfig`: Ensures consistent code formatting across different editors and IDEs.
  - `LICENSE`: Provides licensing information for the repository.
  - `README.md`: Offers comprehensive project documentation.

### Detailed Script Overview: `start.sh`
The `start.sh` script automates critical backend initialization processes, improving consistency and reducing manual intervention. Here’s a breakdown of its functionality:

#### Script Functions
1. Database Migration
If the `MEDUSA_RUN_MIGRATION` environment variable is set to `true` (default), the script runs Medusa's database migrations to ensure the schema is up-to-date:
```bash
npx medusa migrations run
```

2. Admin User Creation
If `MEDUSA_CREATE_ADMIN_USER` is set to `true`, the script attempts to create an admin user using the provided credentials:
```bash
npx medusa user -e "$MEDUSA_ADMIN_EMAIL" -p "$MEDUSA_ADMIN_PASSWORD"
```
- If the user already exists, it logs a message and continues.
- If the creation fails for other reasons, the script exits with an error code.

3. Starting Medusa Backend
Finally, the script starts the Medusa backend in cluster mode:
```bash
exec node_modules/.bin/medusa start-cluster
```

#### Environment Variables
- `MEDUSA_RUN_MIGRATION` (default: true): Controls whether database migrations are executed.
- `MEDUSA_CREATE_ADMIN_USER` (default: false): Determines if an admin user should be created.
- `MEDUSA_ADMIN_EMAIL`: Specifies the email address for the admin account (required if creating an admin user).
- `MEDUSA_ADMIN_PASSWORD`: Password for the admin account (required if creating an admin user).

#### Best Practices
- Error Handling: The script gracefully handles known errors, like existing users, and fails fast on unexpected issues.
- Idempotency: Running the script multiple times won't create duplicate users or reapply migrations unnecessarily.
- Extensibility: Easy to modify for additional initialization steps as project requirements evolve.

By automating these critical tasks, `start.sh` ensures consistent backend setups across different environments, reducing potential configuration drift and deployment issues.

## Docker Compose Configuration Files
The project utilizes three Docker Compose files to manage different aspects of the development environment. Each file is designed to handle specific services and workflows, ensuring modularity and ease of maintenance.

### Backend and Core Services ([`compose.yaml`](compose.yaml))
This file defines the core infrastructure needed to run the Medusa backend. It orchestrates essential services like the PostgreSQL database, Redis cache, and the Medusa backend server. The goal is to create a reliable environment where the backend can operate efficiently, ensuring data storage, fast caching, and proper API responses. It also manages service dependencies to ensure everything starts in the correct order for smooth operation.

### Storefront Services ([`compose.storefront.yaml`](compose.storefront.yaml))
This file handles the deployment of the storefront, which is the customer-facing part of the application. It focuses on building and running the Next.js - based frontend, connecting it seamlessly with the backend services. Its primary purpose is to ensure that the storefront is performant, properly linked to backend APIs, and ready to deliver a responsive user experience.

### Database Seeding ([`compose.seed.yaml`](compose.seed.yaml))
This file is designed for one-time tasks, specifically populating the database with initial data. It helps set up sample products, users, and configurations to provide a functional environment for development and testing. It’s typically used after the first setup or when resetting the environment to its default state.


## Installation & Setup

### Prerequisites
Ensure you have the following installed on your system:

- [Docker](https://docs.docker.com/get-started/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Setting Up Repositories
1. Set up the backend repository

   Run commands below:
    ```bash
    cd backend
    git init
    git remote add origin git@github.com:medusajs/medusa-starter-default.git
    git fetch --depth 1 origin 46de582ea7af0f80718e745e89407c407634aa46
    git checkout 46de582ea7af0f80718e745e89407c407634aa46
    cd ..
    ```

   This initializes the Medusa backend starter template based on Medusa `v1`.

2. Set up storefront repository

   Run commands below:
    ```bash
    cd storefront
    git init
    git remote add origin git@github.com:medusajs/nextjs-starter-medusa.git
    git fetch --depth 1 origin 0f5452dfe44838f890b798789d75db1a81303b7a
    git checkout 0f5452dfe44838f890b798789d75db1a81303b7a
    cd ..
    ```

   This initializes the Medusa storefront starter template based on Medusa `v1`.

## Setting Up the Environment

1. Start the Medusa backend and required services

   Run the following command to bring up the backend services in detached mode:
   ```bash
   docker compose up --build -d
   ```

2. Seed the database

   Run this **once** unless you delete the database volume:
   ```bash
   docker compose -f compose.seed.yaml run --rm seed
   ```

3. Start the storefront

   Bring up the storefront services using the following command:
   ```bash
   docker compose -f compose.storefront.yaml up --build
   ```

4. Shut down the development environment
   When you're done working and want to shut down the environment, use the following commands:

   - Stop the storefront:
     ```bash
     docker compose -f compose.storefront.yaml down
     ```
   - Stop the backend and other services:
     ```bash
     docker compose down
     ```

### Notes
- `docker compose up -d` starts the backend services required for Medusa.
- Database seeding populates initial data and should be repeated only if the database is reset.
- Storefront services are managed and launched separately using a dedicated compose file to maintain modularity.
- Use the shutdown commands to free system resources when not in use.

Your environment should now be up and running! You can access the storefront and backend services as configured in the compose files.

---

## Customization
This project is designed to be flexible and easily customizable. Follow the guidelines below to adapt it to your needs:

### Replacing the Existing Templates
You can replace the existing backend and storefront templates with your own code. Keep the following files:

- `Dockerfile`
- `.dockerignore`

These are essential for building and managing Docker containers correctly.

### Backend Customization
The backend is based on **Node.js**. For example, you can set up a **TypeScript** backend by replacing the existing code while ensuring compatibility with the Medusa framework.

### Storefront Customization
The storefront is built with **Next.js** framework. To create a new Next.js storefront project, you can use the following command:

```bash
npx create-next-app@latest
```

This will initialize a new Next.js application that you can customize and integrate with your Medusa backend.

Once you've replaced the templates and set up your custom backend and storefront, the Docker Compose configuration will handle the rest, ensuring a smooth development and deployment workflow.

---

## Deployment
This project includes a pre-configured **GitHub workflow pipeline** to automate the build and deployment process. The pipeline builds Docker images for demonstration purposes.

### Container Image Tags
The workflow will generate container images with predefined tags, such as:

- `medusajs-backend:<tag>`
- `medusajs-storefront:<tag>`

Note: Replace `<tag>` with the appropriate version or identifier as needed.

### Tag Format:
We provide tags in format: `<Medusa version>-<short commit sha>`. Tags in format `<Medusa version>-latest` provide latest version of image built based on specified Medusa version.

For Medusa `v1` we prepared two tags with latest available starter configuration:

- `medusajs-backend:1.20.10-latest`
- `medusajs-storefront:1.18.1-latest`

### Customizing the Deployment
Users can leverage the provided pipeline definitions to customize deployment to their preferred cloud providers, such as Amazon Web Services (AWS) or Google Cloud Services (GCS). Modify the workflow files in the `.github/workflows` directory to:

- Add specific deployment steps.
- Configure cloud provider settings.
- Integrate with CI/CD tools for advanced use cases.

This ensures flexibility across different environments for production-ready deployments.

---

## Contributing
We welcome contributions to this module! If you have bug fixes, new features, or documentation improvements, feel free to fork the repository, make your changes, and submit a pull request.

## License
This example is licensed under the [Apache-2.0 license](https://www.apache.org/licenses/LICENSE-2.0).

## Appendices

### Contact Information
For further assistance or inquiries, please contact us at:
- :email: [hello@u11d.com](mailto:hello@u11d.com)


---
:heart: _Technology made with passion by [u11d](https://u11d.com/)_
