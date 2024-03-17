#!/bin/sh -l

echo "Hello $1"
time=$(date)
echo "time=$time" >> $GITHUB_OUTPUT
ls
ls /github/home
ls /github/workspace
ls /github/workflow
ls /github/workflows