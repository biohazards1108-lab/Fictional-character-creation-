import { integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const characterProfiles = pgTable('character_profiles', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  name: text('name').notNull(),
  mode: text('mode').notNull(),
  age: integer('age').notNull(),
  profile: jsonb('profile').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})
