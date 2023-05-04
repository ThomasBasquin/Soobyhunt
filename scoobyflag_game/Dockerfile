FROM php:8.1-apache

LABEL image_name="game-server"

ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/

RUN chmod +x /usr/local/bin/install-php-extensions && \
    install-php-extensions pdo_mysql intl

RUN curl -sSk https://getcomposer.org/installer | php -- --disable-tls && \
   mv composer.phar /usr/local/bin/composer

# RUN apt update && apt install -yqq nodejs npm

COPY . /var/www/

RUN mkdir -p /var/www/var /var/www/var/log 
RUN chown -R www-data:www-data /var/www/var && \
    chmod -R 775 /var/www/var && \
    chown -R www-data:www-data /var/www/var/log && \
    chmod -R 775 /var/www/var/log

COPY ./apache.conf /etc/apache2/sites-available/000-default.conf

ENV COMPOSER_ALLOW_SUPERUSER 1

RUN cd /var/www && \
    composer install
    # npm install --force && \
    # npm run build
    
WORKDIR /var/www/

ENTRYPOINT ["bash", "./docker.sh"]

EXPOSE 80