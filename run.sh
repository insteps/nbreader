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
# *******************************************************************
#
# Code to run various feeds data fetch/update for newsbeuter,
#   Search database or call newsbeuter cli.
#
#
#

fpath=$(readlink -f $0)
APPDIR=$(dirname $fpath)
PWD=$(pwd)

source $APPDIR/scripts/env.sh
source $APPDIR/scripts/date.inc

## examples/execs
# newsbeuter -u urls -c u.db -x reload

#usage: sh run.sh newsbeuter <dbname>
if [ "$1" = 'newsbeuter' ]; then
    echo '---------------------------------'
    if [ -f "$CONFIGDIR/dbname" ]; then
        echo "Other databases are:"
        cat "$CONFIGDIR/dbname" | while read f; do echo -n $f" "; done;
        echo ''
    fi
    echo '---------------------------------'
    db=$2;
    if [ "$db" = '' ]; then
        echo "Defaulting to news db"
        echo '---------------------------------'
        db='news';
    fi
    if [ -f "$DBDIR/$db.loc.db" ]; then
        newsbeuter -u "$CONFIGDIR/url.local/$db" -c $DBDIR/$db.loc.db
    fi
fi

#usage: sh run.sh update tag|folder|url|hash <relevant data>
if [ "$1" = 'update' ]; then
    source $SCRIPTDIR/update.sh
    rm -f $COOKIEFILE;

    case $2 in
        tag) update_by_tag $2 $3;;
        folder) update_by_tag $2 $3;;
        url) update_by_url $2 $3;;
        hash) update_by_hash $2 $3;;
    esac

    _when=$2
    _type=$3
    case $_when in
        daily|hourly|weekly|monthly)
           source $SCRIPTDIR/update.cron.sh
           if [ "$_type" ]; then
              cron_update $_when $_type
           else
              _cron_update "$_when"
           fi
        ;;
    esac
fi

if [ "$1" = 'refresh' ]; then
    source $SCRIPTDIR/feedicon.sh

    case $2 in
        iconstatus) _remove_icons_dbstatus_all && update_icons_status_all;;
        meta) rm -f "$DATADIR/meta.json";;
        meta_all) rm -f "$DATADIR/meta.*";;
        icon_all) rm -f "$DATADIR/icon.*";;
    esac
fi

#usage: sh run.sh reload <dbname>
if [ "$1" = 'reload' ]; then
    source $SCRIPTDIR/update.sh

    case $2 in
        *) update_by_dbname $2;;
    esac
fi

#usage: sh run.sh reloadall
if [ "$1" = 'reloadall' ]; then
    source $SCRIPTDIR/update.sh
    update_all;
fi


#usage: sh run.sh search <search text> <limit>
if [ "$1" = 'search' ]; then
    sh $SCRIPTDIR/search.sh "$2" "$3";
fi

#usage: sh run.sh config
if [ "$1" = 'config' ]; then
    sh $SCRIPTDIR/config.sh;
fi


#
# prints usage of run command
#
usage() {
    echo "$program $program_version"
    cat << EOF
Usage: run [option]
----------

Commands:

EOF
    exit 0
}



