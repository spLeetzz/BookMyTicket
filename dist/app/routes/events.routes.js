import { Router } from "express";
import EventController from "../controller/event.controller.js";
import EventService from "../services/event.service.js";
import EventRepository from "../repositories/event.repository.js";
import { pool } from "../../db/index.js";
const router = Router();
const eventRepo = new EventRepository(pool);
const eventService = new EventService(eventRepo);
const eventController = new EventController(eventService);
// GET /events — get all active events
router.get("/", eventController.getAllEvents.bind(eventController));
export default router;
