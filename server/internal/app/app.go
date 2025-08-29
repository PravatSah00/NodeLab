package app

import (
	"context"
	"nodelab/internal/platform"
	"nodelab/internal/platform/database"
	"nodelab/internal/platform/logger"

	"go.uber.org/fx"
)

type App struct {
	app *fx.App
}

// New builds the Fx app
func New() *App {

	// Create fx app
	app := fx.New(
		platform.Module,
		fx.Invoke(func(db *database.Database, logger *logger.Logger) {

			// logger.Info("Database testing")
			error := db.Ping(context.Background())
			logger.Error(error)
		}),
	)

	return &App{app: app}
}

// Run starts the Fx application
func (a *App) Run() {
	a.app.Run()
}
