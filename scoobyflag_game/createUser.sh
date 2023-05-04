#!/bin/bash

# Change these values to match your desired user and password
USER="scoobyflag"
PASSWORD="scoobyflag"
DB_NAME="scoobyflag"

# Get the container ID of the running MySQL instance
CONTAINER_ID=$(docker-compose ps -q database)

# Create the user and the database
docker exec -i $CONTAINER_ID mysql -u root -proot <<-EOSQL
CREATE USER '$USER'@'%' IDENTIFIED BY '$PASSWORD';
CREATE DATABASE $DB_NAME;
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$USER'@'%';
FLUSH PRIVILEGES;
EOSQL
