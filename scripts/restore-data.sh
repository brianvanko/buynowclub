#!/bin/bash

# MongoDB Data Restore Script
# This script restores the BSON backup files from the psjwt folder

echo "MongoDB Data Restore Script"
echo "============================"
echo ""

# Check if mongorestore is installed
if ! command -v mongorestore &> /dev/null
then
    echo "Error: mongorestore is not installed."
    echo "Please install MongoDB Database Tools from:"
    echo "https://www.mongodb.com/try/download/database-tools"
    exit 1
fi

# Load environment variables
if [ -f .env.local ]; then
    export $(cat .env.local | grep MONGODB_URI | xargs)
else
    echo "Error: .env.local file not found"
    exit 1
fi

if [ -z "$MONGODB_URI" ]; then
    echo "Error: MONGODB_URI not set in .env.local"
    exit 1
fi

echo "MongoDB URI: ${MONGODB_URI:0:20}..."
echo ""

# Extract database name from URI
DB_NAME=$(echo $MONGODB_URI | sed -n 's/.*\/\([^?]*\).*/\1/p')

if [ -z "$DB_NAME" ]; then
    echo "Error: Could not extract database name from MONGODB_URI"
    exit 1
fi

echo "Database name: $DB_NAME"
echo "Backup directory: ./psjwt"
echo ""
echo "WARNING: This will overwrite existing data in the database!"
read -p "Do you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Restore cancelled."
    exit 0
fi

echo ""
echo "Starting restore..."
echo ""

# Run mongorestore
mongorestore \
    --uri="$MONGODB_URI" \
    --nsInclude="$DB_NAME.*" \
    --dir=./psjwt \
    --verbose

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Data restore completed successfully!"
    echo ""
    echo "Restored collections:"
    echo "  - users"
    echo "  - items"
else
    echo ""
    echo "❌ Data restore failed. Please check the error messages above."
    exit 1
fi
