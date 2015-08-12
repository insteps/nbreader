#!/bin/sh
#
# Copyright (c) 2015 V.Krishn
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the Simplified BSD License (also
# known as the "2-Clause License" or "FreeBSD License".)
#
# This program is distributed in the hope that it will be useful,
# but without any warranty; without even the implied warranty of
# merchantability or fitness for a particular purpose.
#
# Author contact information:
#   vkrishn@insteps.net
#   http://www.insteps.net
#
# *******************************************************************
#
# Code to search newsbeuter's database data.
#   it searches content+title
#   dbname: eg. news, business, dev
#   
#
#

## usage eg.
# sh search.sh 'black hat' 10
#

fpath=$(readlink -f $0)
if [ ! "$APPDIR" ]; then APPDIR=$(dirname $(dirname $fpath)); fi
PWD=$(pwd)

source $APPDIR/scripts/env.sh

. $SCRIPTDIR/date.inc
. $SCRIPTDIR/color2.inc

## Get db list
dbs=$(ls -1 ${DBDIR}/*.loc.db);

n=0; str=''; str1=''; str2='';
for db in $dbs; do

    n=$(($n+1));
    db=$(basename $db);
    _db=${db%%\.*};
    str1=$str1" ATTACH DATABASE '$db' as $_db; ";

    if [ "$n" -eq 1 ]; then
        str="select * from $_db.rss_item "
    else
        str=" union all select * from $_db.rss_item "
    fi
    str2=$str2$str;

done;

content=''; limit='';
if [ "$1" ]; then
 content="$1"
fi

if [ "$2" ]; then
 limit="limit $2"
else
 limit="limit 10"
fi

searchall() {
    cd $DBDIR;
    ## select id,url from ($str2) where id=1;
    ## can add echo in front

    sqlite3 -header '__newsbeuter.sqlite' \
    "$str1;
    SELECT datetime(pubDate,'unixepoch') AS date,
       id,title,url FROM ($str2)
       WHERE content LIKE '%$content%'
       OR title LIKE '%$content%'
       ORDER BY pubDate DESC $limit;
    ";
}

searchall



