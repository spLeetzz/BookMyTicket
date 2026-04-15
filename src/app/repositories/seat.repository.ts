import type { Pool } from "pg";
import type { BookSeatDto, Seat } from "../interfaces/seats.interfaces.js";

class SeatRepository {
  constructor(private pool: Pool) {}

  async findAll(): Promise<Seat[]> {
    const result = await this.pool.query("SELECT * FROM seats"); // equivalent to Seats.find() in mongoose
    return result.rows;
  }

  async bookSeat(data: BookSeatDto): Promise<Seat | null> {
    const conn = await this.pool.connect(); // pick a connection from the pool

    try {
      // begin transaction
      // KEEP THE TRANSACTION AS SMALL AS POSSIBLE
      await conn.query("BEGIN");

      // getting the row to make sure it is not booked
      // $1 is a variable which we are passing in the array as the second parameter of query function.
      // Why do we use $1? -> this is to avoid SQL INJECTION
      // (If you do ${id} directly in the query string,
      // then it can be manipulated by the user to execute malicious SQL code)
      const sql =
        "SELECT * FROM seats WHERE id = $1 AND is_booked = false FOR UPDATE";
      const result = await conn.query(sql, [data.seatId]);

      // if no rows found then the operation should fail — can't book
      // This shows we do not have the current seat available for booking
      if (result.rowCount === 0) {
        await conn.query("ROLLBACK");
        return null;
      }

      // if we get the row, we are safe to update
      // Again to avoid SQL INJECTION we are using $1 and $2 as placeholders
      const sqlU =
        "UPDATE seats SET is_booked = true, booked_by = $2, booked_at = NOW(), updated_at = NOW() WHERE id = $1 RETURNING *";
      const updateResult = await conn.query(sqlU, [data.seatId, data.userId]);

      // end transaction by committing
      await conn.query("COMMIT");

      return updateResult.rows[0] as Seat;
    } catch (ex) {
      await conn.query("ROLLBACK");
      throw ex;
    } finally {
      conn.release(); // release the connection back to the pool (so we do not keep the connection open unnecessarily)
    }
  }
}

export default SeatRepository;
