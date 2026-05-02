package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
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
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5180", "http://localhost:5181"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// Public routes (consumed by frontend)
	r.GET("/health", handler.Health(gormDB))

	// Admin routes (consumed by admin app)
	adminGroup := r.Group("/admin")
	{
		adminGroup.GET("/health", handler.AdminHealth(gormDB))
	}

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
