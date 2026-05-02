package model

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Email string `gorm:"uniqueIndex;size:255;not null" json:"email"`
	Name  string `gorm:"size:100;not null" json:"name"`
}
