#!/bin/sh -l

echo "Hello $1"
time=$(date)
echo "time=$time" >> $GITHUB_OUTPUT
ls lighthouse
copy lighthouse $GITHUB_WORKSPACE