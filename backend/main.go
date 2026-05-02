package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"github.com/hierolabs/openletter/backend/internal/auth"
	"github.com/hierolabs/openletter/backend/internal/db"
	"github.com/hierolabs/openletter/backend/internal/handler"
)

func main() {
	_ = godotenv.Load()

	gormDB, err := db.Open()
	if err != nil {
		log.Fatalf("db: %v", err)
	}
	if err := db.Migrate(gormDB); err != nil {
		log.Fatalf("migrate: %v", err)
	}
	if err := db.SeedAdmin(gormDB); err != nil {
		log.Fatalf("seed admin: %v", err)
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
	r.GET("/users", handler.ListUsers(gormDB))

	// Admin routes (consumed by admin app)
	adminGroup := r.Group("/admin")
	{
		// public admin endpoints (no token required)
		adminGroup.GET("/health", handler.AdminHealth(gormDB))
		adminGroup.POST("/auth/login", handler.AdminLogin(gormDB))

		// protected admin endpoints (any authenticated admin)
		protected := adminGroup.Group("")
		protected.Use(auth.RequireAdmin())
		{
			protected.GET("/auth/me", handler.AdminMe())
			protected.GET("/users", handler.ListUsers(gormDB))
			protected.GET("/admins", handler.ListAdmins(gormDB))
		}

		// super-admin-only endpoints
		superAdmin := adminGroup.Group("")
		superAdmin.Use(auth.RequireAdmin(), auth.RequireSuperAdmin())
		{
			superAdmin.POST("/admins", handler.CreateAdmin(gormDB))
			superAdmin.PATCH("/admins/:id", handler.UpdateAdmin(gormDB))
			superAdmin.DELETE("/admins/:id", handler.DeleteAdmin(gormDB))
			superAdmin.POST("/admins/:id/reset-password", handler.ResetAdminPassword(gormDB))
		}
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
