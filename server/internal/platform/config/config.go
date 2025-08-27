package config

import (
	"fmt"
	"log"
	"sync"

	"github.com/spf13/viper"
)

// Config path of the project
const configPaht = "config/config.json"

// Config manages the application configuration using Viper
type Config struct {
	v  *viper.Viper
	mu sync.RWMutex
}

// New loads a single JSON config file.
func New() *Config {

	// Create a new config object
	v := viper.New()
	v.SetConfigFile(configPaht)
	v.SetConfigType("json")

	// Load the config from file
	if err := v.ReadInConfig(); err != nil {
		log.Fatalf("failed to read config: %v", err)
	}

	return &Config{v: v}
}

// Set updates a configuration value and saves it to the file
func (c *Config) Set(key string, value any) error {
	c.mu.Lock()
	defer c.mu.Unlock()

	// Set the value in config
	c.v.Set(key, value)

	// Writeback to config file
	if err := c.v.WriteConfig(); err != nil {
		return fmt.Errorf("error saving config: %w", err)
	}

	return nil
}

// GetString retrieves a string value for the given key
func (c *Config) GetString(key string) string {
	c.mu.RLock()
	defer c.mu.RUnlock()
	return c.v.GetString(key)
}

// GetInt retrieves an integer value for the given key
func (c *Config) GetInt(key string) int {
	c.mu.RLock()
	defer c.mu.RUnlock()
	return c.v.GetInt(key)
}

// GetFloat retrives an floating value for the given key
func (c *Config) GetFloat(key string) float64 {
	c.mu.RLock()
	defer c.mu.RUnlock()
	return c.v.GetFloat64(key)
}

// GetBool retrieves a boolean value for the given key
func (c *Config) GetBool(key string) bool {
	c.mu.RLock()
	defer c.mu.RUnlock()
	return c.v.GetBool(key)
}
