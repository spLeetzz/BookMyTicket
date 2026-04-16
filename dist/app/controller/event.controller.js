class EventController {
    eventService;
    constructor(eventService) {
        this.eventService = eventService;
    }
    async getAllEvents(req, res, next) {
        try {
            const events = await this.eventService.getAllEvents();
            res.send(events);
        }
        catch (error) {
            next(error);
        }
    }
}
export default EventController;
