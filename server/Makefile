.PHONY: build run dev test fmt tidy clean docker generage

BINARY := bin/server
PKG := ./cmd/server

build:
	go build -o $(BINARY) $(PKG)

run:
	go run $(PKG)

dev:
	air

generate:
	go generate ./ent

test:
	go test ./...

fmt:
	gofmt -w .

tidy:
	go mod tidy

clean:
	rm -rf bin
