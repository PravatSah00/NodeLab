.PHONY: build run dev test fmt tidy clean docker

BINARY := bin/server
PKG := ./cmd/server

build:
	go build -o $(BINARY) $(PKG)

run:
	go run $(PKG)

dev:
	go run $(PKG)

test:
	go test ./...

fmt:
	gofmt -w .

tidy:
	go mod tidy

clean:
	rm -rf bin
