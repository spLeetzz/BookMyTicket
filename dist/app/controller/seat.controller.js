class SeatController {
    seatService;
    constructor(seatService) {
        this.seatService = seatService;
    }
    //get all seats
    async getAllSeats(req, res, next) {
        try {
            const seats = await this.seatService.getAllSeats();
            res.send(seats);
        }
        catch (error) {
            next(error);
        }
    }
    //book a seat — give the seatId and your userId
    async bookSeat(req, res, next) {
        try {
            const seatId = Number(req.params.id);
            const userId = Number(req.params.userId);
            const seat = await this.seatService.bookSeat({ seatId, userId });
            res.send(seat);
        }
        catch (error) {
            next(error);
        }
    }
}
export default SeatController;
