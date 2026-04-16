import { Router } from "express";
import SeatController from "../controller/seat.controller.js";
import SeatService from "../services/seat.service.js";
import SeatRepository from "../repositories/seat.repository.js";
import { pool } from "../../db/index.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
const router = Router();
router.use(authenticate);
const seatRepo = new SeatRepository(pool);
const seatService = new SeatService(seatRepo);
const seatController = new SeatController(seatService);
// GET /seats — get all seats
router.get("/", seatController.getAllSeats.bind(seatController));
// GET /seats/event/:eventId — get seats specific to an event
router.get("/event/:eventId", seatController.getSeatsByEvent.bind(seatController));
// PUT /seats/:id/:userId — book a seat, give the seatId and your userId
router.put("/:id/", seatController.bookSeat.bind(seatController));
export default router;
