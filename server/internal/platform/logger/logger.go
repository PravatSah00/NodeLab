package logger

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"time"

	"nodelab/internal/platform/config"

	"github.com/fatih/color"
	rotatelogs "github.com/lestrrat-go/file-rotatelogs"
)

// Logger interface
type Logger struct {
	info    *log.Logger
	error   *log.Logger
	success *log.Logger
}

// New creates a new Logger instance
func New(cfg *config.Config) (*Logger, error) {

	// Get logg config
	logDir := cfg.GetString("log.logFolder")
	logPrefix := cfg.GetString("log.logPrefix")

	// pattern: logs/app.%Y-%m-%d.log
	path := fmt.Sprintf("%s/%s.%%Y-%%m-%%d.log", logDir, logPrefix)

	// Create log directory if not exist
	if err := os.MkdirAll(logDir, 0o755); err != nil {
		return nil, err
	}

	// rotatelogs options
	opts := []rotatelogs.Option{
		rotatelogs.WithLinkName(fmt.Sprintf("%s/%s.log", logDir, logPrefix)),
		rotatelogs.WithRotationTime(24 * time.Hour),
	}

	// max backups (rotation count) if provided
	if n := cfg.GetInt("log.maxBackups"); n > 0 {
		opts = append(opts, rotatelogs.WithRotationCount(uint(n)))
	}

	// max age if provided (in days)
	if days := cfg.GetInt("log.maxAge"); days > 0 {
		opts = append(opts, rotatelogs.WithMaxAge(time.Duration(days)*24*time.Hour))
	}

	rotator, err := rotatelogs.New(path, opts...)
	if err != nil {
		return nil, err
	}

	// Writer is file-only. Console printing is handled manually (to avoid duplicates).
	fileWriter := io.Writer(rotator)

	// Prepare loggers for file output. We include a level prefix so files show level too.
	flags := log.Ldate | log.Ltime | log.Lshortfile // timestamp + short file:line
	infoLogger := log.New(fileWriter, "INFO: ", flags)
	errorLogger := log.New(fileWriter, "ERROR: ", flags)
	successLogger := log.New(fileWriter, "SUCCESS: ", flags)

	return &Logger{
		info:    infoLogger,
		error:   errorLogger,
		success: successLogger,
	}, nil
}

/*
Helper: formatArgs
- If a single argument and it's a string => returns string directly (no JSON quoting)
- If a single non-string arg => try to JSON marshal prettily; on failure fallback to fmt.Sprint
- If multiple args => use fmt.Sprint(v...)
*/
func formatArgs(v ...any) string {
	if len(v) == 0 {
		return ""
	}
	if len(v) == 1 {
		switch t := v[0].(type) {
		case string:
			return t
		default:
			// try JSON
			if b, err := json.MarshalIndent(t, "", "  "); err == nil {
				return string(b)
			}
			// fallback silently
			return fmt.Sprint(t)
		}
	}
	// multiple args -> simple sprint (like fmt.Println)
	return fmt.Sprint(v...)
}

// Print message in console
func printConsole(level string, col color.Attribute, msg string) {
	color.New(col).Printf("[%s] %s: %s\n", time.Now().Format("2006-01-02 15:04:05"), level, msg)
}

// Info logs informational messages.
func (l *Logger) Info(v ...any) {
	msg := formatArgs(v...)
	// file: use Output(2, ...) so file:line points to caller
	_ = l.info.Output(2, msg)
	printConsole("INFO", color.FgCyan, msg)
}

// Infof logs formatted informational message.
func (l *Logger) Infof(format string, v ...any) {
	msg := fmt.Sprintf(format, v...)
	_ = l.info.Output(2, msg)
	printConsole("INFO", color.FgCyan, msg)
}

// Error logs error messages.
func (l *Logger) Error(v ...any) {
	msg := formatArgs(v...)
	_ = l.error.Output(2, msg)
	printConsole("ERROR", color.FgRed, msg)
}

// Errorf logs formatted error message.
func (l *Logger) Errorf(format string, v ...any) {
	msg := fmt.Sprintf(format, v...)
	_ = l.error.Output(2, msg)
	printConsole("ERROR", color.FgRed, msg)
}

// Success logs success messages.
func (l *Logger) Success(v ...any) {
	msg := formatArgs(v...)
	_ = l.success.Output(2, msg)
	printConsole("SUCCESS", color.FgGreen, msg)
}

// Successf logs formatted success message.
func (l *Logger) Successf(format string, v ...any) {
	msg := fmt.Sprintf(format, v...)
	_ = l.success.Output(2, msg)
	printConsole("SUCCESS", color.FgGreen, msg)
}
