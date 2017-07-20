#!/bin/bash
while true ;
do
    if [[ ! $(pgrep work-results-pages) ]]; then
        npm run-script work-results-pages
    fi
sleep 1
done