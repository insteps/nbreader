
## Package dependencies

* php-apache2
* php-xml
* php-phar
* php-sqlite3
* php-json
* php-ctype
* php-curl
* wget
* newsbeuter

eg.
`apk add php-apache2 php-xml php-phar php-sqlite3 php-json php-ctype php-curl wget newsbeuter`

### Issues (see `doc/install.md`):
1. Download required 3rd party libs/css used in application.
2. Set session path in `config/config.ph`p
3. Set session, db, data folder permissions in `var/newsbeuter`

