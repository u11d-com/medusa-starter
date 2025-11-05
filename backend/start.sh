#!/usr/bin/env bash

# Function to print usage instructions
print_usage() {
    cat << EOF
Usage: ./start.sh [options]

This script starts the Medusa server with optional database migration and admin user creation.

Options:
  --help                    Show this help message
  --build-folder=<path>     Specify custom build folder path (default: .medusa/server)

Environment Variables:
  MEDUSA_RUN_MIGRATION      Set to "true" to run database migrations (default: true)
  MEDUSA_CREATE_ADMIN_USER  Set to "true" to create admin user (default: false)
  MEDUSA_ADMIN_EMAIL        Admin user email (required if MEDUSA_CREATE_ADMIN_USER=true)
  MEDUSA_ADMIN_PASSWORD     Admin user password (required if MEDUSA_CREATE_ADMIN_USER=true)

Examples:
  ./start.sh                                     # Start with default settings
  ./start.sh --build-folder=./custom-path        # Start with custom build folder
  MEDUSA_CREATE_ADMIN_USER=true \\
  MEDUSA_ADMIN_EMAIL=admin@medusa-test.com \\
  MEDUSA_ADMIN_PASSWORD=supersecret ./start.sh   # Start and create admin user
EOF
    exit 0
}

set -eu

# Default build directory path
BUILD_FOLDER=".medusa/server"
ROOT_FOLDER=$(pwd)

# Parse command line arguments
while [ $# -gt 0 ]; do
    case "$1" in
        --help|-h)
            print_usage
            ;;
        --build-folder=*)
            BUILD_FOLDER="${1#*=}"
            ;;
        --build-folder)
            BUILD_FOLDER="$2"
            shift
            ;;
        *)
            echo "Error: Unknown option: $1" >&2
            print_usage
            ;;
    esac
    shift
done

# Run database migration
if [[ "${MEDUSA_RUN_MIGRATION:-true}" == "true" ]]; then
  npx medusa db:migrate
  echo "Migration has been done successfully."
fi

# Create admin user
if [[ "${MEDUSA_CREATE_ADMIN_USER:-false}" == "true" ]]; then
  if [[ -z "${MEDUSA_ADMIN_EMAIL:-}" ]] || [[ -z "${MEDUSA_ADMIN_PASSWORD:-}" ]]; then
    echo "Error: MEDUSA_ADMIN_EMAIL and MEDUSA_ADMIN_PASSWORD are required when MEDUSA_CREATE_ADMIN_USER is true" >&2
    exit 1
  fi
  CREATE_EXIT_CODE=0
  CREATE_OUTPUT=$(npx medusa user -e "$MEDUSA_ADMIN_EMAIL" -p "$MEDUSA_ADMIN_PASSWORD" 2>&1) || CREATE_EXIT_CODE=$?
  echo "$CREATE_OUTPUT"
  if [[ $CREATE_EXIT_CODE -ne 0 ]]; then
    if [[ $CREATE_OUTPUT != *"User"*"already exists"* ]]; then
      exit $CREATE_EXIT_CODE
    else
      echo "Admin user already exists."
    fi
  else
    echo "Admin has been created successfully."
  fi
fi

# Create symbolic link for node_modules if it doesn't exist in build folder
if [ ! -e "$BUILD_FOLDER/node_modules" ]; then
    echo "Creating symbolic link for node_modules in build folder..."
    mkdir -p "${BUILD_FOLDER}"
    if [ -d "$ROOT_FOLDER/node_modules" ]; then
        ln -s "$ROOT_FOLDER/node_modules" "$BUILD_FOLDER/node_modules"
        echo "Symbolic link created successfully"
    else
        echo "Error: node_modules not found in root folder" >&2
        exit 1
    fi
fi

# Run Medusa backend application
cd "${BUILD_FOLDER}" || exit 1
exec npx medusa start --cluster
