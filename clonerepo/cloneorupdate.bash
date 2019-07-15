#! /bin/bash
# Usage: cloneorupdate <dir> <git remote>
# If dir does not exist, or is empty, git remote will be cloned into dir.
# If dir is non-empty, is a git repository, is clean and has the provided git remote, it is pulled
# NOTE: does not check branches and upstreams, the assumption is that it will be on master

REPODIR=$1
REMOTE=$2

if [ ! -e $REPODIR -o ! "$(ls -A $REPODIR)" ]; then
    echo cloning $REMOTE to $REPODIR
    git clone $REMOTE $REPODIR
elif [ "$(ls -A $REPODIR)" -a ! "$(git -C $REPODIR status -s)" -a "$(git -C $REPODIR remote get-url --all origin)" == "$REMOTE" ]; then
    echo pulling $REMOTE to $REPODIR
    git -C $REPODIR pull
else
    echo not clean
    exit 1
fi
