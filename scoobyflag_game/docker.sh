php bin/console doctrine:database:create --no-interaction
php bin/console doctrine:schema:update --force --no-interaction

# DB_NAME="scoobyflag_$(date +%s)"
# DATABASE_URL="${DATABASE_URL/\/scoobyflag/\/$DB_NAME}"

# export DATABASE_URL


echo "Creating database ${DB_NAME}..."

wait_for_db() {
  echo "Waiting for database connection..."
  until php bin/console doctrine:query:sql "SELECT 1" &> /dev/null
  do
    sleep 1
  done
  echo "Database connection established"
}

exec apache2-foreground

wait_for_db