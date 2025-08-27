package platform

import (
	"nodelab/internal/platform/config"
	"nodelab/internal/platform/logger"

	"go.uber.org/fx"
)

var Module = fx.Options(
	fx.Provide(
		config.New,
		logger.New,
	),
)
