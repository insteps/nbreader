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
# Code to fetch and store newsbeuter's feeds/rss/xml data, based on:
#   tags/catogory: eg. '/news/bbc.co.uk'
#   dbname: eg. news, business, dev
#
#
#

test() {
  echo 'testing...'
}

die() {
    echo "$@" >&2
    exit 1
}

###
# Make sure that the basic tools of the trade are available
#
sanity_check()
{
    which wget > /dev/null 2>&1 || die "Application needs wget in the PATH to function"
    which tar > /dev/null 2>&1 || die "Application needs tar in the PATH to function"
    which bzip2 > /dev/null 2>&1 || die "Application needs bzips in the PATH to function"
}


