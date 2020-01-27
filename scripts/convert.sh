#!/bin/sh
# 
# Copyright (c) 2015-2020 V.Krishn
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
# ******************************************************************
# 
# Code to convert newsbeuter sqlite database to nbreader format.
#   Use at your own risk.
# 
# 

FEEDSURL="http://localhost/feeds"

db=$1
if [ ! -f "$db" ]; then echo 'Error: database file not provided'; exit 0; fi
bak="$db.orig"

if [ -f "$bak" ]; then rm -f $bak; fi;
echo "Msg: Copying $db database file to $bak ....";
cp $db $bak;

n=0;
sqlite3 $db 'select rssurl from rss_feed' | 
  while read r; do

    n=$(($n+1));
    #echo $n;

    URLSUM=$(echo $r | awk '{print $1}' | sha1sum -t);
    URLSUM=${URLSUM:0:40};
    a=$(echo $URLSUM | cut -b 1 -)
    b=$(echo $URLSUM | cut -b 1-2 -)
    URLSUM="$FEEDSURL/$a/$b/$URLSUM.xml"
   
    printf "UPDATE rss_feed SET rssurl='$URLSUM' WHERE rssurl='$r'; UPDATE rss_item SET feedurl='$URLSUM' WHERE feedurl='$r';" | sqlite3 $db

  done;

echo "Msg: Conversion of $db complete ....";



