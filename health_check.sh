#!/bin/bash

# Endpoint URL
URL="http://127.0.0.1:8080/account/user/balance?sub=${SUB_NOT_VERIFIED}"

# Wait for the endpoint to return a 200 response
until curl --fail --silent --output /dev/null "$URL"; do
    sleep 5
    echo "Retrying"
done

echo "Endpoint is up!"
