import { relations } from "drizzle-orm/relations";
import { events, seats, users, refreshTokens } from "./schema.js";
export const seatsRelations = relations(seats, ({ one }) => ({
    event: one(events, {
        fields: [seats.eventId],
        references: [events.id],
    }),
    user: one(users, {
        fields: [seats.bookedBy],
        references: [users.id],
    }),
}));
export const eventsRelations = relations(events, ({ many }) => ({
    seats: many(seats),
}));
export const usersRelations = relations(users, ({ many }) => ({
    seats: many(seats),
    refreshTokens: many(refreshTokens),
}));
export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
    user: one(users, {
        fields: [refreshTokens.userId],
        references: [users.id],
    }),
}));
