#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUN_DIR="$ROOT/.run"
mkdir -p "$RUN_DIR"

AIR_BIN="$(go env GOPATH)/bin/air"
if [[ ! -x "$AIR_BIN" ]]; then
  echo "Air not found at $AIR_BIN"
  echo "Install with: go install github.com/air-verse/air@latest"
  exit 1
fi

is_running() {
  local pid_file="$1"
  [[ -f "$pid_file" ]] && kill -0 "$(cat "$pid_file")" 2>/dev/null
}

start() {
  local name="$1" dir="$2"
  shift 2
  local pid_file="$RUN_DIR/$name.pid"
  local log_file="$RUN_DIR/$name.log"

  if is_running "$pid_file"; then
    echo "$name: already running (pid $(cat "$pid_file"))"
    return
  fi

  echo "Starting $name..."
  ( cd "$ROOT/$dir" && exec "$@" ) > "$log_file" 2>&1 &
  echo $! > "$pid_file"
}

start backend  backend  "$AIR_BIN"
start frontend frontend npm run dev --silent
start admin    admin    npm run dev --silent

cat <<EOF

All services started:
  backend  → http://localhost:8080  (logs: .run/backend.log)
  frontend → http://localhost:5180  (logs: .run/frontend.log)
  admin    → http://localhost:5181  (logs: .run/admin.log)

Tail logs: tail -f .run/*.log
Stop all:  ./stop.sh
EOF
