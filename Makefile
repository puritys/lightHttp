all: less
	node src/generater/gen.js

less:
	find  src/less/ -name *.less |  grep -o [a-zA-Z]*.less| grep -o '[a-zA-Z/]*' |grep -v less | xargs -t -n 1 -I%  lessc src/less/%.less  dest/css/%.css
