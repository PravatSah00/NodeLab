package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/field"
)

// User defines the user schema
type User struct {
	ent.Schema
}

// Fields of the User
func (User) Fields() []ent.Field {
	return []ent.Field{
		field.String("name"),
		field.Int("age").Positive(),
		field.Time("created_at").Default(time.Now),
	}
}
