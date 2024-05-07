# 测试环境
.PHONY: dev
dev:
	npm run docs:dev

# make build
.PHONY: build
build:
	npm run docs:build

# make preview
.PHONY: preview
preview:
	npm run docs:preview


