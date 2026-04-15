import { eq } from "drizzle-orm";
import * as schema from "../../db/schema.js";
class UserRepository {
    db;
    constructor(db) {
        this.db = db;
    }
    async findByEmail(email) {
        const [user] = await this.db
            .select()
            .from(schema.users)
            .where(eq(schema.users.email, email));
        return user ?? null;
    }
    async getUserById(id) {
        const [user] = await this.db
            .select()
            .from(schema.users)
            .where(eq(schema.users.id, id));
        return user ?? null;
    }
    async createUser(data) {
        const [user] = await this.db.insert(schema.users).values(data).returning();
        return user;
    }
}
export default UserRepository;
