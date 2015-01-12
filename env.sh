#!/bin/sh

BASE_DIR="/root"
PYTHONPATH="$BASE_DIR/.virtualenvs/yoshikawa_alarm/bin/python"
PATH="$PYTHONPATH:$PATH:$BASE_DIR/bin"

cd /opt/yoshikawa_alarm/topotal
export PATH="$BASE_DIR/.virtualenvs/yoshikawa_alarm/bin:$PATH"
exec "$@"
