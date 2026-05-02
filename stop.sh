#!/usr/bin/env bash
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUN_DIR="$ROOT/.run"

kill_tree() {
  local pid="$1"
  local child
  for child in $(pgrep -P "$pid" 2>/dev/null || true); do
    kill_tree "$child"
  done
  kill "$pid" 2>/dev/null || true
}

stop() {
  local name="$1"
  local pid_file="$RUN_DIR/$name.pid"

  if [[ ! -f "$pid_file" ]]; then
    echo "$name: no pid file"
    return
  fi

  local pid
  pid=$(cat "$pid_file")

  if kill -0 "$pid" 2>/dev/null; then
    kill_tree "$pid"
    echo "$name: stopped (pid $pid)"
  else
    echo "$name: not running (stale pid $pid)"
  fi
  rm -f "$pid_file"
}

stop backend
stop frontend
stop admin
