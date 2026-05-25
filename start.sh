#!/bin/sh
set -e

echo "================================================"
echo "  Nicole Trend Shop - Entrypoint - Start.sh"
echo "================================================"

echo ""
MONGO_URI="${MONGODB_URI:-mongodb://mongodb:27017/nicole-trend-shop}"
echo "MongoDB URI: ${MONGO_URI}"
echo ""
echo "Waiting for MongoDB..."
for i in $(seq 1 30); do
  node -e "
    require('net').connect({ host: 'mongodb', port: 27017 }, () => process.exit(0))
      .on('error', () => process.exit(1))
  " 2>/dev/null && break
  echo "  Attempt $i/30 - MongoDB not ready, retrying in 2s..."
  sleep 2
done

echo ""
echo "Running database migrations..."
node migrations/runner.js

echo ""
echo "Starting application..."
exec npx next start
