#!/bin/sh
set -e

echo "================================================"
echo "  Nicole Trend Shop - Entrypoint - Start.sh"
echo "================================================"

echo ""
MONGO_URI="${MONGODB_URI:-mongodb://mongodb:27017/nicole-trend-shop}"
echo "MongoDB URI: ${MONGO_URI}"
MONGO_HOST=$(node -e "try { const u = new URL('$MONGO_URI'); console.log(u.hostname); } catch(e) { console.log('mongodb'); }")
MONGO_PORT=$(node -e "try { const u = new URL('$MONGO_URI'); console.log(u.port || '27017'); } catch(e) { console.log('27017'); }")
echo "MongoDB Host: ${MONGO_HOST}:${MONGO_PORT}"
echo ""
echo "Waiting for MongoDB..."
for i in $(seq 1 30); do
  node -e "
    const s = require('net').connect({ host: '$MONGO_HOST', port: $MONGO_PORT }, () => process.exit(0));
    s.on('error', (e) => { console.error('  MongoDB connection error:', e.message); process.exit(1); });
  " && break
  echo "  Attempt $i/30 - MongoDB not ready, retrying in 2s..."
  sleep 2
done

echo ""
echo "Running database migrations..."
node migrations/runner.js

echo ""
echo "Starting application..."
exec npx next start
