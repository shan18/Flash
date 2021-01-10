#!/bin/bash

# CPU Ideal
CPU=$(sar 1 5 | grep "Average" | sed 's/^.* //')

# Login
LOGIN=$(w | grep "ubuntu" | wc -l)

if [[ 1 -eq "$(echo "${CPU} > 99" | bc)" ]] && [[ $LOGIN -lt 1 ]]
then
    shutdown -P now
fi
