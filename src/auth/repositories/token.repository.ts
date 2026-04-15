import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../db/schema.js";
import { refreshTokens } from "../../db/schema.js";
import type { CreateTokenDto } from "../interfaces/token.interfaces.js";

class TokenRepository {
  constructor(private db: NodePgDatabase<typeof schema>) {}

  async pushToken(data: CreateTokenDto) {
    const [result] = await this.db
      .insert(refreshTokens)
      .values(data)
      .returning();
    return result;
  }

  async findByHash(tokenHash: string) {
    const [result] = await this.db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.tokenHash, tokenHash));
    return result ?? null;
  }

  async deleteByHash(tokenHash: string) {
    const result = await this.db
      .delete(refreshTokens)
      .where(eq(refreshTokens.tokenHash, tokenHash))
      .returning();

    return result[0] ?? null;
  }

  async deleteAllForUser(userId: number) {
    const result = await this.db
      .delete(refreshTokens)
      .where(eq(refreshTokens.userId, userId))
      .returning();

    return result ?? null;
  }
}

export default TokenRepository;
