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
# ******************************************************************
# 
# Environment variables for nbreader.
# 
# 

fpath=$(readlink -f $0)
if [ ! "$APPDIR" ]; then APPDIR=$(dirname $(dirname $fpath)); fi
PWD=$(pwd)

SETSAMPLEDATA='1'

# enable commiting changes to vcs eg. (git/hg/fossil)
COMMITDATA='0'

# enable fetching of feeds icon
FEEDICON='1'

# enable curl (fallback is wget)
USECURL='1'

# Path variables
# --------------
FEEDSDIR="$APPDIR/feeds/feeds"
FEEDSURL="http://localhost/feeds"

RUNDIR="$APPDIR/run/newsbeuter"
VARDIR="$APPDIR/var/newsbeuter"
CONFIGDIR="$APPDIR/config"
SCRIPTDIR="$APPDIR/scripts"
SQLDIR="$CONFIGDIR/sql"
URLDIR="$CONFIGDIR/url"
URLLOCALDIR="$CONFIGDIR/url.local"
#URLDIR="$CONFIGDIR/test"
DBDIR="$VARDIR/db"
DATADIR="$VARDIR/data"
DONEDIR="$VARDIR/.done"
WEBAPPDIR="$APPDIR/public"
# Icon store path
ICONTXTDIR="$FEEDSDIR"
#ICONDIR="$WEBAPPDIR/lib/icon"

# Path to articles/items webpage screenshots
ARCHIVE=""

# User agents
_USERAGENT_0='Mozilla/5.0 (X11; Linux i686 on x86_64; rv:21.0) Gecko/20100101 Firefox/21.0 Iceweasel/21.0'

# newsbeuter <default configs>
# wget
# 
WGET='/usr/bin/wget '
USERAGENT_0=" --user-agent='$_USERAGENT_0' "
WGETOPTS_1=" --timeout=20 --tries=5 --no-check-certificate "

# curl
# 
CURL='/usr/bin/curl '
CURL_PROXY=' '
#CURL_PROXY=' --socks4 localhost:9999 ' # example
CURLOPTS_1=" $CURL_PROXY -L -f -k --connect-timeout 20 --retry 5 "


