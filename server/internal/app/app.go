package app

import (
	"fmt"
	"nodelab/internal/platform"
	"nodelab/internal/platform/config"
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
		fx.Invoke(func(cfg *config.Config, lg *logger.Logger) {
			fmt.Println("Server port:", cfg.GetInt("server.port"))
			lg.Success("error is here", map[string]any{"user": "alice", "id": 123})
		}),
	)

	return &App{app: app}
}

// Run starts the Fx application
func (a *App) Run() {
	a.app.Run()
}
