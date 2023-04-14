# Génère un nom de base de données unique
DB_NAME="scoobyflag_$(date +%s)"

# Configure la connexion à la base de données avec le nouveau nom de base de données
DATABASE_URL=$(printf $DATABASE_URL $DB_NAME)

# Exporte la variable d'environnement DATABASE_URL
export DATABASE_URL

php bin/console doctrine:database:create --no-interaction
php bin/console doctrine:schema:update --force --no-interaction