import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const registrations = pgTable("registrations", {
  id: integer("id").primaryKey().notNull(),
  name: text("name").notNull(),
  email: text("email"),
  eventName: text("event_name").notNull(),
  eventDate: text("event_date").notNull(),
  eventLocation: text("event_location").notNull(),
  isPaid: integer("is_paid").default(0),
});