#!/bin/sh -l

ls -l
# print ls result
echo ls

echo "Hello $1"
time=$(date)
echo "time=$time" >> $GITHUB_OUTPUT