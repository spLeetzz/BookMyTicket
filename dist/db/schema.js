import { pgTable, unique, serial, varchar, boolean, timestamp, foreignKey, integer } from "drizzle-orm/pg-core";
export const users = pgTable("users", {
    id: serial().primaryKey().notNull(),
    firstName: varchar("first_name", { length: 50 }).notNull(),
    lastName: varchar("last_name", { length: 50 }),
    email: varchar({ length: 322 }).notNull(),
    passwordHash: varchar("password_hash", { length: 255 }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
    unique("users_email_key").on(table.email),
]);
export const events = pgTable("events", {
    id: serial().primaryKey().notNull(),
    title: varchar({ length: 255 }).notNull(),
    venue: varchar({ length: 255 }).notNull(),
    eventAt: timestamp("event_at", { withTimezone: true, mode: 'string' }).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
});
export const seats = pgTable("seats", {
    id: serial().primaryKey().notNull(),
    eventId: integer("event_id").notNull(),
    seatNumber: integer("seat_number").notNull(),
    isBooked: boolean("is_booked").default(false).notNull(),
    bookedBy: integer("booked_by"),
    bookedAt: timestamp("booked_at", { withTimezone: true, mode: 'string' }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
    foreignKey({
        columns: [table.eventId],
        foreignColumns: [events.id],
        name: "seats_event_id_fkey"
    }),
    foreignKey({
        columns: [table.bookedBy],
        foreignColumns: [users.id],
        name: "seats_booked_by_fkey"
    }),
    unique("seats_event_id_seat_number_key").on(table.eventId, table.seatNumber),
]);
export const refreshTokens = pgTable("refresh_tokens", {
    id: serial().primaryKey().notNull(),
    userId: integer("user_id").notNull(),
    tokenHash: varchar("token_hash", { length: 255 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
    foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "refresh_tokens_user_id_fkey"
    }),
    unique("refresh_tokens_token_hash_key").on(table.tokenHash),
]);
