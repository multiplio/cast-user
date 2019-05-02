# User login + management
[![Build Status](https://travis-ci.org/multiplio/user.svg?branch=master)](https://travis-ci.org/multiplio/user)

Login + session service

## routes
- GET ```/auth/twitter``` <br>
init twitter authentication
- GET ```/auth/twitter/callback``` <br>
twitter authentication callback
- GET ```/logout``` <br>
logout current user, redirect to ```/login```
- GET ```/identity``` <br>
get user details
```
{
    displayName:     String,
    profileImageUrl: String,
}
```
or
```401 'Not Authenticated'``` if no session
- GET ```/ready``` <br>
readiness probe, ```200 ok```

## env
```
NODE_ENV=production
PROGRAM_ALIAS=login
PORT=7000

# level = debug|info
LOG_LEVEL=debug
# file = true|false
LOG_FILE=false

# address of an email service
EMAILER_ADDRESS=

COOKIE_SECRET=

TWITTER_CONSUMER_KEY=
TWITTER_CONSUMER_SECRET=
TWITTER_CALLBACK_URL=

DATABASE_NAME=
DATABASE_PROTOCOL=
DATABASE_ADDRESS=
DATABASE_OPTIONS=
DATABASE_USER=
DATABASE_PASSWORD=
```

