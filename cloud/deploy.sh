#!/bin/bash

# Exit on error
set -e

# Load AWS credentials from .env.aws
if [ -f ".env.aws" ]; then
    export $(cat .env.aws | xargs)
else
    echo "Error: .env.aws file not found"
    exit 1
fi

# Check if required environment variables are set
if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ] || [ -z "$AWS_DEFAULT_REGION" ]; then
    echo "Error: AWS credentials not found in .env.aws"
    echo "Required variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_DEFAULT_REGION"
    exit 1
fi

# Function to check if AWS CLI is installed
check_aws_cli() {
    if ! command -v aws &> /dev/null; then
        echo "Error: AWS CLI is not installed"
        echo "Please install AWS CLI: https://aws.amazon.com/cli/"
        exit 1
    fi
}

deploy_lambda() {
    echo "Deploying Lambda function"
    cd ./terraform
    terraform destroy -auto-approve
    terraform init -upgrade && terraform apply -auto-approve
    cd ..
    docker-compose down
    docker-compose build .
    docker-compose up -d
}

# Main execution
main() {
    # Check for AWS CLI
    check_aws_cli
    deploy_lambda
}

# Run main function with all arguments
main "$@"
