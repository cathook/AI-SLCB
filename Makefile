SHELL = bash

BUILD_DIR = build

STATIC_FILES = extension/manifest.json extension/popup.html
CONTENT_JS = extension/content.js

OUR_AGAR_JS = \
    $(shell find api -regex '.*\.js' 2>/dev/null) \
    $(shell find ai -regex '.*\.js' 2>/dev/null)

.PHONY: extension clean

extension:
	cp $(STATIC_FILES) $(BUILD_DIR)
	cat $(OUR_AGAR_JS) $(CONTENT_JS) > $(BUILD_DIR)/content.js

clean:
	-rm -f $(BUILD_DIR)/*
