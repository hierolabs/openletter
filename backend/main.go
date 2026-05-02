package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"github.com/hierolabs/openletter/backend/internal/db"
	"github.com/hierolabs/openletter/backend/internal/handler"
)

func main() {
	_ = godotenv.Load()

	gormDB, err := db.Open()
	if err != nil {
		log.Fatalf("db: %v", err)
	}

	r := gin.Default()
	r.GET("/health", handler.Health(gormDB))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	addr := ":" + port
	log.Printf("openletter backend listening on %s", addr)
	if err := r.Run(addr); err != nil {
		log.Fatal(err)
	}
}
