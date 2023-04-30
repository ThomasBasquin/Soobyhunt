# Generate dynamic values
PROJECT_NAME=$(cat /dev/urandom | tr -dc 'a-z0-9' | fold -w 8 | head -n 1)
DB_NAME=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 16 | head -n 1)
DB_USER=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 16 | head -n 1)
DB_PASSWORD=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 16 | head -n 1)
DB_PORT=$(shuf -i 3307-3399 -n 1)
HOST_PORT=$(shuf -i 8000-9000 -n 1)

# Write values to .env file
echo "DB_NAME=${DB_NAME}" > .env
echo "DB_USER=${DB_USER}" >> .env
echo "DB_PASSWORD=${DB_PASSWORD}" >> .env
echo "DB_PORT=${DB_PORT}" >> .env
echo "HOST_PORT=${HOST_PORT}" >> .env
echo "DATABASE_URL=mysql://${DB_USER}:${DB_PASSWORD}@database:${DB_PORT}/${DB_NAME}" >> .env
echo "MERCURE_URL=http://mercure:16640/." >> .env
echo "MERCURE_PUBLIC_URL=http://hugoslr.fr:16640/.well-known/mercure" >> .env
echo "MERCURE_JWT_SECRET='!ChangeThisMercureHubJWTSecretKey!'" >> .env


# Lancer l'instance avec le fichier .env généré
docker-compose -p $PROJECT_NAME  up --build