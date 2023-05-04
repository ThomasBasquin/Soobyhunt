git pull
cd scoobyflag_game
php bin/console d:s:u -f --complete
php bin/console c:c
npm run build
cd ../scoobyflag_api
php bin/console d:s:u -f --complete
php bin/console c:c