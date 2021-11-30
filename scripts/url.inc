#!/bin/sh

## scrapped from somewhere on net
##  modified by vkrishn@insteps.net
parse_url() {
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

    if [ "$2" = "test" ]; then
        echo proto = $proto
        echo url   = $url
        echo user  = $user
        echo host  = $host
        echo path  = $path
    fi
}

is_datauri() {
    # http://en.wikipedia.org/wiki/Data_URI_scheme
    # eg. href=data:image/gif;base64
    #     src=data:image/png;base64

    if [ ! -n "$1" ]; then return; fi
    isHeader=0
    # check header
    local header=$(echo $1 | grep -o -E '(^data:image/)(x-icon|png|gif|jpeg)(\;base64)')
    if [ -n "$header" ]; then isDataUri=1; return 0; fi
    return 1;
}

