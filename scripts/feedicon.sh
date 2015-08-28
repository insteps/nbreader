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
# Code to fetch and store newsbeuter's feeds/rss/xml icon, based on:
#   urls (rss/atom)
# 
# 

fpath=$(readlink -f $0)
if [ ! "$APPDIR" ]; then APPDIR=$(dirname $(dirname $fpath)); fi
PWD=$(pwd)

# Icon store path
ICONTXTDIR="$FEEDSDIR"
#ICONDIR="$WEBAPPDIR/lib/icon"

# Temp files
localSHdr="$FEEDSDIR/.site.hdr.txt"
localIco="$FEEDSDIR/.site.ico"
localHtml="$FEEDSDIR/.site.html"

# only for testing
if [ "$1" = 'runtest' ]; then 
  source $APPDIR/scripts/env.sh
  source $SCRIPTDIR/color2.inc
  source $SCRIPTDIR/date.inc
fi
source $SCRIPTDIR/url.inc

isIco=0; iconType=''; FeedIconSize='';

get_siteurl_from_db() {
    local db=$1
    local hash=$2
    db="$DBDIR/${db}.loc.db"
    if [ ! -f "$db" ]; then return; fi;
    local query="SELECT url FROM rss_feed WHERE rssurl LIKE '%$hash%' LIMIT 1;"
    rssurl=$(echo "$query" | sqlite3 "$db")

    parse_url $rssurl
    if [ "$host" = 'localhost' ]; then
        rssurl='';
        query="SELECT rssurl FROM rss_url WHERE sha1sum='$URLSUM';";
        rssurl=$(echo "$query" | sqlite3 "$CONFIGDIR/urls.db");
    fi

    parse_url $rssurl
    if [ "$host" = 'localhost' ]; then rssurl=''; fi

    echo -e "$hash --> $rssurl";
}

parse_feed_icon_url() {
    sed -i -e "s/</\n</g" "$localHtml"
    ICONURL=$(cat "$localHtml" | grep -i "rel\=[\"\']shortcut icon" )
    if [ ! "$ICONURL" ]; then
        ICONURL=$(cat "$localHtml" | grep -i "rel\=[\"\']icon" )
    fi
    ICONURL=$(echo "$ICONURL" |
        grep -i -o "href\=[\"\']\(.*\)[\"\']" |
        sed -e "s/href//" \
            -e "s/\"//g" \
            -e "s/\'//" \
            -e "s/\=//" \
            -e "s/>.*$//g"
        )
    ICONURL=$( echo "$ICONURL" | awk '{print $1}' )
    # echo $ICONURL;
}

is_file_ico() {
    # TODO 1. check for binary or magicnumber
    isIco=0; iconType='';
    if [ ! -f "$1" ]; then return; fi
    # test for .ico file # dependencies=file, need another option if possible
    is_ico=$(file $1 | grep 'icon')
    if [ "$is_ico" ]; then isIco=1; iconType='ico'; return; fi
    if [ ! "$is_ico" ]; then is_ico=$(file $1 | grep -i 'PNG image'); fi
    if [ "$is_ico" ]; then isIco=1; iconType='png'; return; fi
    if [ ! "$is_ico" ]; then is_ico=$(file $1 | grep -i 'gif'); fi
    if [ "$is_ico" ]; then isIco=1; iconType='gif'; return; fi
}

check_icon_size() {
    if [ -f "$localSHdr" ]; then rm -f "$localSHdr"; fi
    url=$1
    wget $WGETOPTS_1 --user-agent="'$_USERAGENT_0'" -S --spider "$url" -a "$localSHdr"
    local len=$(cat "$localSHdr" | grep -i '^Length' | awk '{print $2}')
    if [ 102400 -ge "$(($len))" ]; then # 100Kb limit
        FeedIconSize='OK';
    else
        echo -e ${cRED}"msg: icon size too large ->${cNORMAL} $_fi ...";
    fi
}

fetch_feedicon() {
    clean_temp_icon; _fi=$1
    local logfile="$VARDIR/log/$DATESTAMP.log"
    echo -e ${cYELLOW}"msg: fetching icon from ->${cNORMAL} $_fi ...";
    check_icon_size "$_fi"
    if [ "$FeedIconSize" = 'OK' ]; then
        wget $WGETOPTS_1 --user-agent="'$_USERAGENT_0'" "$_fi" -O "$localIco" -a $logfile
    fi
    FeedIconSize='';
}

clean_temp_icon() {
    if [ -f "$localIco" ]; then rm -f "$localIco"; fi
    if [ -f "$localSHdr" ]; then rm -f "$localSHdr"; fi
    if [ -f "$localHtml" ]; then rm -f "$localHtml"; fi
}

get_feedicon() {

    # get "$url/favicon.ico"
    parse_url $1
    BURL=${proto}${host}
    if [ ! "$BURL" ]; then return; fi
    fetch_feedicon "$BURL/favicon.ico"

    is_file_ico "$localIco"
    if [ "$isIco" -eq 1 ]; then
        echo -e ${cGREEN}'msg: favicon.ico is available, downloaded successfully'${cNORMAL};
        isIco=0; return;
    fi
    echo -e ${cRED}'msg: favicon.ico not available'${cNORMAL};

    # get baseurl site and look for 'shortcut icon'
    echo -e ${cYELLOW}'msg: fetching base site...'${cNORMAL};
    local logfile="$VARDIR/log/$DATESTAMP.log"
    clean_temp_icon
    wget $WGETOPTS_1 --user-agent="'$_USERAGENT_0'" "$BURL" -O "$localHtml" -a $logfile
    parse_feed_icon_url

    if [ ! "$ICONURL" ]; then
        echo -e ${cRED}'msg: shortcut icon not available'${cNORMAL};
        return;
    fi

    is_furl=$(echo $ICONURL | grep -i '^http')
    if [ "$is_furl" ]; then
        fetch_feedicon $ICONURL
    else
        fetch_feedicon "$BURL/$ICONURL"
    fi

    is_file_ico "$localIco"
    if [ "$isIco" -eq 1 ]; then
        echo -e ${cGREEN}'msg: shortcut icon downloaded successfully'${cNORMAL};
        isIco=0; return;
    fi
    clean_temp_icon
    echo -e ${cRED}'msg: shortcut icon not available'${cNORMAL};

}

update_feedicon() {

    echo '';
    echo -e ${cBWHITE}'feedicon::update-feedicon -> start icon update ... '${cNORMAL};

    local URLSUM=$1
    a=$(echo $URLSUM | cut -b 1 -)
    b=$(echo $URLSUM | cut -b 1-2 -)
    if [ ! -d "$ICONTXTDIR/$a/$b" ]; then return; fi
    local iconfile="$ICONTXTDIR/$a/$b/$URLSUM.ico.txt"

    if [ -f "$iconfile" ]; then
        printf "${cGREEN}Nothing to do !! icon file already available.${cNORMAL}\n";
        return;
    fi

    #local dbname=$1
    query="SELECT dbname FROM rss_url WHERE sha1sum='$URLSUM';";
    local dbname=$(echo "$query" | sqlite3 "$CONFIGDIR/urls.db");
    if [ ! $dbname ]; then
        printf "${cRED}Nothing to do !! (no record found)${cNORMAL}\n";
        return;
    fi
    get_siteurl_from_db $dbname $URLSUM

    if [ ! $rssurl ]; then return; fi
    get_feedicon $rssurl

    if [ ! -s "$localIco" ]; then return; fi
    local _i="${localIco%%.ico}.ico.txt"
    echo 'image/'${iconType}';base64,' > "$_i"
    base64 "$localIco" >> "$_i"
    chmod 0644 "$_i"
    mv -f "$_i" "$ICONTXTDIR/$a/$b/$URLSUM.ico.txt"

    update_icon_status "$URLSUM" '1' "$dbname"
    echo -e ${cGREEN}'feedicon::update-feedicon -> icon updated successfully'${cNORMAL};

}

update_icon_status() {
    local URLSUM=$1; local status=$2; local dbname=$3;
    _update_icon_dbstatus "$URLSUM" "$status"
    echo $EPOCH > "$DATADIR/icon.$dbname.lastfetch"
    generate_icons_cache_hash_list
}

update_icons_status_all() {
    find $FEEDSDIR -name *.ico.txt |
    while read f; do
        local a=${f%%.ico*};
        local b=$(basename $a);
        _update_icon_dbstatus "$b" '1' ;
    done;

    local dbs=$(ls -1rt $URLLOCALDIR/*)
    for dbname in $dbs; do
        local dbname=$(basename $dbname)
        echo $EPOCH > "$DATADIR/icon.$dbname.lastfetch"
    done

}

_update_icon_dbstatus() {
    local sha1=$1; local status=$2
    query="UPDATE rss_url SET icon='$status' WHERE sha1sum='$sha1';";
    echo "$query" | sqlite3 "$CONFIGDIR/urls.db";
}

_remove_icons_dbstatus_all() {
    query="UPDATE rss_url SET icon='0';";
    echo "$query" | sqlite3 "$CONFIGDIR/urls.db";
}

generate_icons_cache_hash_list() {
    find "$FEEDSDIR" -name '*.ico.txt' | grep -o -E '[0-9a-f]{40}' - > "$FEEDSDIR/icons-hash.txt"
    # find "$FEEDSDIR" -name '*.ico.txt' | rev | cut -b 9-48 - | rev > "$FEEDSDIR/icons-hash.txt"
}

generate_icons_cache_by_dbname() {
    local dbname=$1
    echo '--'
}

generate_icons_combined_file() {
    echo '--'
}

remove_icon() {
    local URLSUM=$1
    a=$(echo $URLSUM | cut -b 1 -)
    b=$(echo $URLSUM | cut -b 1-2 -)
    echo -e ${cBROWN}'feedicon::remove-icon -> '"$ICONTXTDIR/$a/$b/$URLSUM.ico.txt"${cNORMAL};
    rm -f "$ICONTXTDIR/$a/$b/$URLSUM.ico.txt"
}

remove_icon_all() {
    # find $FEEDSDIR -name *.ico.txt | xargs rm -f -
    echo '--'
}

icon_run_test() {
    local URLSUM=$1
    remove_icon $URLSUM
    update_feedicon $URLSUM
}

if [ "$1" = 'runtest' ]; then 
    icon_run_test $2
fi


## examples
# update_feedicon '9a4a872c5eb377df7aa2c5feea4d02c6022264db'


