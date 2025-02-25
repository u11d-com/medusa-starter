![v2 Build](https://github.com/{owner}/{repo}/actions/workflows/docker_build_v2.yml/badge.svg) ![v1 Build](https://github.com/{owner}/{repo}/actions/workflows/docker_build_v1.yml/badge.svg)

# Project Starter Templates for MedusaJS

## Introduction
This project was created to assist developers with the initial setup of starter templates for both the backend and storefront using the **MedusaJS framework** in version v1. The primary goal is to demonstrate:

- How to configure the development environment using **Docker Compose**.
- How to structure a **GitHub workflow pipeline** for building a product ready for deployment.

## About MedusaJS
[MedusaJS](https://medusajs.com/) is a set of commerce modules and tools designed to enable the creation of rich, reliable, and performant commerce applications without the need to reinvent core commerce logic. Medusa's flexible modules can be customized and leveraged to build:

- Advanced ecommerce stores
- Marketplaces
- Any product requiring foundational commerce primitives

All modules are open-source and freely available on npm, providing developers with complete control and extensibility.

---

## Installation & Setup
To get started with this project, follow the steps below:

### Prerequisites
Ensure you have the following installed on your system:

- [Docker](https://docs.docker.com/get-started/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Setup repositories
1. **Setup backend repository**

   Run commands below:
    ```bash
    cd backend
    git init
    git remote add origin git@github.com:medusajs/medusa-starter-default.git
    git fetch --depth 1 origin 46de582ea7af0f80718e745e89407c407634aa46
    git checkout 46de582ea7af0f80718e745e89407c407634aa46
    cd ..
    ```
   This will initialize MedusaJS backend starter template based on MedusaJS v1.

2. **Setup storefront repository**

   Run commands below:
    ```bash
    cd storefront
    git init
    git remote add origin git@github.com:medusajs/nextjs-starter-medusa.git
    git fetch --depth 1 origin 0f5452dfe44838f890b798789d75db1a81303b7a
    git checkout 0f5452dfe44838f890b798789d75db1a81303b7a
    cd ..
    ```
   This will initialize MedusaJS storefront starter template based on MedusaJS v1.

### Steps to Set Up the Environment

1. **Start the MedusaJS backend and required services**

   Run the following command to bring up the backend services in detached mode:
   ```bash
   docker compose up --build -d
   ```

2. **Seed the database**

   This step is required only once unless you delete the database volume. To seed the database, run:
   ```bash
   docker compose -f compose.seed.yaml run --rm seed
   ```

3. **Start the storefront**

   Bring up the storefront services using the following command:
   ```bash
   docker compose -f compose.storefront.yaml up --build
   ```

4. **Turn off the development environment**

   When you're done working and want to shut down the environment, use the following commands:
   - To stop the storefront services:
     ```bash
     docker compose -f compose.storefront.yaml down
     ```
   - To stop the backend and other services:
     ```bash
     docker compose down
     ```

### Notes
- The `docker compose up -d` command initializes the backend services required for the MedusaJS environment.
- The database seeding step populates the database with initial example data and should only be repeated if the database volume is deleted.
- The storefront services are launched separately using a dedicated compose file to maintain modularity.
- Use the shutdown commands above to free up system resources when the development environment is not in use.

Your environment should now be up and running! You can access the storefront and backend services as configured in the compose files.

---

## Customization
This project is designed to be flexible and easily customizable. Follow the guidelines below to adapt it to your needs:

### Replacing the Existing Template
You can replace the existing backend and storefront templates with your own code. Ensure that the following files are preserved:

- `Dockerfile`
- `.dockerignore`

These files are essential for Docker to build and manage your containers correctly.

### Backend Customization
The backend is expected to use **Node.js**. For example, you can set up a backend using **TypeScript**. Replace the template backend code with your own implementation, ensuring it aligns with the MedusaJS framework.

### Storefront Customization
The storefront is expected to use **Next.js**. To set up a new Next.js storefront, you can use the following command:

```bash
npx create-next-app@latest
```

This will initialize a new Next.js application that you can customize and integrate with your MedusaJS backend.

Once you've replaced the templates and set up your custom backend and storefront, the Docker Compose configuration will handle the rest, ensuring a smooth development and deployment workflow.

---

## Deployment
This project includes a pre-configured GitHub workflow pipeline to streamline the build and deployment process. The pipeline is designed to build example template images, which can be used by the user for demo purposes.

### Image Tags
The workflow will generate images with predefined tags, such as:

- `medusajs-backend:<tag>`
- `medusajs-storefront:<tag>`

(Replace `<tag>` with the appropriate version or identifier as needed.)

We provide tags in format: `<MedusaJS version>-<short commit sha>`. Tags in format `<MedusaJS version>-latest` provide latest version of image built based on specified MedusaJS version.

For Medusa v1 we prepared two tags with latest available starter configuration:

- `medusajs-backend:1.20.10-latest`
- `medusajs-storefront:1.18.1-latest`

### Customizing the Deployment
Users can leverage the provided pipeline definitions to customize deployment to their preferred cloud providers, such as AWS or Google Cloud Services (GCS). Modify the workflow files in the `.github/workflows` directory to:

- Add specific deployment steps.
- Configure cloud provider settings.
- Integrate with CI/CD tools for advanced use cases.

The flexibility of the pipeline ensures that the project can be adapted to various deployment environments, providing a robust foundation for production-ready systems.

---

## Appendices

### Contact Information
For further assistance or inquiries, please contact us at:

[Uninterrupted](https://uninterrupted.tech/)
