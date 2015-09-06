
## Package dependencies

* newsbeuter
* sqlite
* curl(default) / wget
* php-apache2
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
`apk add newsbeuter sqlite curl file php-apache2 php-xml php-phar php-sqlite3 php-json php-ctype php-curl`

### Issues (see `doc/install.md`):
1. Download required 3rd party framework/libs used in application.
2. Set session path in `public/application/config/config.php`
3. Set session, db, data folder permissions in `var/newsbeuter`

