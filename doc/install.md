 

## A. 3rd Party frameworks/libs

1. Download and install CodeIgniter-3.0.0.
2. Download 3rd party libs/css used in application,
   extract libs content it in public/lib/<other web libs>

_For convenience the bundle can be found at `http://dev1.insteps.net/nbreader/lib.tar.gz`_

## B. Configs

1. Change install variables in `scripts/env.sh` as needed.

2. Change install variables in `public/index.php` as needed.

3. Change install variables in
   `public/application/config/config.php` as needed.

4. Change install variables in
   `public/application/config/newsbeuter.php` as needed.

5. Make sure feeds web url is properly installed and set.

6. Make sure php or codeiginter's session path is set.

## C. Create rss/atom list file

1. Add rss/atom feeds url in 'urls list file'.
   See `config/readme.notes`
2. For every url list file in `config/url.local`
   there needs to be a corresponding database file
   in `var/newsbeuter/db`.

   If you have not run `update`, you can test/dummy run by
   copying `config/empty.loc.db` to `var/newsbeuter/db`.

   eg. for list file `config/url/news` the database file
   name would be `var/newsbeuter/db/news.loc.db`

   OR

   Let `sh run.sh config` create sample data for your during
   initial setup ( when `config/url` folder contains no files ).

   There is no need to have multiple urls list file,
   if you want to keep things simple and store all 
   data into single file.


3. If so far things seem ok, run `sh run.sh config`


## D. Fix Directory Permissions

**Make sure following directory/files are web writable**

1. `var/newsbeuter/db`
2. `var/newsbeuter/data`
3. `var/newsbeuter/session`



**ENJOY !**



