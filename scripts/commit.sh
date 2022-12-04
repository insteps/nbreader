#!/bin/sh
# 
# Copyright (c) 2015-2022 V.Krishn
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
# Code to commit data to vcs (git/fossil/hg):
# 
# 

fpath=$(readlink -f $0)
if [ ! "$APPDIR" ]; then APPDIR=$(dirname $(dirname $fpath)); fi
PWD=$(pwd)

#source $APPDIR/scripts/env.sh

#. $SCRIPTDIR/date.inc
#. $SCRIPTDIR/color2.inc

commit_feeddir() {
    if [ $COMMITDATA != '1' ]; then
        echo "Msg: not committing now, see COMMITDATA in env.sh"; exit 0;
    fi

    if [ -n "$1" ]; then local epoch=$1; else exit 0; fi
    local act=$2;
    local commitmsg=$3;

    cd $FEEDSDIR
    printf "${cBBLUE}Committing -> ${act}:${cNORMAL} $RUNDIR/fetch/$epoch\n"
    if [ x"$act" = 'xfetchicon' ]; then echo -e ${cBROWN}'  ----'${cNORMAL}; fi
    # --- fossil ---
    # fossil addremove --dotfiles && fossil status
    # fossil --user knoppix commit --no-warnings -m "$commitmsg"
    # --- git ---
    git add . && git status -s
    git commit --quiet -am "${commitmsg}" > /dev/null 2>&1
}

commit_update() {
    if [ $COMMITDATA != '1' ]; then
        echo "Msg: not committing now, see COMMITDATA in env.sh"; exit 0;
    fi

    if [ -n "$1" ]; then epoch=$1; else exit 0; fi

    cd $APPDIR
    # printf "${cBBLUE}Committing -> update:${cNORMAL} $RUNDIR/fetch/$epoch\n"
    # fossil addremove --dotfiles && fossil commit --no-warnings -m "update: $epoch"
}


