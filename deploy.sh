git pull
cd scoobyflag_game
npm i
composer i
php bin/console d:s:u -f --complete
php bin/console c:c
npm run build
cd ../scoobyflag_api
composer i
php bin/console d:s:u -f --complete
php bin/console c:c