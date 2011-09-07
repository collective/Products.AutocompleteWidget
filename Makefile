#!/usr/bin/make
#
all: bin/instance omelette test

bin/python:
	virtualenv-2.6 --no-site-packages .

bin/buildout: bin/python bootstrap.py buildout.cfg
	./bin/python bootstrap.py

bin/test: bin/buildout buildout.cfg setup.py
	./bin/buildout -vt 5 install test

bin/instance: bin/buildout buildout.cfg setup.py
	./bin/buildout -vt 5 install instance

parts/omelette: bin/buildout buildout.cfg setup.py
	./bin/buildout -vt 5 install omelette

.PHONY: test instance cleanall omelette

test: bin/test
	./bin/test

omelette: parts/omelette

instance: bin/instance
	./bin/instance fg

cleanall:
	rm -fr bin develop-eggs downloads eggs parts .installed.cfg
