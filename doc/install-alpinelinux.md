
## Package dependencies

* newsbeuter/newsboat
* sqlite
* curl(default) / wget
* php-apache2 [php-fpm]
* php-xml
* php-phar
* php-sqlite3
* php-json
* php-ctype
* php-curl
* file (for icon download)
* fossil (optional)
* jq (optional)

eg.
* php5

  `apk add newsbeuter sqlite curl file php-apache2 php-xml php-phar php-sqlite3 php-json php-ctype php-curl`

* php7

  `php7-apache2 php7-xml php7-phar php7-sqlite3 php7-calendar php7-ctype php7-curl php7-gettext php7-iconv php7-json php7-mbstring  php7-session`

### Issues (see `doc/install.md`):
1. Download required 3rd party framework/libs used in application.
2. Set session path in `public/application/config/config.php`
3. Set `session`, `db`, `data` folder permissions in `var/newsbeuter`

