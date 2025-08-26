package app

import (
	"go.uber.org/fx"
)

type App struct {
	app *fx.App
}

// New builds the Fx app
func New() *App {
	app := fx.New(
		fx.Options(),
	)
	return &App{app: app}
}

// Run starts the Fx application
func (a *App) Run() {
	a.app.Run()
}
