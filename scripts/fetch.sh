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
# Code to fetch and store newsbeuter's feeds/rss/xml data, based on:
#   urls (rss/atom)
#   tags/catogory: eg. '/news/bbc.co.uk'
#   dbname: eg. news, business, dev
# 
# 
# 

fpath=$(readlink -f $0)
if [ ! "$APPDIR" ]; then APPDIR=$(dirname $(dirname $fpath)); fi
PWD=$(pwd)

source $APPDIR/scripts/env.sh

. $SCRIPTDIR/date.inc

if [ ! -f "$CONFIGDIR/urls.db" ]; then
    echo 'Run config/setup first.'
    exit 0
fi

# make rss/xml file vcs friendly, i.e for git/hg/fossil..etc
#  i.e non-blob like
sanitize_xml() {
    local xml="$1"
    #local xml="$FEEDSDIR/.current.xml"
    sed -i 's/</\n</g' $xml
    sed -i -e 's/&lt;div/\n&/g' \
           -e 's/&lt;table/\n&/g' \
           -e 's/&lt;p/\n&/g' \
           -e 's/&lt;ul/\n&/g' \
           -e 's/&lt;li/\n&/g' \
           -e 's/&lt;a/\n&/g' \
           -e 's/&lt;br/\n&/g' \
            $xml;
    sed -i '/^[\t\s]*$/d' $xml
    sed -i '/^ *$/d' $xml
    sed -i '/^$/d' $xml
    sed -i 's/\r$//' $xml;
}

sanitize_xml_feeds() {
    cd $FEEDSDIR
    local oldd=$(pwd);
    find ./ -name *.xml | while read f; do sanitize_xml $f; done;
}

## Example urls
# URL="http://news.bbc.co.uk/rss/newsonline_world_edition/front_page/rss.xml"
# URL="http://www.rediff.com/rss/inrss.xml"
fetch_url() {
    URL=$1
    if [ -n "$URL" ]; then
        URLSUM=$(echo $URL | sha1sum -t | cut -b 1-40 -)
        # URLSUM=${URLSUM:0:40}
    else
        return 0
    fi

    echo "$URLSUM -> $URL"
    if [ -d "$FEEDSDIR" ]; then
        cd $FEEDSDIR
    else
        echo 'Feeds dir missing, run config/setup first.'; exit 0;
    fi

    if [ -f '.feeds.PLACEHOLDER' ]; then
        a=$(echo $URLSUM | cut -b 1 -)
        b=$(echo $URLSUM | cut -b 1-2 -)
        mkdir -p "$a/$b"
        if [ -f '.current.xml' ]; then rm -f '.current.xml'; fi
    
        mkdir -p $VARDIR/log
        local logfile="$VARDIR/log/$DATESTAMP.log"

        if [ $USECURL = '1' ]; then
          curl $CURLOPTS_1 --user-agent "'$_USERAGENT_0'" "$URL" -o ".current.xml" -v --stderr - >> $logfile
        else
          wget $WGETOPTS_1 --user-agent="'$_USERAGENT_0'" "$URL" -O ".current.xml" -a $logfile
        fi

        if [ -s '.current.xml' ]; then
            # checkpoints
            # 1. make git/fossil friendly
            sanitize_xml "$FEEDSDIR/.current.xml"
            # 2. checksize (<2mb) - TODO
            mv -f '.current.xml' "$a/$b/$URLSUM.xml"
            echo $EPOCH > .lastfetch
        fi
    else
        echo "Incorrect feeds dir"
        exit 0
    fi
            
}

_fetch_querylist() {
    local s=$1; local epoch=$2;
    if [ ! "$s" ]; then
        printf "${cRED}Nothing to do !! (no record found)${cNORMAL}\n";
        return;
    fi

    local extfetch="$RUNDIR/fetch/$epoch";
    echo "$s" > "$extfetch"
    while read url; do
        cd $APPDIR;
        fetch_url $url;
    done < $extfetch

    cat $extfetch >> "$extfetch.done"
    rm -f $extfetch
}

fetch_by_url() {
    url=$1; if [ "$url" = "" ]; then exit 0; fi;
    epoch=$2; if [ "$epoch" = "" ]; then exit 0; fi;
    printf "${cBWHITE}fetch::by-url ->${cNORMAL} $url\n";
    local query='SELECT rssurl FROM rss_url WHERE rssurl='"'$url';";
    local s=$(printf "$query" | sqlite3 "$CONFIGDIR/urls.db");

    _fetch_querylist "$s" $epoch
}

fetch_by_tag() {
    tag=$1; if [ "$tag" = "" ]; then exit 0; fi;
    epoch=$2; if [ "$epoch" = "" ]; then exit 0; fi;
    printf "${cBWHITE}fetch::by-tag ->${cNORMAL} $tag\n";
    local query='SELECT rssurl FROM rss_url WHERE tags='"'$tag';";
    local s=$(printf "$query" | sqlite3 "$CONFIGDIR/urls.db");

    _fetch_querylist "$s" $epoch
}

fetch_by_tagfolder() {
    tag=$1; if [ "$tag" = "" ]; then exit 0; fi;
    epoch=$2; if [ "$epoch" = "" ]; then exit 0; fi;
    printf "${cBWHITE}fetch::by-tagfolder ->${cNORMAL} $tag\n";
    local query='SELECT rssurl FROM rss_url WHERE tags LIKE '"'$tag/%'"";";
    local s=$(echo "$query" | sqlite3 "$CONFIGDIR/urls.db");

    _fetch_querylist "$s" $epoch
}

fetch_by_dbname() {
    dbname=$1; if [ "$dbname" = "" ]; then exit 0; fi;
    if [ ! -f "$URLDIR/$dbname" ]; then echo 'Run config/setup first.'; exit 0; fi
    printf "${cBWHITE}fetch::by-db ->${cNORMAL} $dbname\n";
    local query='SELECT rssurl FROM rss_url WHERE dbname='"'$dbname';";
    local s=$(printf "$query" | sqlite3 "$CONFIGDIR/urls.db");

    for url in $s; do
        cd $APPDIR;
        fetch_url $url;
    done
}

fetch_all() {
    echo '--'
}

fetch() {
    echo '--'
}

## examples
# fetch_by_dbname business
# fetch_by_tag '/business/crmbuyer.com' > /dev/null 2>&1
# fetch_by_url 'http://www.crmbuyer.com/perl/syndication/rssfull.pl'
# fetch_url http://distrowatch.com/news/dwp.xml $EPOCH


