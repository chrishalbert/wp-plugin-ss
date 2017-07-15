#!/bin/bash
while true ;
do
    if [[ ! $(pgrep -f results-page-worker.js) ]]; then
        node ./results-page-worker.js
    fi
sleep 1
done