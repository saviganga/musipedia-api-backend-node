#!/bin/bash

# Check if Node.js is already installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Installing Node.js and npm..."

    # Check if the system uses apt or yum package manager
    if command -v apt &> /dev/null; then
        # For Debian/Ubuntu-based systems
        sudo apt-get update
        sudo apt-get install -yq nodejs 
    elif command -v yum &> /dev/null; then
        # For CentOS/RHEL-based systems
        sudo yum install -yq nodejs
    else
        echo "Unsupported package manager. Please install Node.js and npm manually."
        exit 1
    fi

    echo "Node.js and npm installed successfully."
else
    echo "Node.js is already installed."
fi

# Display Node.js and npm versions
node_version=$(node -v)
# npm_version=$(npm -v)
echo "Node.js version: $node_version"
# echo "npm version: $npm_version"
