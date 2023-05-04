#!/bin/bash

# Function to clean up the database on exit
cleanup() {
  echo "Removing database ${DB_NAME}..."
  php bin/console doctrine:database:drop --force
}

# Trap the termination signals and call the cleanup function
trap cleanup EXIT

# Run the original script with unique database creation
/bin/bash docker.sh 
