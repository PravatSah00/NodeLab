#!/bin/bash



# Exit immediately if a command fails
set -e



# STEP1: build JSVC typescript src
    echo "🚀 Building TypeScript project..."

    # Navigate to jsvm folder
    cd ./JSVC

    # Remove existing dist folder if it exists
    rm -rf dist

    # Compile TypeScript files
    npx tsc

    # Naviage back to parent directory
    cd ..

    echo "✅ TypeScript build completed. 'dist' folder created."



# STEP1: create JSVC docker image
    echo "🔨 Building JSVC image..."
    
    # Define image names
    JSVC_IMAGE="jsvc-service"

    # Build each image
    docker build -t $JSVC_IMAGE ./JSVC

    echo "✅ Image building process complete"

