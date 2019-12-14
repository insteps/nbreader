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
# Code to fetch and store newsbeuter's feeds/rss/xml data, based on:
#   config/bookmarks list files.
#
#

fpath=$(readlink -f $0)
if [ ! "$APPDIR" ]; then APPDIR=$(dirname $(dirname $fpath)); fi
PWD=$(pwd)

source $APPDIR/scripts/env.sh
. $SCRIPTDIR/update.sh

BOOKMARKDIR="$CONFIGDIR/bookmarks"

# eg. tag.daily
cron_set_file() {
    _type=${1%%.*}
    _when=${1##*.}
}

cron_update() {

    local _when=$1 # eg. daily|hourly|monthly|weekly
    local _type=$2 # eg. folder|tag|url or compound/mixed type eg. news
    # echo $1 '-' $2

    local TYPE='';
    local cTYPE=''; local cVALUE='';
    local isMixed=0; local _file=;

    case $_type in
        folder|tag|url) TYPE=$_type; CAT=$_when ;;
        #*) TYPE='folder tag url'; CAT=$_when; $isMixed=1 ;;
        *) TYPE=$_type; CAT=$_when; isMixed=1 ;;
    esac

    case $_when in
        daily|hourly|weekly|monthly) _file=$TYPE.$CAT ;;
        *) _file=$TYPE ;;
    esac

    local _bmfile=${BOOKMARKDIR}/$_file

    if [ ! -f "$_bmfile" ]; then echo "$_bmfile - bookmarks not found!"; return 0; fi

    echo -e $cBROWN$cbLBROWN"$_file - update in progress... "$cNORMAL
    if [ "$isMixed" -eq 1 ]; then
        cat $_bmfile | while read f; do
            if [ -n "$f" ]; then
                cTYPE=$(echo "$f" | grep -E -o '^\w+')
                cVALUE=$(echo "$f" | grep -E -o '\s.*')
                case $cTYPE in
                    # folder|tag|url) echo "$cTYPE" "$cVALUE" ;;
                    folder|tag|url) sh $APPDIR/run.sh update "$cTYPE" "$cVALUE" ;;
                esac
            fi
        done
    else
        cat $_bmfile | while read f; do
            if [ -n "$f" ]; then sh $APPDIR/run.sh update "$TYPE" "$f"; fi;
        done
    fi

}

_cron_update() {
    _when=; _type=;
    echo "updating '$1' bookmarks..."
    ls -1 $BOOKMARKDIR/*.$1 | while read f; do
        cron_set_file $(basename $f)
        # echo "$_when -- $_type";
        cron_update $_when $_type
    done
}

if [ "$1" = 'update!' ]; then
    _when=$2
    _type=$3

    case $_when in
        daily|hourly|weekly|monthly)
           if [ "$_type" ]; then
              cron_update $_when $_type
           else
              _cron_update "$_when"
           fi
        ;;
    esac
fi

# examples
# cron_update $1 $2
# _cron_update hourly
# _cron_update daily



