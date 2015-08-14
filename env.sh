#!/bin/sh

BASE_DIR="/root"
PYTHONPATH="$BASE_DIR/.virtualenvs/alarm/bin/python"
PATH="$PYTHONPATH:$PATH:$BASE_DIR/bin"

cd /opt/alarm/topotal
export PATH="$BASE_DIR/.virtualenvs/alarm/bin:$PATH"
exec "$@"
