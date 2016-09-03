all:
	gmake compress
	gmake watch

precommit:
	gmake compress
	
compress:
	gmake killWatch
	gmake browserify
	gmake compressWithoutQ

killWatch:
	ps aux |grep watchify  |grep -v grep | awk '{print $$2}' | xargs -I%s -t -n 1  sudo kill -9 %s 2>&1 

browserify:
	browserify lightHttp.js  -o lightHttp-browserify.js
	java -jar  /usr/local/lib/java/yuicompressor-2.4.6.jar --charset utf8 --type js -o lightHttp.min.js  lightHttp-browserify.js
	rm lightHttp-browserify.js

# mark q
compressWithoutQ:
	browserify lightHttp.js  -o lightHttp-simple.js
	java -jar  /usr/local/lib/java/yuicompressor-2.4.6.jar --charset utf8 --type js -o lightHttp-simple.min.js  lightHttp-simple.js

watch:
	gmake killWatch
	watchify lightHttp.js -o lightHttp.min.js &

test:
	mocha tests/unit/*.js tests/functional/*.js
jshint:
	node_modules/.bin/jshint -c jsHint.conf index.js
	node_modules/.bin/jshint -c jsHint.conf lib.js
	node_modules/.bin/jshint -c jsHint.conf lightHttp.js



depInit:
	sudo npm install -g browserify watchify 
