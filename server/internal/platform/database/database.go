// database/module.go
package database

import (
	"context"
	"fmt"
	"log"

	"nodelab/internal/platform/config"

	"go.uber.org/fx"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// Database wraps gorm.DB with additional methods
type Database struct {
	db *gorm.DB
}

// New creates a new database connection with FX lifecycle integration
func New(lc fx.Lifecycle, config *config.Config) (*Database, error) {

	// Create database connection
	db, err := createConnection(config)
	if err != nil {
		return nil, err
	}

	database := &Database{db: db}

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

// createConnection establishes the database connection
func createConnection(config *config.Config) (*gorm.DB, error) {

	if config == nil {
		return nil, fmt.Errorf("nil config provided")
	}

	dsn := buildDSN(config)
	if dsn == "" {
		return nil, fmt.Errorf("could not build database DSN")
	}

	gormConfig := &gorm.Config{
		Logger: getLogLevel(config),
	}

	gormDB, err := gorm.Open(postgres.Open(dsn), gormConfig)
	if err != nil {
		return nil, fmt.Errorf("failed to open gorm: %w", err)
	}

	return gormDB, nil
}

// buildDSN constructs the DSN from config
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

	// Validate the configaration
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

// getLogLevel returns the appropriate GORM log level
func getLogLevel(config *config.Config) logger.Interface {
	logLevel := config.GetString("database.loglevel")

	switch logLevel {
	case "silent":
		return logger.Default.LogMode(logger.Silent)
	case "error":
		return logger.Default.LogMode(logger.Error)
	case "warn":
		return logger.Default.LogMode(logger.Warn)
	case "info":
		return logger.Default.LogMode(logger.Info)
	default:
		return logger.Default.LogMode(logger.Warn)
	}
}

// DB returns the underlying *gorm.DB
func (d *Database) DB() *gorm.DB { return d.db }

// Ping verifies the database connection
func (d *Database) Ping(ctx context.Context) error {
	sqlDB, err := d.db.DB()
	if err != nil {
		return fmt.Errorf("failed to get sql.DB: %w", err)
	}
	return sqlDB.PingContext(ctx)
}

// Close closes the database connection
func (d *Database) Close() error {
	sqlDB, err := d.db.DB()
	if err != nil {
		return fmt.Errorf("failed to get sql.DB: %w", err)
	}
	return sqlDB.Close()
}

// WithTransaction executes a function within a transaction
func (d *Database) WithTransaction(ctx context.Context, fn func(tx *gorm.DB) error) error {
	return d.db.WithContext(ctx).Transaction(fn)
}
