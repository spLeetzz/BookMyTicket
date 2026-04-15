import { eq } from "drizzle-orm";
import * as schema from "../../db/schema.js";
import { refreshTokens } from "../../db/schema.js";
class TokenRepository {
    db;
    constructor(db) {
        this.db = db;
    }
    async pushToken(data) {
        const [result] = await this.db
            .insert(refreshTokens)
            .values(data)
            .returning();
        return result;
    }
    async findByHash(tokenHash) {
        const [result] = await this.db
            .select()
            .from(refreshTokens)
            .where(eq(refreshTokens.tokenHash, tokenHash));
        return result ?? null;
    }
    async deleteByHash(tokenHash) {
        const result = await this.db
            .delete(refreshTokens)
            .where(eq(refreshTokens.tokenHash, tokenHash))
            .returning();
        return result[0] ?? null;
    }
    async deleteAllForUser(userId) {
        const result = await this.db
            .delete(refreshTokens)
            .where(eq(refreshTokens.userId, userId))
            .returning();
        return result ?? null;
    }
}
export default TokenRepository;
