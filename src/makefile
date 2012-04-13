all: prod

dev:
	mkdir -p build
	java -jar ../lib/qpp/qpp-1.0-SNAPSHOT.jar js/main.js build/mediaelement.js

prod: dev
	java -jar ../lib/compiler/compiler.jar --js build/mediaelement.js --js_output_file build/mediaelement.min.js

clean:
	rm -r build