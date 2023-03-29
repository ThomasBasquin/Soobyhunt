# Utiliser l'image officielle de PHP avec support FPM
FROM php:8.1-fpm-alpine

RUN COMPOSER_ALLOW_SUPERUSER=1

# Installer les dépendances et extensions PHP nécessaires
RUN apk add --no-cache \
    git \
    unzip \
    zlib-dev \
    libzip-dev \
    icu-dev \
    oniguruma-dev \
    nginx \
    postgresql-dev \
    && docker-php-ext-install \
    zip \
    intl \
    pdo_pgsql \
    opcache \
    mbstring

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configurer le répertoire de travail
WORKDIR /var/www

# Copier les fichiers du projet
COPY . /var/www

# Installer les dépendances avec Composer
RUN composer install --prefer-dist --no-scripts --no-dev --no-interaction --optimize-autoloader

# Configurer Nginx
RUN rm -rf /etc/nginx/sites-enabled/default \
    && rm -rf /etc/nginx/sites-available/default \
    && rm -rf /etc/nginx/nginx.conf


# Configurer les permissions
RUN chown -R www-data:www-data /var/www

# Exposer le port 80
EXPOSE 1650

# Démarrer Nginx et PHP-FPM
CMD ["sh", "-c", "nginx && php-fpm"]