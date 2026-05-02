package db

import (
	"fmt"
	"os"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func Open() (*gorm.DB, error) {
	dsn := os.Getenv("DATABASE_DSN")
	if dsn == "" {
		return nil, fmt.Errorf("DATABASE_DSN is not set")
	}
	return gorm.Open(mysql.Open(dsn), &gorm.Config{})
}
