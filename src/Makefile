
JAVA='/c/Program Files (x86)/Common Files/Oracle/Java/javapath/java.exe'
MINIFY=${JAVA} -jar ${HOME}/bin/yuicompressor-2.4.8.jar
JSMINIFY=terser
#HTMINIFY=minify --type html
HTMINIFY=html-minifier --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-tag-whitespace --use-short-doctype --minify-css true --minify-js true
# tidy check html
# jshint check js

TARGET=../bg_imgsel.hta
COMPONENTS=app.min.css app_body.min.js app_head.min.js common.min.js app.min.hta


all : ${TARGET}

${TARGET} : ${COMPONENTS}
	cp -f app.min.hta ${TARGET}
	cp -f app.ico ..
	chmod 400 ../app.ico
	chmod 400 ${TARGET}


check : clean
	# make -i
	jshint *.js
	tidy *.hta


clean :
	rm -f $(COMPONENTS)
		
%.min.hta : %.pre.min.hta
	$(HTMINIFY) $< | dos2unix > $@

%.pre.min.hta : %.hta
	tidy $< || true
	./htwrap.sh $< | dos2unix > $@

%.min.css : %.css
	csstidy $< >/dev/null 2>&1 || exit 1
	$(MINIFY) $< | dos2unix > $@

%.min.js : %.js
	jshint $< || true
	$(JSMINIFY) $< | dos2unix > $@
