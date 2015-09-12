#!/bin/sh

## scrapped from somewhere on net
##  modified by vkrishn@insteps.net
parse_url () {
    if [ ! -n "$1" ]; then return; fi

    # extract the protocol
    proto="$(echo $1 | grep :// | sed -e's,^\(.*://\).*,\1,g')"
    if [ ! -n "$proto" ]; then proto='http://' ; fi

    # remove the protocol
    url=$(echo $1 | sed -e s,$proto,,g)
    if [ ! -n "$url" ]; then $proto=''; return; fi

    # extract the user (if any)
    user="$(echo $url | grep @ | cut -d@ -f1)"

    # extract the host
    host=$(echo $url | sed -e s,$user@,,g | cut -d/ -f1)

    # extract the path (if any)
    path="$(echo $url | grep / | cut -d/ -f2-)"
}

