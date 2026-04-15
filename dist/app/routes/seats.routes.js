import { Router } from "express";
import SeatController from "../controller/seat.controller.js";
import SeatService from "../services/seat.service.js";
import SeatRepository from "../repositories/seat.repository.js";
import { pool } from "../../db/index.js";
const router = Router();
const seatRepo = new SeatRepository(pool);
const seatService = new SeatService(seatRepo);
const seatController = new SeatController(seatService);
// GET /seats — get all seats
router.get("/seats", seatController.getAllSeats.bind(seatController));
// PUT /seats/:id/:userId — book a seat, give the seatId and your userId
router.put("/seats/:id/:userId", seatController.bookSeat.bind(seatController));
export default router;
