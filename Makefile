build: components server/**
	@component build --dev

convert:
	@component convert client/template.html

components: component.json
	@component install --dev

clean:
	rm -fr build components

.PHONY: clean
