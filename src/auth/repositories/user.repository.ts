import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../db/schema.js";
import type { CreateUserDto } from "../interfaces/auth.interfaces.js";

class UserRepository {
  constructor(private db: NodePgDatabase<typeof schema>) {}
  async findByEmail(email: string) {
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email));
    return user ?? null;
  }

  async getUserById(id: number) {
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id));
    return user ?? null;
  }

  async createUser(data: CreateUserDto) {
    const [user] = await this.db.insert(schema.users).values(data).returning();
    return user!;
  }
}

export default UserRepository;
