#! /bin/bash
set -e
worker_cmd=$(volta which workerd || (volta install workerd && volta which workerd))

trap 'trap " " SIGTERM; kill 0; wait; rm var/*.sock' SIGINT SIGTERM

mkdir -p var

$worker_cmd serve --verbose app/config.capnp --socket-addr http=unix:./var/worker1.sock &
$worker_cmd serve --verbose app/config.capnp --socket-addr http=unix:./var/worker2.sock &
$worker_cmd serve --verbose app/config.capnp --socket-addr http=unix:./var/worker3.sock &
nginx -p . -c nginx.conf &
wait
