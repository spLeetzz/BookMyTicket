import SeatRepository from "../repositories/seat.repository.js";
import ApiError from "../../utils/api.errors.js";
class SeatService {
    seatRepo;
    constructor(seatRepo) {
        this.seatRepo = seatRepo;
    }
    async getAllSeats() {
        return this.seatRepo.findAll();
    }
    async bookSeat(data) {
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
