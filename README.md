
# NB Reader

Rss reader *(web based)* for Newsbeuter.

_NOTE: Alpha-release_

:Author:    vkrishn@insteps.net
:Date:      2015-10-23
:Version:   0.1.2

#### Table of Contents

1. [Features](#features)
2. [Features (todo)](#features-todo)
3. [Why a hybrid application](#why-a-hybrid-application)
4. [Requirements / Dependencies](#requirements--dependencies)
5. [Reference](#reference)
6. [Limitations - OS compatibility, etc.](#limitations)
7. [Development - Guide for contributing to the module](#development)

## Features

1. Feed list supporting *hierarchy* in category.
2. Search on feed list.
3. Search on active rss items.
4. Responsive layout that adapts on mobile/desktop devices.
5. Mark article as read (manual).
6. Passive update of new feed in UI.
7. Support for multiple databases.
8. Search multiple databases (cli only for now).
9. Rest api for accessing via web (json).
10. Convert existing newsbeuter db to nbreader format (experimental).

![Layout](http://dev1.insteps.net/nbreader/layout-features.png)

## Features (TODO)

1. Add way to mark/filter articles, eg. flag, tag and bookmark.
2. Improve search on active rss (all pages).
3. Special folders.
4. Browser based settings/configs to run update/changes on backend.
5. ...

![Layout](http://dev1.insteps.net/nbreader/layout-alpha-todo.png)

## Why a hybrid application

1. Works for me !
2. Nice cli support, simple database.
3. Simple back-end, don't need to bother rss parsing.

## Requirements / Dependencies

1. Newsbeuter
2. Sqlite3
3. Curl(default) or Wget
4. PHP 5.4+
5. Any PHP supporting web-server (tested on Apache with .htaccess file support).
6. CodeIgniter-3.x (PHP Framework)
7. File (for icon download)
8. Fossil scm, https://www.fossil-scm.org  (optional),
   easy way is download the precompiled single binary file.
9. Jq (optional)
10. 

## Reference

## Limitations

## Development


