#!/usr/bin/env bash

# Usage: ./start.sh [options]
#
# This script starts the Medusa server with optional database migration and admin user creation.
#
# Options:
#   --build-folder=<path>    Specify custom build folder path (default: .medusa/server)
#
# Environment Variables:
#   MEDUSA_RUN_MIGRATION     Set to "true" to run database migrations (default: true)
#   MEDUSA_CREATE_ADMIN_USER Set to "true" to create admin user (default: false)
#   MEDUSA_ADMIN_EMAIL      Admin user email (required if MEDUSA_CREATE_ADMIN_USER=true)
#   MEDUSA_ADMIN_PASSWORD   Admin user password (required if MEDUSA_CREATE_ADMIN_USER=true)
#
# Examples:
#   ./start.sh                               # Start with default settings
#   ./start.sh --build-folder=./custom-path  # Start with custom build folder
#   MEDUSA_CREATE_ADMIN_USER=true \
#   MEDUSA_ADMIN_EMAIL=admin@example.com \
#   MEDUSA_ADMIN_PASSWORD=secret ./start.sh  # Start and create admin user

set -eu

# Default seed file path
BUILD_FOLDER=".medusa/server"

# Parse command line arguments
while [ $# -gt 0 ]; do
    case "$1" in
        --build-folder=*)
            BUILD_FOLDER="${1#*=}"
            ;;
        --build-folder)
            BUILD_FOLDER="$2"
            shift
            ;;
    esac
    shift
done

if [[ "${MEDUSA_RUN_MIGRATION:-true}" = "true" ]]; then
  node_modules/.bin/medusa db:migrate
  echo "Migration has been done succesfully."
fi

if [[ "${MEDUSA_CREATE_ADMIN_USER:-false}" = "true" ]]; then
  CREATE_EXIT_CODE=0
  CREATE_OUTPUT=$(npx medusa user -e "$MEDUSA_ADMIN_EMAIL" -p "$MEDUSA_ADMIN_PASSWORD" 2>&1) || CREATE_EXIT_CODE=$?
  echo "$CREATE_OUTPUT"
  if [[ $CREATE_EXIT_CODE -ne 0 ]]; then
    if [[ $CREATE_OUTPUT != *"User"*"already exists"* ]]; then
      exit $CREATE_EXIT_CODE
    else
      echo "Admin user alreday exists."
    fi
  else
    echo "Admin has been created succesfully."
  fi
fi

cd "$BUILD_FOLDER"
exec node_modules/.bin/medusa start
