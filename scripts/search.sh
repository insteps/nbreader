#!/bin/sh
#
# Copyright (c) 2015-2021 V.Krishn
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

    # default (10), upper-limit (125)
    str1=$str1" ATTACH DATABASE '$db' as $_db; ";

    if [ "$n" -eq 1 ]; then
        str="select * from $_db.rss_item "
    else
        str=" union all select * from $_db.rss_item "
    fi
    str2=$str2$str;

done;

content=''; limit=''; limitn=''; offset=''; unread='';

if [ "$1" ]; then
    content="$1"
fi

if [ "$2" ]; then
    limit="limit $2"
    limitn="-n $(($2+2))"
else
    limit="limit 10"
    limitn="-n 12"
fi

if [ "$3" ]; then
    offset=" offset $3"
else
    offset=" offset 0"
fi

if [ "$4" ]; then
    case $4 in
        0) unread="AND unread=0" ;;
        1) unread="AND unread=1" ;;
    esac
fi

searchall() {
    cd $DBDIR;
    ## select id,url from ($str2) where id=1;
    ## can add echo in front

    sqlite3 -header '__newsbeuter.sqlite' \
    "$str1;
    SELECT datetime(pubDate,'unixepoch') AS date,
       id,unread,title,url FROM ($str2)
       WHERE ( content LIKE '%$content%' OR title LIKE '%$content%' )
       $unread
       ORDER BY pubDate DESC $limit $offset;
    ";
}

searchall2() {
    hdr='date|id|unread|title|url'
    str2='rss_item'
    sql="SELECT datetime(pubDate,'unixepoch') AS date,
       id,unread,title,url FROM ($str2)
       WHERE ( content LIKE '%$content%' OR title LIKE '%$content%' )
       $unread
       ORDER BY pubDate DESC $limit $offset;
    ";

    echo $hdr
    ls -1 ${DBDIR}/*.loc.db > /tmp/dbs.lst
    cat /tmp/dbs.lst | while read f; do sqlite3 "$f" "$sql"; done # why different results ?
    # cat /tmp/dbs.lst | parallel -i -j 2 sqlite3 {} "\"$sql\""
}

# add color to search output
searchallc() {
    local tmpf='/tmp/nbreader.search.txt'
    rm -f $tmpf
    searchall >> $tmpf
    echo -e $cYELLOW
    sort -r $tmpf | head "$limitn" | while read l; do
        l2=$(echo $l | sed -E "s#(\|http.*$)#\\${cGREEN}\1\\${cNORMAL}#" \
                     | sed -E "s#^(.*\|[01]\|)#\\${cRED}\1\\${cNORMAL}#");
        echo -e $l2
    done
    echo ""
}

searchall



