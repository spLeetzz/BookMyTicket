class EventRepository {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async findAll() {
        const result = await this.pool.query("SELECT * FROM events WHERE is_active = true ORDER BY event_at ASC");
        return result.rows;
    }
}
export default EventRepository;
