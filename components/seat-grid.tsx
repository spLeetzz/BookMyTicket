"use client";

import { useState } from "react";
import useSWR from "swr";
import { getSeats, bookSeat, type Seat } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Monitor, Loader2, AlertCircle, CheckCircle } from "lucide-react";

export function SeatGrid() {
  const { user, isAuthenticated } = useAuth();
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingMessage, setBookingMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { data: seats, error, isLoading, mutate } = useSWR("seats", getSeats, {
    refreshInterval: 5000, // Refresh every 5 seconds
  });

  const handleSeatClick = (seat: Seat) => {
    if (seat.isBooked) return;
    if (!isAuthenticated) {
      setBookingMessage({ type: "error", text: "Please login to book a seat" });
      return;
    }
    setSelectedSeat(seat.id === selectedSeat?.id ? null : seat);
    setBookingMessage(null);
  };

  const handleBookSeat = async () => {
    if (!selectedSeat || !user) return;

    setIsBooking(true);
    setBookingMessage(null);

    try {
      await bookSeat(selectedSeat.id, user.id);
      setBookingMessage({ type: "success", text: `Seat ${selectedSeat.seatNo} booked successfully!` });
      setSelectedSeat(null);
      mutate(); // Refresh seats
    } catch (error) {
      setBookingMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to book seat",
      });
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div>
          <p className="text-lg font-medium">Failed to load seats</p>
          <p className="text-sm text-muted-foreground">Please check if the backend is running</p>
        </div>
      </div>
    );
  }

  // Group seats by rows (assuming seatNo format like "A1", "A2", "B1", etc.)
  const seatsByRow = seats?.reduce((acc, seat) => {
    const row = seat.seatNo.charAt(0);
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>) || {};

  const sortedRows = Object.keys(seatsByRow).sort();

  return (
    <div className="space-y-8">
      {/* Screen */}
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col items-center gap-2">
          <div className="h-2 w-full rounded-t-full bg-gradient-to-b from-accent/50 to-accent/10" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Monitor className="h-4 w-4" />
            <span>SCREEN</span>
          </div>
        </div>
      </div>

      {/* Seats Grid */}
      <div className="mx-auto max-w-3xl space-y-3 px-4">
        {sortedRows.map((row) => (
          <div key={row} className="flex items-center justify-center gap-2">
            <span className="w-6 text-center text-sm font-medium text-muted-foreground">{row}</span>
            <div className="flex gap-2">
              {seatsByRow[row]
                .sort((a, b) => {
                  const numA = parseInt(a.seatNo.slice(1));
                  const numB = parseInt(b.seatNo.slice(1));
                  return numA - numB;
                })
                .map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => handleSeatClick(seat)}
                    disabled={seat.isBooked}
                    className={`flex h-10 w-10 items-center justify-center rounded-t-lg text-xs font-medium transition-all sm:h-12 sm:w-12 sm:text-sm ${
                      seat.isBooked
                        ? "cursor-not-allowed bg-seat-booked/20 text-seat-booked"
                        : selectedSeat?.id === seat.id
                        ? "scale-105 bg-seat-selected text-white ring-2 ring-seat-selected ring-offset-2 ring-offset-background"
                        : "bg-seat-available/20 text-seat-available hover:bg-seat-available/30"
                    }`}
                    title={seat.isBooked ? "Already booked" : `Seat ${seat.seatNo}`}
                  >
                    {seat.seatNo.slice(1)}
                  </button>
                ))}
            </div>
            <span className="w-6 text-center text-sm font-medium text-muted-foreground">{row}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-seat-available/20" />
          <span className="text-sm text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-seat-selected" />
          <span className="text-sm text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-seat-booked/20" />
          <span className="text-sm text-muted-foreground">Booked</span>
        </div>
      </div>

      {/* Booking Message */}
      {bookingMessage && (
        <div
          className={`mx-auto flex max-w-md items-center gap-2 rounded-lg p-4 ${
            bookingMessage.type === "success"
              ? "bg-accent/10 text-accent"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {bookingMessage.type === "success" ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span className="text-sm">{bookingMessage.text}</span>
        </div>
      )}

      {/* Book Button */}
      {selectedSeat && (
        <div className="mx-auto max-w-md rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Selected Seat</p>
              <p className="text-2xl font-bold">{selectedSeat.seatNo}</p>
            </div>
            <button
              onClick={handleBookSeat}
              disabled={isBooking}
              className="flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isBooking ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                "Book Now"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
