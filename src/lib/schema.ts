// src/lib/schema.ts
import { boolean, integer, pgTable, text } from "drizzle-orm/pg-core";

export const registrations = pgTable("Registration", {
  id: integer("id").primaryKey().notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  eventId: integer("eventId").notNull(),
  eventDateId: integer("eventDateId").notNull(),
  attendees: integer("attendees").default(1),
  paid: boolean("paid").notNull(),
});