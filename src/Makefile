
JAVA='/c/Program Files/Java/jdk-14.0.2/bin/java'
MINIFY=${JAVA} -jar C:/Users/denis.lalanne/home/bin/yuicompressor-2.4.8.jar
JSMINIFY=terser
#HTMINIFY=minify --type html
HTMINIFY=html-minifier --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-tag-whitespace --use-short-doctype --minify-css true --minify-js true
# tidy check html
# jshint check js

TARGETS=bg_imgsel.min.css bg_imgsel_body.min.js bg_imgsel_head.min.js common.min.js bg_imgsel.min.hta

BG_IMGSEL : $(TARGETS)
	cp -f bg_imgsel.min.hta ../bg_imgsel.hta
	cp -f bg_imgsel.ico ..
	chmod 400 ../bg_imgsel.ico
	chmod 400 ../bg_imgsel.hta


check : clean
	# make -i
	jshint *.js
	tidy *.hta
	csstidy *.css


clean :
	rm -f $(TARGETS)
		
%.min.hta : %.pre.min.hta
	$(HTMINIFY) $< | dos2unix > $@

%.pre.min.hta : %.hta
	tidy $< || true
	./htwrap.sh $< | dos2unix > $@

%.min.css : %.css
	csstidy $<
	$(MINIFY) $< | dos2unix > $@

%.min.js : %.js
	jshint $< || true
	$(JSMINIFY) $< | dos2unix > $@
