package model

import "gorm.io/gorm"

type AdminUser struct {
	gorm.Model
	Username     string `gorm:"uniqueIndex;size:64;not null" json:"username"`
	PasswordHash string `gorm:"size:255;not null" json:"-"`
	IsSuperAdmin bool   `gorm:"not null;default:false" json:"is_super_admin"`
}
