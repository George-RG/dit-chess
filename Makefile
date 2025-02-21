default: build

.PHONY: build
build:
	npm run build

.PHONY: dev
dev:
	npm run dev

.PHONY: install
install:
	npm install

.PHONY: clean
clean:
	rm -rf dist

.PHONY: fetch-engines
fetch-engines:
	curl -LO https://github.com/ethan42/arena/releases/latest/download/engines.tar.gz && tar -xvf engines.tar.gz -C ./
