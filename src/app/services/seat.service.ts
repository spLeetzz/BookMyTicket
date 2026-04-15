import type {
  SeatServiceDto,
  BookSeatDto,
  Seat,
} from "../interfaces/seats.interfaces.js";
import SeatRepository from "../repositories/seat.repository.js";
import ApiError from "../../utils/api.errors.js";

class SeatService implements SeatServiceDto {
  constructor(private seatRepo: SeatRepository) {}

  async getAllSeats(): Promise<Seat[]> {
    return this.seatRepo.findAll();
  }

  async bookSeat(data: BookSeatDto): Promise<Seat> {
    // payment integration should be here
    // verify payment

    const seat = await this.seatRepo.bookSeat(data);

    //if no rows found then the operation should fail — can't book
    // This shows we do not have the current seat available for booking
    if (!seat) {
      throw ApiError.conflict("Seat already booked");
    }

    return seat;
  }
}

export default SeatService;
