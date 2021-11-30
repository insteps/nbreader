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
# Code to fetch and store newsbeuter's feeds/rss/xml icon, based on:
#   urls (rss/atom)
# 
# 

fpath=$(readlink -f $0)
if [ ! "$APPDIR" ]; then APPDIR=$(dirname $(dirname $fpath)); fi
PWD=$(pwd)

source $APPDIR/scripts/env.sh
source $SCRIPTDIR/url.inc
# only for testing
if [ "$1" = 'runtest' ]; then 
  source $SCRIPTDIR/color2.inc
  source $SCRIPTDIR/date.inc
fi

# Temp files
localSHdr="$ICONTXTDIR/.site.hdr.txt"
localIco="$ICONTXTDIR/.site.ico"
localIcoUrl="$ICONTXTDIR/.site.ico.url"
localHtml="$ICONTXTDIR/.site.html"

size_limit=102400; # 100Kb limit
iconType='';

get_siteurl_from_db() {
    local db=$1
    local hash=$2
    db="$DBDIR/${db}.loc.db"
    if [ ! -f "$db" ]; then return; fi;
    # value eg. url = <link>....</link> is from fetched feed/rss,
    # which may not be the actual/original RSS url itself
    local query="SELECT url FROM rss_feed WHERE rssurl LIKE '%$hash%' LIMIT 1;"
    rssurl=$(echo "$query" | sqlite3 "$db")

    parse_url $FEEDSURL; local lhost=$host #get localhost url
    parse_url $rssurl
    if [ "$host" = "$lhost" ]; then
        rssurl='';
        # get the actual/original RSS url # maybe use this always ?
        query="SELECT rssurl FROM rss_url WHERE sha1sum='$URLSUM';";
        rssurl=$(echo "$query" | sqlite3 "$CONFIGDIR/urls.db");
    fi

    parse_url $rssurl
    if [ "$host" = "$lhost" ]; then rssurl=''; fi

    echo -e ">>> $hash --> $rssurl";
}

# look for 'shortcut icon' in <link ... />
parse_feed_icon_url() {
    if [ ! -f "$localHtml" ]; then return 0; fi
    sed -i -e "s/</\n</g" "$localHtml"
    ICONURL=$(cat "$localHtml" | grep -i "rel\=[\"\']shortcut icon" )
    if [ ! "$ICONURL" ]; then
        ICONURL=$(cat "$localHtml" | grep -i "rel\=[\"\']icon" )
    fi
    ICONURL=$(echo "$ICONURL" |
        grep -i -o "href\=\(.*\)" | \
        sed -e "s/href//" \
            -e 's/\"//g' \
            -e "s/'//g" \
            -e "s/\=//" \
            -e "s/>.*$//g"
        )
    ICONURL=$( echo "$ICONURL" | awk '{print $1}' )
    local no_proto=$(echo $ICONURL | grep -i '^\/\/') # eg. //example.com/favicon.ico
    if [ "$no_proto" ]; then ICONURL='https:'${ICONURL}; fi # add protocol https
    echo $ICONURL > $localIcoUrl
    # echo -e ${cYELLOW}'  msg: base site icon url -> '${cNORMAL}${ICONURL} '...';
}

# get baseurl site to look for 'shortcut icon' in <link ... />
get_site_base() {
    clean_temp_icon
    local BURL=$1
    local logfile="$LOGDIR/$MONTHLY-$DAY.log"
    echo -e ${cYELLOW}'  msg: fetching base site -> '${cNORMAL}${BURL} '...';

    if [ $USECURL = '1' ]; then
      curl $CURLOPTS_1 --user-agent "$_USERAGENT_0" "$BURL" -o "$localHtml" -v --stderr - >> $logfile
    else
      wget $WGETOPTS_1 --user-agent="'$_USERAGENT_0'" "$BURL" -O "$localHtml" -a $logfile
    fi
}

is_file_ico() {
    # TODO 1. check for binary or magicnumber
    iconType='';
    if [ ! -f "$1" ]; then return 1; fi
    # dependencies=file, need another option if possible

    # get mime/encoding
    local mime=$(file --mime-type --mime-encoding $1)
    local charset=${mime##*=}
    mime=${mime##*/}; mime=${mime%%;*}
    if [ ! "$charset" = 'binary' ]; then return 1; fi

    # test for .ico file
    case $mime in
        x-icon|vnd.microsoft.icon|x-ms-bmp|png|gif|jpeg) iconType=$mime; return 0 ;;
    esac
    return 1;
}

check_icon_size() {
    if [ -f "$localSHdr" ]; then rm -f "$localSHdr"; fi
    local url=$1

    if [ $USECURL = '1' ]; then
        curl $CURLOPTS_1 --user-agent "$_USERAGENT_0" "$url" -s --dump-header "$localSHdr" > /dev/null 2>&1
        lentxt='^Content-Length'
    else
        wget $WGETOPTS_1 --user-agent="'$_USERAGENT_0'" -S --spider "$url" -a "$localSHdr"
        lentxt='^Length'
    fi

    local len=$(cat "$localSHdr" | grep -i "$lentxt" | awk '{print $2}' | tac | grep -i -m1 -o '^[0-9]*')
    if [ $size_limit -ge "$(($len))" -a 0 -lt "$(($len))" ]; then
        return 0;
    else
        echo -e ${cRED}"  msg: icon size too large or zero size"${cNORMAL};
        return 1
    fi
}

fetch_feedicon() {
    clean_temp_icon; local _fi=$1
    local logfile="$LOGDIR/$MONTHLY-$DAY.log"
    echo -e ${cYELLOW}"  msg: fetching icon ->${cNORMAL} $_fi ...";
    if check_icon_size "$_fi"; then
        if [ $USECURL = '1' ]; then
          curl $CURLOPTS_1 --user-agent "$_USERAGENT_0" "$_fi" -o "$localIco" -v --stderr - >> $logfile
        else
          wget $WGETOPTS_1 --user-agent="'$_USERAGENT_0'" "$_fi" -O "$localIco" -a $logfile
        fi
    fi
}

clean_temp_icon() {
    ICONURL=''
    if [ -f "$localIco" ]; then rm -f "$localIco"; fi
    if [ -f "$localSHdr" ]; then rm -f "$localSHdr"; fi
    if [ -f "$localHtml" ]; then rm -f "$localHtml"; fi
    if [ -s "$localIcoUrl" ]; then rm -f $localIcoUrl; fi
}

# get "$url/favicon.ico" # (ico|png|jpeg|...)
get_feedicon() {
    parse_url $1 # get url parts
    BURL=${proto}${host}
    if [ ! "$BURL" ]; then return; fi
    ICONURL=''
    BURL=$(echo $url | sed -e "s,?.*$,," -e "s,/*$,,")

    # 1. Use RSS url dirname variants (direct guess and fetch)
    local u1=$BURL
    local fs=$(($(echo $u1 | grep -o '/' | wc -l) + 1))
    seq $fs | while read s; do
        echo "  $s --- $u1"
        fetch_feedicon "${proto}$u1/favicon.ico"
        u1=$(dirname $u1)
    done
    if is_file_ico $localIco; then
        echo -e ${cYELLOW}'  msg: favicon.ico is available - '${cGREEN}'download success'${cNORMAL};
        return;
    else
        echo -e ${cRED}'  msg: favicon.ico not available, retrying ...'${cNORMAL};
    fi

    clean_temp_icon
    # 2. Try to extract from RSS url dirname variant pages
    if [ ! "$ICONURL" ]; then
        if [ "$fs" = 0 ]; then fs=1; fi # run atleast once
        seq $fs | while read s; do
            echo "  $s --- $BURL"
            get_site_base "${proto}$BURL"
            parse_feed_icon_url
            BURL=$(dirname $BURL)
        done
    fi

    if [ -s "$localIcoUrl" ]; then ICONURL=$(cat $localIcoUrl); fi
    if [ ! "$ICONURL" ]; then
        echo -e ${cRED}'  msg: shortcut icon not available'${cNORMAL};
        return;
    fi

    is_furl=$(echo $ICONURL | grep -i '^http'); DATAURI='';
    for u in $ICONURL; do # handle sites with multiple favicons
        if is_datauri $u; then #is a datauri
            DATAURI=$u;
            echo -e ${cGREEN}'  msg: shortcut datauri-icon download success'${cNORMAL};
            return;
        fi
        u=$(echo $u | sed -e "s,/*$,,")
        if [ "$is_furl" ]; then
            fetch_feedicon $u
        else
            BURL=${proto}${host}
            fetch_feedicon "$BURL/$u"
        fi
        if is_file_ico $localIco; then
            echo -e ${cGREEN}'  msg: shortcut icon download success'${cNORMAL};
            return;
        fi
    done
    clean_temp_icon
    echo -e ${cRED}'  msg: shortcut icon not available'${cNORMAL};

}

_make_datauri_file() {
    local _i="${localIco%%.ico}.ico.txt"
    if [ "$DATAURI" != "" ]; then
        echo $DATAURI > "$_i"
    else
        if [ ! -s "$localIco" ]; then return; fi
        echo 'image/'${iconType}';base64,' > "$_i"
        base64 "$localIco" >> "$_i"
    fi

    chmod 0644 "$_i"
    mv -f "$_i" "$ICONTXTDIR/$a/$b/$URLSUM.ico.txt"
    echo -e ${cGREEN}'feedicon::update-feedicon -> creating datauri file done'${cNORMAL};
    clean_temp_icon
}

update_feedicon() {
    local URLSUM=$1
    a=$(echo $URLSUM | cut -b 1 -)
    b=$(echo $URLSUM | cut -b 1-2 -)
    if [ ! -d "$ICONTXTDIR/$a/$b" ]; then return; fi
    local iconfile="$ICONTXTDIR/$a/$b/$URLSUM.ico.txt"

    if [ -f "$iconfile" ]; then
        printf "${cGREEN}Nothing done ! icon already downloaded${cNORMAL} -> $URLSUM\n";
        return;
    fi

    #local dbname=$1
    query="SELECT dbname FROM rss_url WHERE sha1sum='$URLSUM';";
    local dbname=$(echo "$query" | sqlite3 "$CONFIGDIR/urls.db");
    if [ ! $dbname ]; then
        printf "${cRED}Nothing done ! (no record found)${cNORMAL}\n";
        return;
    fi
    get_siteurl_from_db $dbname $URLSUM

    if [ ! $rssurl ]; then 
        printf "${cRED}Nothing done ! (no rss file)${cNORMAL}\n";
        return;
    fi
    get_feedicon $rssurl

    _make_datauri_file
    if [ ! -s "$iconfile" ]; then return; fi

    update_icon_status "$URLSUM" '1' "$dbname"
    echo -e ${cGREEN}'feedicon::update-feedicon -> icon update done'${cNORMAL};

}

update_icon_status() {
    local URLSUM=$1; local status=$2; local dbname=$3;
    _update_icon_dbstatus "$URLSUM" "$status"
    echo $EPOCH > "$DATADIR/icon.$dbname.lastfetch"
    generate_icons_cache_hash_list
}

update_icons_status_all() {
    find $ICONTXTDIR -name *.ico.txt |
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
    find "$ICONTXTDIR" -name '*.ico.txt' | grep -o -E '[0-9a-f]{40}' - > "$ICONTXTDIR/icons-hash.txt"
    # find "$ICONTXTDIR" -name '*.ico.txt' | rev | cut -b 9-48 - | rev > "$ICONTXTDIR/icons-hash.txt"
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
    # find $ICONTXTDIR -name *.ico.txt | xargs rm -f -
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


