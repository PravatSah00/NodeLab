#!/bin/bash



# Exit immediately if a command fails
set -e



# STEP1: build JSVC typescript src
    echo "🔨 Building TypeScript project..."

    # Navigate to jsvm folder
    cd ./JSVC

    # Remove existing dist folder if it exists
    rm -rf dist

    # Compile TypeScript files
    npx tsc

    # Naviage back to parent directory
    cd ..

    echo "✅ TypeScript build completed. 'dist' folder created."



# STEP2: create JSVC docker image
    echo "🔨 Building JSVC image..."
    
    # Define image names
    JSVC_IMAGE="jsvc-service"

    # Build each image
    docker build -t $JSVC_IMAGE ./JSVC

    echo "✅ Image building process complete"




# STEP3: create JSVC docker network
    echo "🔨 Building JSVC network..."
    
    # Define network name
    JSVC_NETWORK="jsvc-network"

    # Build ICC disable network
    docker network create --driver bridge --opt com.docker.network.bridge.enable_icc=false $JSVC_NETWORK

    echo "✅ Image building process complete"

