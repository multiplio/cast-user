# User login/get/logout

login & session service

[![Build Status](https://travis-ci.org/multiplio/cast-user.svg?branch=master)](https://travis-ci.org/multiplio/cast-user)

## Routes

| method | route | success | failure | comment |
|:---:|:---|:---|:---|---:|
| GET | /ready | 200 'ok' | - | kubernetes ready probe |
| GET | /logout | -> ```/login``` | - | delete user session |
| GET | /auth/twitter | -> twitter login | - | init twitter login |
| GET | /auth/twitter/callback | -> ```/```| -> ```/login``` | twitter oauth callback |
| GET | /identity | 200 ```{displayName, profileImageUrl}``` | 401 'Not Authenticated' | - |

## Env
```
NODE_ENV=production
PROGRAM_ALIAS=login
PORT=7000

LOG_LEVEL=debug
LOG_FILE=false

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
