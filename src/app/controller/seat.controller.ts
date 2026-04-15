import type { Request, Response, NextFunction } from "express";
import type { SeatServiceDto } from "../interfaces/seats.interfaces.js";

class SeatController {
  constructor(private seatService: SeatServiceDto) {}

  //get all seats
  async getAllSeats(req: Request, res: Response, next: NextFunction) {
    try {
      const seats = await this.seatService.getAllSeats();
      res.send(seats);
    } catch (error) {
      next(error);
    }
  }

  //book a seat — give the seatId and your userId
  async bookSeat(req: Request, res: Response, next: NextFunction) {
    try {
      const seatId = Number(req.params.id);
      const userId = Number(req.params.userId);

      const seat = await this.seatService.bookSeat({ seatId, userId });
      res.send(seat);
    } catch (error) {
      next(error);
    }
  }
}

export default SeatController;
