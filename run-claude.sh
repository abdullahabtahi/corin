#!/usr/bin/env bash
# Helper script to launch Claude Code with Bedrock

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -f "$SCRIPT_DIR/.env.bedrock" ]; then
    source "$SCRIPT_DIR/.env.bedrock"
    echo "Loaded Bedrock configuration from .env.bedrock"
else
    echo "Warning: .env.bedrock not found! Ensure AWS credentials are set."
fi

exec claude "$@"
