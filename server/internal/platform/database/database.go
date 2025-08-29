// database/module.go
package database

import (
	"context"
	"fmt"
	"log"

	"nodelab/ent"
	"nodelab/internal/platform/config"

	"entgo.io/ent/dialect"
	"entgo.io/ent/dialect/sql"
	"go.uber.org/fx"

	_ "github.com/lib/pq"
)

// Database wraps the Ent client with additional methods
type Database struct {
	client *ent.Client
}

// New creates a new Ent database connection with FX lifecycle integration
func New(lc fx.Lifecycle, config *config.Config) (*Database, error) {

	// Create database connection
	client, err := createConnection(config)
	if err != nil {
		return nil, err
	}

	database := &Database{client: client}

	// Check database connection
	if err := database.Ping(context.Background()); err != nil {
		return nil, fmt.Errorf("database connection failed: %w", err)
	}

	// Register FX lifecycle hooks
	lc.Append(fx.Hook{
		OnStop: func(ctx context.Context) error {
			return database.Close()
		},
	})

	return database, nil
}

// createConnection establishes the database connection using Ent
func createConnection(config *config.Config) (*ent.Client, error) {
	if config == nil {
		return nil, fmt.Errorf("nil config provided")
	}

	dsn := buildDSN(config)
	if dsn == "" {
		return nil, fmt.Errorf("could not build database DSN")
	}

	// Create Ent client
	drv, err := sql.Open(dialect.Postgres, dsn)
	if err != nil {
		return nil, fmt.Errorf("failed opening database connection: %w", err)
	}

	// Create Ent client with the driver
	client := ent.NewClient(ent.Driver(drv))

	// Configure debug mode based on config
	if config.GetBool("database.debug") {
		client = client.Debug()
	}

	return client, nil
}

// buildDSN constructs the DSN from config (same as before)
func buildDSN(config *config.Config) string {
	// Get dns string direct
	if dsn := config.GetString("database.dsn"); dsn != "" {
		return dsn
	}

	host := config.GetString("database.host")
	port := config.GetInt("database.port")
	user := config.GetString("database.user")
	pass := config.GetString("database.password")
	name := config.GetString("database.name")
	sslMode := config.GetBool("database.sslmode")

	// Validate the configuration
	if host == "" || user == "" || name == "" || port == 0 {
		log.Printf("Incomplete database config: host=%q user=%q name=%q port=%d", host, user, name, port)
		return ""
	}

	ssl := "disable"
	if sslMode {
		ssl = "enable"
	}

	return fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s", host, port, user, pass, name, ssl)
}

// Client returns the underlying Ent client
func (d *Database) Client() *ent.Client { return d.client }

// Ping verifies the database connection
func (d *Database) Ping(ctx context.Context) error {
	// start a short-lived transaction and roll it back immediately
	tx, err := d.client.Tx(ctx)
	if err != nil {
		return err
	}
	return tx.Rollback()
}

// Close closes the database connection
func (d *Database) Close() error {
	return d.client.Close()
}

// WithTransaction executes a function within a transaction
func (d *Database) WithTransaction(ctx context.Context, fn func(tx *ent.Tx) error) error {
	tx, err := d.client.Tx(ctx)
	if err != nil {
		return err
	}

	defer func() {
		if v := recover(); v != nil {
			tx.Rollback()
			panic(v)
		}
	}()

	if err := fn(tx); err != nil {
		if rerr := tx.Rollback(); rerr != nil {
			err = fmt.Errorf("%w: rolling back transaction: %v", err, rerr)
		}
		return err
	}

	return tx.Commit()
}
