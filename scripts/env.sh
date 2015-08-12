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
# 

fpath=$(readlink -f $0)
if [ ! "$APPDIR" ]; then APPDIR=$(dirname $(dirname $fpath)); fi
PWD=$(pwd)

SETSAMPLEDATA='1'
COMMITDATA='0'
FEEDSDIR="$APPDIR/feeds/feeds"
FEEDSURL="http://localhost/feeds"

RUNDIR="$APPDIR/run/newsbeuter"
VARDIR="$APPDIR/var/newsbeuter"
CONFIGDIR="$APPDIR/config"
SCRIPTDIR="$APPDIR/scripts"
DBDIR="$VARDIR/db"
DATADIR="$VARDIR/data"
URLDIR="$CONFIGDIR/url"
URLLOCALDIR="$CONFIGDIR/url.local"
#URLDIR="$CONFIGDIR/test"
DONEDIR="$VARDIR/.done"


# 
# newsbeuter <default config>
# wget
# 
# 


