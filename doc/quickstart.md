
## Important Note

* This is quick-start for 'test' installation and assumes you have some basic knowledge of working in command line, including root access.
* The process described below does not take care of proper folder access rights.
* Once you have learnt the process, delete the installation, read docs on how to install and proceed accordingly.
* This guide assumes you have already have a working server apache with php installed.

## Basic Requirements Test

1. cd /var/www/html # or to whichever is your web-server folder
2. create test.php
3. edit test.php and add lines and test in your browser to see if they meet the requirements of nbreader.

   `<?php`
   `phpinfo();`

   _from now on your "web-server folder" would be referred to as `<WEBFOLDER>`_

## Setup Commands

Note: the commands below may require sudo or root access.

4. `cd <WEBFOLDER>`
5. `git clone https://github.com/insteps/nbreader`
6. `wget http://download.tuxfamily.org/pmreader/nb/lib.01-20200129.tar.gz`
7. `wget http://download.tuxfamily.org/pmreader/nb/codeigniter-3.1.11.phar`
8. `cd nbreader`
9. `sh run.sh config`
10. `sh run.sh update folder /news`
11. `sh run.sh update folder /dev`
12. `tar -zxf ../lib.01-20200129.tar.gz`
13. `cp ../codeigniter-3.1.11.phar public/lib/codeigniter/`

14. edit apps/web/config/newsbeuter.php and change

    `$config['newsbeuter']['be']['path'] = '<WEBFOLDER>/nbreader';`

15. `cd <WEBFOLDER>`
16. `ln -s nbreader/public rss`
17. `ln -s nbreader/var/newsbeuter/feeds/feeds feeds`

18. Open url http://localhost/rss

