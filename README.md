
# NB Reader

Rss reader *(web based)* for Newsbeuter.

_NOTE: Alpha-release_

## Features

1. Feed list supporting *hierarchy* in category.
2. Search on feed list.
3. Search on active rss items.
4. Responsive layout that adapts on mobile/desktop devices.
5. Mark article as read (manual).
6. Support for multiple databases (top category node).
7. Search multiple databases (cli only for now).

## Features (TODO)

1. Add way to mark/filter articles, eg. flag, tag and bookmark.
2. Improve search on active rss (all pages).
3. Special folders.
4. Settings/configs.
5. ...
6. See image doc/layout-alpha-todo.png for marked items as TODO.

![Layout](http://dev1.insteps.net/nbreader/layout-alpha-todo.png)

## Why an hybrid application

1. Works for me !
2. Nice cli support, simple database.
3. Simple back-end, don't need to bother rss parsing.

## Requirements / Dependencies

1. Newsbeuter
2. Sqlite3
3. Wget
4. PHP 5.4+
5. Any PHP supporting web-server (tested on Apache with .htaccess file support).
6. CodeIgniter-3.x (PHP Framework)
7. Fossil scm, https://www.fossil-scm.org  (optional),
   easy way is download the precompiled single binary file.
8. Jq (optional)
9. 

