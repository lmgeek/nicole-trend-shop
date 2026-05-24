#!/bin/sh
set -e

echo "================================================"
echo "  Nicole Trend Shop - Entrypoint"
echo "================================================"

echo ""
echo "Running database migrations..."
node /app/migrations/runner.js

echo ""
echo "Starting application..."
exec node /app/server.js
