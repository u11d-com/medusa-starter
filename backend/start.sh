#!/usr/bin/env bash

set -eu

if [[ "${MEDUSA_RUN_MIGRATION:-true}" = "true" ]]; then
  npx medusa migrations run
  echo "Migration has been done succesfully."
fi

if [[ "${MEDUSA_CREATE_ADMIN_USER:-false}" = "true" ]]; then
  CREATE_EXIT_CODE=0
  CREATE_OUTPUT=$(npx medusa user -e "$MEDUSA_ADMIN_EMAIL" -p "$MEDUSA_ADMIN_PASSWORD" 2>&1) || CREATE_EXIT_CODE=$?
  echo "$CREATE_OUTPUT"
  if [[ $CREATE_EXIT_CODE -ne 0 ]]; then
    if [[ $CREATE_OUTPUT != *"A user with the same email already exists."* ]]; then
      exit $CREATE_EXIT_CODE
    else
      echo "Admin user alreday exists."
    fi
  else
    echo "Admin has been created succesfully."
  fi
fi

exec node_modules/.bin/medusa start-cluster
