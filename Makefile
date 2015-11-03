all:
	gmake compress

compress:
	cat lib.js > lightHttp.min.js.tmp
	cat lightHttp.js >> lightHttp.min.js.tmp
	java -jar  /usr/local/lib/java/yuicompressor-2.4.6.jar --charset utf8 --type js -o lightHttp.min.js  lightHttp.min.js.tmp
