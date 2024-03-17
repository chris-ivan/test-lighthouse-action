#!/bin/sh -l

ls /action/workspace
# print ls result
echo ls /action/workspace

echo "Hello $1"
time=$(date)
echo "time=$time" >> $GITHUB_OUTPUT