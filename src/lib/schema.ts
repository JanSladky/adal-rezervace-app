// src/lib/schema.ts
import { boolean, integer, pgTable, text } from "drizzle-orm/pg-core";

// Tabulka Registrací
export const registrations = pgTable("Registration", {
  id: integer("id").primaryKey().notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  eventId: integer("eventId").notNull(),
  eventDateId: integer("eventDateId").notNull(),
  attendees: integer("attendees").default(1),
  paid: boolean("paid").notNull(),
});

// Tabulka Událostí
export const events = pgTable("Event", {
  id: integer("id").primaryKey().notNull(),
  name: text("name").notNull(),
  location: text("location").notNull(),
});

// Tabulka Termínů Událostí
export const eventDates = pgTable("EventDate", {
  id: integer("id").primaryKey().notNull(),
  date: text("date").notNull(),
});