#!/bin/bash
docker build --tag=web_volnaya_forums .
docker run -it -p 1337:1337 --rm --name=web_volnaya_forums web_volnaya_forums

