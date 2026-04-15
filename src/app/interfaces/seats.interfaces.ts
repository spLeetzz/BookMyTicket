export interface SeatServiceDto {
  getAllSeats(): Promise<Seat[]>;
  bookSeat(data: BookSeatDto): Promise<Seat>;
}

export interface Seat {
  id: number;
  event_id: number;
  seat_number: number;
  is_booked: boolean;
  booked_by: number | null;
  booked_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface BookSeatDto {
  seatId: number;
  userId: number;
}
