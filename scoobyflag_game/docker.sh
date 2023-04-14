php bin/console doctrine:database:create --no-interaction
php bin/console doctrine:schema:update --force --no-interaction
wait_for_db() {
  echo "Waiting for database connection..."
  until php bin/console doctrine:query:sql "SELECT 1" &> /dev/null
  do
    sleep 1
  done
  echo "Database connection established"
}

# DB_NAME="scoobyflag_$(date +%s)"
# DATABASE_URL="${DATABASE_URL/\/scoobyflag/\/$DB_NAME}"

# export DATABASE_URL

# wait_for_db

echo "Creating database ${DB_NAME}..."

exec apache2-foreground