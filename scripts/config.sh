#!/bin/sh
# 
# Copyright (c) 2015-2016 V.Krishn
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
# Code to configure basic setup.
# 
# 
# 

# set -x
fpath=$(readlink -f $0)
if [ ! "$APPDIR" ]; then APPDIR=$(dirname $(dirname $fpath)); fi
PWD=$(pwd)

source $APPDIR/scripts/env.sh

if [ ! -d "$RUNDIR" ]; then
    mkdir -p $RUNDIR/fetch;
    mkdir -p $RUNDIR/update;
    touch $RUNDIR/.run;
fi;
if [ ! -d "$DBDIR" ]; then mkdir -p $DBDIR; fi;
if [ ! -d "$DATADIR" ]; then mkdir -p $DATADIR; fi;
if [ ! -d "$URLDIR" ]; then mkdir -p $URLDIR; fi;
if [ ! -d "$URLLOCALDIR" ]; then mkdir -p $URLLOCALDIR; fi;
if [ ! -d "$FEEDSDIR" ]; then mkdir -p $FEEDSDIR; touch "$FEEDSDIR/.feeds.PLACEHOLDER"; fi;

csvfile="$RUNDIR/urls.csv";
urldb="$CONFIGDIR/urls.db"

create_url_local() {
    local filename=$1
    local URLSUM=$2
    local TAG=$3
    local a=$(echo $URLSUM | cut -b 1 -)
    local b=$(echo $URLSUM | cut -b 1-2 -)

    URLSUM="$FEEDSURL/$a/$b/$URLSUM.xml"
    echo "$URLSUM $TAG" >> $URLLOCALDIR/$filename;
    mkdir -p "$RUNDIR/fetch";
    mkdir -p "$RUNDIR/update/$filename";
    mkdir -p "$RUNDIR/update/.todo";
    mkdir -p "$VARDIR/.done";
}

# make some sample entry
#  note: does not create temp files in rundir/vardir
create_sample_data() {
    if [ $SETSAMPLEDATA != '1' ]; then
        echo "Error: no rss/atom entry found. See config/readme.notes OR set SETSAMPLEDATA=1"; exit 0;
    fi
    echo "Msg: creating sample data ..."
    cp $CONFIGDIR/urls.sample $URLDIR/sample;
    sleep 0.5
    config
    sleep 2
    echo "Msg: fetching sample rss feed ..."
    echo "---------------------------------"
    source $SCRIPTDIR/update.sh
    fetch_by_dbname 'sample'
    update_by_dbname 'sample'
}

create_url_csv() {
    if [ -f "$csvfile" ]; then rm -f "$csvfile"; fi
    for urlfile in $URLDIR/*; do
        #echo $urlfile;
        if [ -f "$urlfile" ]; then
            filename=$(basename $urlfile)
            if [ -f "$URLLOCALDIR/$filename" ]; then
                rm -f "$URLLOCALDIR/$filename";
            fi
            while read line; do
                if [ "$line" != "" ]; then
                    URLSUM=$(echo $line | awk '{print $1}' | sha1sum -t);
                    URLSUM=${URLSUM:0:40};
                    TAG=$(echo $line | awk '{print $2}');
                    local l="$(echo $line |
                      awk '{print "\"" $1 "\"" "|" $2}')|"\""$filename"\""|"\""0"\""|"\""0"\""|"\""$URLSUM"\""|"\""0"\""";
                    create_url_local "$filename" "$URLSUM" "$TAG"
                    #echo "$urlfile $l";
                    echo $l >> $csvfile;
                fi;
            done < $urlfile
        else
            create_sample_data;
        fi
    done;
}

create_url_db() {
    if [ ! -f "$csvfile" ]; then 
        echo "Error: no rss/atom entry found. See config/readme.notes."; exit 0;
    fi
    rm -f $urldb
    sqlite3 $urldb < "$SQLDIR/urls.sqlite.sql"
    sqlite3 $urldb ".import $csvfile rss_url"
    echo $FEEDSURL > "$CONFIGDIR/feedsurl"
    ls -1 $URLLOCALDIR | sort > "$CONFIGDIR/dbname"
}

create_empty_dbs() {
    ls $URLLOCALDIR | while read f; do
        if [ ! -f "$DBDIR/$f.loc.db" ]; then
            cp "$CONFIGDIR/empty.loc.db" "$DBDIR/$f.loc.db";
        fi
    done;
}

config_init_icon_status() {
    if [ $FEEDICON = '1' ]; then
        source $SCRIPTDIR/feedicon.sh
        _remove_icons_dbstatus_all
        update_icons_status_all
        generate_icons_cache_hash_list
    else
        printf "${cRED}Updating feeds icon is disabled, see env.sh${cNORMAL}\n";
    fi
}

config() {
    create_url_csv 
    create_url_db 
    create_empty_dbs
    config_init_icon_status
}

config


