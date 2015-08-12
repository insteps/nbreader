#!/bin/sh
# /*
# ** Copyright (c) 2015 V.Krishn
# **
# ** This program is free software; you can redistribute it and/or
# ** modify it under the terms of the Simplified BSD License (also
# ** known as the "2-Clause License" or "FreeBSD License".)
# 
# ** This program is distributed in the hope that it will be useful,
# ** but without any warranty; without even the implied warranty of
# ** merchantability or fitness for a particular purpose.
# **
# ** Author contact information:
# **   vkrishn@insteps.net
# **   http://www.insteps.net
# **
# *******************************************************************************
# **
# ** Code to run various feeds data fetch/update for newsbeuter,
# **   Search database or call newsbeuter cli.
# */
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
    if [ "$2" = '' ]; then db='news'; else db=$2; fi
    newsbeuter -u "$CONFIGDIR/url.local/$db" -c $DBDIR/$db.loc.db
fi

#usage: sh run.sh update tag|folder|url|hash <relevant data>
if [ "$1" = 'update' ]; then
source $SCRIPTDIR/update.sh

  case $2 in
    tag) update_by_tag $2 $3;;
    folder) update_by_tag $2 $3;;
    url) update_by_url $2 $3;;
    hash) update_by_hash $2 $3;;
  esac

fi

#usage: sh run.sh search <search text> <limit>
if [ "$1" = 'search' ]; then
  sh $SCRIPTDIR/search.sh "$2" "$3";
fi

if [ "$1" = 'config' ]; then
  sh $SCRIPTDIR/config.sh;
fi



# source $SCRIPTDIR/fetch.sh
## examples
# fetch_by_dbname business
# fetch_by_tag '/business/crmbuyer.com' > /dev/null 2>&1
# fetch_by_url 'http://www.crmbuyer.com/perl/syndication/rssfull.pl'
# fetch_by_tag '/news/bbc.co.uk'



# newsbeuter
# update <opts> <data>
# search <text> <limit>
# user create|delete
#


