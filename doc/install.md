 

## A. Create rss/atom list file

1. Add rss/atom feeds url in 'urls list file'.
   See `config/readme.notes`
2. For every url list file in `config/url.local`
   there needs to be a corresponding database file
   in `var/newsbeuter/db`.

   If you have not run `update`, you can test run by
   copying `config/empty.loc.db` to `var/newsbeuter/db`.

   eg. for list file `config/url/news` the database file
   name would be `var/newsbeuter/db/news.loc.db`

   There is no need to have multiple urls list file,
   if you want to keep things simple and store all 
   data into single file.

## B. 3rd Party libs

1. Download 3rd party libs/css used in application,
   unzip it in public/lib/<other web libs>

## C. Configs

1. Change install variables in `scripts/env.sh` as needed.

2. Change install variables in `public/index.php` as needed.

3. Change install variables in
   `public/application/config/newsbeuter.php` as needed.

4. Run `sh run.sh config`


## D. Fix Directory Permissions

**Make sure following directory/files are web writable**
1. `var/newsbeuter/db`
2. `var/newsbeuter/data`
3. `var/newsbeuter/session`



**ENJOY !**



