import EventRepository from "../repositories/event.repository.js";
class EventService {
    eventRepo;
    constructor(eventRepo) {
        this.eventRepo = eventRepo;
    }
    async getAllEvents() {
        return this.eventRepo.findAll();
    }
}
export default EventService;
