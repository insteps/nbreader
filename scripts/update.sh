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
. $SCRIPTDIR/color2.inc
. $SCRIPTDIR/fetch.sh

if [ -d "$RUNDIR" ]; then
    mkdir -p $RUNDIR/update;
else
    echo 'Run config/setup first.'
fi
donedir="$DONEDIR/$YEAR/$MONTH";

urldb="$CONFIGDIR/urls.db"
feedsurl=$(cat "$CONFIGDIR/feedsurl"| grep -m 1 '^.*')
#echo $feedsurl
echo -e "${cBROWN}EPOCH -> $EPOCH${cNORMAL}";
isEpoch=0

#eg. 1436186217
is_epoch() {
    isEpoch=0
    local s=$(echo $1 | grep '[0-9]$')
    local n=$(echo $s | wc -c);
    if [ "$n" -eq 11 ]; then isEpoch=1; fi;
    # implement new method, 
    #  if <totest> is >= epoch(1970) <= epoch(currentyear+1)
}

_update_all_by_dbname() {
    local dbname=$1
    local localurl="$URLLOCALDIR/$dbname";
    local localdb="$DBDIR/$dbname.loc.db"
    if [ ! -f "$localurl" ]; then exit 0; fi
    printf "${cBWHITE}Full-update ->${cNORMAL} $localdb\n"
    newsbeuter -u $localurl -c $localdb -x reload
}

_update_all_db() {
    local dbs=$(ls -1rt $URLLOCALDIR/*)
    for dbname in $dbs; do
        local dbname=$(basename $dbname)
        _update_all_by_dbname $dbname
    done
}

_update_by_dbname_list() {
    local dbname=$1
    local localurl=$2
    local localdb="$DBDIR/$dbname.loc.db"
    if [ ! -f "$localurl" ]; then exit 0; fi
    printf "${cBWHITE}update::Db-updating... ->${cNORMAL} $localdb\n"
    newsbeuter -u $localurl -c $localdb -x reload
}

update_all() {
    _update_all_db
    echo '--'
}

update_by_dbname() {
    _update_all_by_dbname $1
    echo '--'
}

make_local_urlfile() {

    local record=$1
    local sha=$(printf $record | awk -F'|' '{print $1}')
    local tag=$(printf $record | awk -F'|' '{print $2}')
    local db=$(printf $record | awk -F'|' '{print $3}')
    local filename="$RUNDIR/update/$db/$EPOCH"

    local a=$(echo $sha | cut -b 1 -)
    local b=$(echo $sha | cut -b 1-2 -)
    local URLSUM="$feedsurl/$a/$b/$sha.xml"

    mkdir -p "$RUNDIR/update/$db"
    echo "$URLSUM \"$tag\"" >> $filename;

}

# usage:
# Fetches rss/xml file based on tag|tagfolder|url input
# update_fetch <tag|folder|url> <tagname|fullUrl>
update_fetch() {
    type=$1;
    tag=$2; if [ "$tag" = "" ]; then exit 0; fi;

    # 1a. query
    # 1b. Create fetch file in "$RUNDIR/fetch/$EPOCH"
    # 1c. fetch external urls
    if [ "$type" = 'tag' ]; then
        printf "${cBWHITE}update::fetch-by-tag ->${cGREEN} $tag\n${cNORMAL}";
        fetch_by_tag $tag $EPOCH
    fi
    if [ "$type" = 'folder' ]; then
        printf "${cBWHITE}update::fetch-by-tagfolder ->${cGREEN} $tag\n${cNORMAL}";
        fetch_by_tag $tag $EPOCH
        fetch_by_tagfolder $tag $EPOCH
    fi
    if [ "$type" = 'url' ]; then
        printf "${cBWHITE}update::fetch-by-url -> ${cGREEN}$tag\n${cNORMAL}";
        fetch_by_url $tag $EPOCH
    fi

    # 2a. commit rss/atom feed files
    cd "$APPDIR"
    if [ ! -f $RUNDIR/fetch/$EPOCH.done ]; then exit 0; fi;
    printf "${cBBLUE}Prep committing -> fetch:${cNORMAL} $RUNDIR/fetch/$EPOCH\n"
    mkdir -p $donedir;
    cp "$RUNDIR/fetch/$EPOCH.done" "$RUNDIR/update/.todo/$EPOCH.todo"
    mv "$RUNDIR/fetch/$EPOCH.done" "$donedir/$EPOCH.fetch"

    if [ $COMMITDATA = '1' ]; then
        local _epoch=$EPOCH
        source $SCRIPTDIR/commit.sh
        local _commitmsg="fetch: $epoch (by $type - $tag)"
        commit_feeddir "$_epoch" "fetch" "$_commitmsg"
    fi

}

fetch_update_feedicon() {
    if [ $FEEDICON = '1' ]; then
        source $SCRIPTDIR/feedicon.sh
        local list=$2;
        local len=$(echo "$feedsurl" | wc -c);
        len=$(($len+6))
        while read line; do
            if [ -n "$line" ]; then 
                #local URLSUM=$(echo $line | cut -b $len-$(($len+39)) -)
                local URLSUM=$(echo $line | grep -o -E '[0-9a-f]{40}')
                update_feedicon $URLSUM;
            fi
        done < $list

        if [ $COMMITDATA = '1' ]; then
            local _epoch=$EPOCH
            source $SCRIPTDIR/commit.sh
            local _commitmsg="fetchicon: $epoch (by $type - $tag)"
            commit_feeddir "$_epoch" "fetchicon" "$_commitmsg"
        fi

    else
        printf "${cRED}Updating feeds icon is disabled, see env.sh${cNORMAL}\n";
    fi
}

update_fetched() {

    if [ -n "$1" ]; then epoch=$1; else epoch=$EPOCH; fi # OR feeds/feeds/.lastfetch

    # 3a. Create update file in "$RUNDIR/update/<dbname>/$epoch
    # local s1=$(echo $s|sed -e 's/ /", "/g' -e 's/^/"/g' -e 's/$/"/g' -);
    s1="$RUNDIR/update/.todo/$epoch.todo"
    while read line; do
        if [ -n "$line" ]; then 
            echo -n ', "'$line'"' >> "$s1.tmp"
        fi
    done < $s1
    sed -i -e 's/^[, ]//g' -e 's/\"*$/"/g' "$s1.tmp"
    rm -f $s1;
    s2=$(cat $s1.tmp);

    query='select sha1sum,tags,dbname from rss_url where rssurl in ('"$s2"');';
    t=$(echo "$query" | sqlite3 "$CONFIGDIR/urls.db");
    printf "${cBWHITE}update::make-local-urlfile ->${cNORMAL} $epoch\n";
    for record in $t; do
        make_local_urlfile $record;
    done
    rm -f $s1.tmp;

    # 3b.  call updatedb on the file
    #  eg. find './run/newsbeuter/update/' -name '1436381259'
    local updatelist=$(find "$RUNDIR/update/" -name "$epoch")
    for f in $updatelist; do
        printf "${cBWHITE}update::db-update-list ->${cNORMAL} $f\n";
        local d=$(dirname $f)
        dbname=$(basename $(dirname $f))
        _update_by_dbname_list $dbname $f

        # fetch/update feeds icon
        fetch_update_feedicon $dbname $f;

        mv $f "$donedir/$epoch.update.$dbname"
    done

    if [ $COMMITDATA = '1' ]; then
        source $SCRIPTDIR/commit.sh
        commit_update $epoch
    fi

}

# usage:
# update_by_url <'url'> <fullUrl>
update_by_url() {
    update_fetch $1 $2
    update_fetched $EPOCH
}

# usage:
# update_by_tag <tag|folder> <tagname>
update_by_tag() {
    update_fetch $1 $2
    update_fetched $EPOCH
}

# usage:
# update_by_hash <ffb1840d0a0c9bc303887e26277d7e28f7f31cad>
update_by_hash() {
    query="select rssurl from rss_url where sha1sum='$2';";
    url=$(echo "$query" | sqlite3 "$CONFIGDIR/urls.db");
    if [ ! $url ]; then
        printf "${cRED}Nothing to do !! (no record found)${cNORMAL}\n";
        exit 0;
    fi
    update_by_url 'url' $url;
}

update_by_urllist() {
    echo '--'
}

update_by_taglist() {
    echo '--'
}

update() {
    echo '--'
}

#### Tests ####
# _update_all_db
# _update_all_by_dbname magazines > /dev/null 2>&1
# update_by_dbname infotech
# update_by_tag 'folder' '/infotech/OSS/BSD'
# update_by_tag 'tag' '/infotech/OSS/KDE'
# update_by_tag 'tag' '/news/timesofindia.indiatimes.com'
# update_by_url url 'http://asia.nikkei.com/rss/feed/nar'
# update_by_tag 'folder' '/infotech/linux/distrowatch.com'



