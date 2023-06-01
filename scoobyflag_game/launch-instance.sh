ID="$1"

# Generate dynamic values
PROJECT_NAME=$(cat /dev/urandom | tr -dc 'a-z0-9' | fold -w 8 | head -n 1)
DB_NAME=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 16 | head -n 1)
DB_USER=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 16 | head -n 1)
DB_PASSWORD=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 16 | head -n 1)
DB_PORT=$(shuf -i 3307-3399 -n 1)
HOST_PORT=$(shuf -i 8001-8999 -n 1)

MERCURE_PUBLISHER_JWT_KEY=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
MERCURE_SUBSCRIBER_JWT_KEY=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
APP_SECRET=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
MERCURE_JWT_SECRET=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
MERCURE_SUBSCRIBER_JWT_ALG="HS256"
MERCURE_PUBLISHER_JWT_ALG="HS256"


generate_mercure_port() {
  MERCURE_PORT=$(shuf -i 9001-9999 -n 1)
  while docker ps --format '{{.Ports}}' | grep -q "${MERCURE_PORT}->80/tcp"; do
    MERCURE_PORT=$(shuf -i 9001-9999 -n 1)
  done
}
generate_mercure_port

echo "ID: $ID"

# Write values to .env file


echo "DB_NAME=${DB_NAME}" > .env
echo "DB_USER=${DB_USER}" >> .env
echo "DB_PASSWORD=${DB_PASSWORD}" >> .env
echo "DB_PORT=${DB_PORT}" >> .env
echo "HOST_PORT=${HOST_PORT}" >> .env
echo "DATABASE_URL=mysql://root:root@database:3306/${DB_NAME}" >> .env
# echo "DATABASE_URL=mysql://${DB_USER}:${DB_PASSWORD}@database:3306/${DB_NAME}" >> .env
# echo "MERCURE_PUBLIC_URL=http://localhost:${MERCURE_PORT}/.well-known/mercure" >> .env
# echo "MERCURE_URL=http://localhost:${MERCURE_PORT}" >> .env
echo "MERCURE_URL=http://mercure:80/." >> .env
echo "MERCURE_PUBLIC_URL=http://localhost:80/.well-known/mercure" >> .env
echo "MERCURE_PUBLISHER_JWT_KEY=${MERCURE_PUBLISHER_JWT_KEY}" >> .env
echo "MERCURE_SUBSCRIBER_JWT_KEY=${MERCURE_SUBSCRIBER_JWT_KEY}" >> .env
echo "MERCURE_PORT=${MERCURE_PORT}" >> .env
echo "APP_SECRET=${APP_SECRET}" >> .env
echo "MERCURE_JWT_SECRET=${MERCURE_JWT_SECRET}" >> .env
echo "MERCURE_SUBSCRIBER_JWT_ALG=${MERCURE_SUBSCRIBER_JWT_ALG}" >> .env
echo "MERCURE_PUBLISHER_JWT_ALG=${MERCURE_PUBLISHER_JWT_ALG}" >> .env
echo "MESSENGER_TRANSPORT_DSN=doctrine://default?auto_setup=0" >> .env
echo "ID=${ID}" >> .env


# Lancer l'instance avec le fichier .env généré
# docker-compose -p $PROJECT_NAME up --build
docker-compose -p $PROJECT_NAME up -d 
