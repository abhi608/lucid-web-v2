#!/bin/bash
export DATABASE_URL="mysql+mysqlconnector://root:qwerty@localhost/luciduser"
gunicorn manage:app -b 0.0.0.0:5000 -w 5
