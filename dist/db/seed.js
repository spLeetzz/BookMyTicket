import { validateEnv } from "../config/env.config.js";
// load env early so db is loaded accurately
validateEnv();
import { db } from "./index.js";
import { events, seats, users } from "./schema.js";
// seed random data
async function seed() {
    // USERS
    const insertedUsers = await db
        .insert(users)
        .values([
        {
            firstName: "Frodo",
            lastName: "Baggins",
            email: "frodo@shire.me",
            passwordHash: "hash1",
        },
        {
            firstName: "Sam",
            lastName: "Gamgee",
            email: "sam@shire.me",
            passwordHash: "hash2",
        },
        {
            firstName: "Cooper",
            lastName: "Brand",
            email: "cooper@nasa.space",
            passwordHash: "hash3",
        },
    ])
        .returning();
    // EVENTS
    const insertedEvents = await db
        .insert(events)
        .values([
        {
            title: "Interstellar Screening Night",
            venue: "IMAX Theater - Orion Complex",
            eventAt: new Date("2026-05-01T18:00:00Z").toISOString(),
        },
        {
            title: "Lord of the Rings Marathon",
            venue: "Rivendell Open Air Cinema",
            eventAt: new Date("2026-05-10T16:00:00Z").toISOString(),
        },
        {
            title: "The Hobbit Fan Premiere",
            venue: "Lonely Mountain Hall",
            eventAt: new Date("2026-05-15T17:30:00Z").toISOString(),
        },
    ])
        .returning();
    // SEATS (20 per event)
    for (const event of insertedEvents) {
        const seatRows = Array.from({ length: 20 }).map((_, i) => ({
            eventId: event.id,
            seatNumber: i + 1,
        }));
        await db.insert(seats).values(seatRows);
    }
}
seed().then(() => {
    console.log("Seed done");
    process.exit(0);
});
