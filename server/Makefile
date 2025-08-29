# Variables (change these as needed)
ATLAS_DIR := file://ent/migrate/migrations
ENT_SCHEMA := ent://internal/schema
DEV_URL := docker://postgres/15/test?search_path=public
PROD_URL := postgres://root:password@localhost:5432/nodelab?sslmode=disable

.PHONY: build run dev test fmt tidy clean docker generage migration-diff migration-apply migrate

BINARY := bin/server
PKG := ./cmd/server

build:
	go build -o $(BINARY) $(PKG)

run:
	go run $(PKG)

dev:
	air

test:
	go test ./...

fmt:
	gofmt -w .

tidy:
	go mod tidy

clean:
	rm -rf bin

# Generate ent code
generate:
	go generate ./ent

# Generate migration diff from Ent schema
migration-diff:
	@echo "Generating migration diff..."
	atlas migrate diff init_migration \
		--dir "$(ATLAS_DIR)" \
		--to "$(ENT_SCHEMA)" \
		--dev-url "$(DEV_URL)"

# Apply migrations to PostgreSQL
migration-apply:
	@echo "Applying migrations..."
	atlas migrate apply \
		--dir "$(ATLAS_DIR)" \
		--url "$(PROD_URL)"

# Combined target: generate diff and apply
migrate: migration-diff migration-apply
	@echo "Migration complete!"
