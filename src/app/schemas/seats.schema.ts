import { z } from "zod";

export const BookSeatSchema = z
  .object({
    seatId: z
      .number({
        error: (issue) =>
          issue.input === undefined ? "Seat ID is required" : "Invalid seat ID",
      })
      .int()
      .positive({ message: "Seat ID must be a positive integer" }),
    userId: z
      .number({
        error: (issue) =>
          issue.input === undefined
            ? "User ID is required"
            : "Invalid user ID",
      })
      .int()
      .positive({ message: "User ID must be a positive integer" }),
  })
  .strict();
