import { Header } from "@/components/header";
import { SeatGrid } from "@/components/seat-grid";
import { Calendar, MapPin, Clock } from "lucide-react";

export default function BookPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Event Info */}
        <div className="mb-10 text-center">
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Select Your Seats
          </h1>
          <p className="mt-2 text-muted-foreground">
            Choose your preferred seats and book your tickets
          </p>
          
          {/* Event Details Card */}
          <div className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-4 rounded-lg border border-border bg-card p-4 sm:gap-6">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-accent" />
              <span className="text-muted-foreground">Event Date TBD</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-accent" />
              <span className="text-muted-foreground">Time TBD</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-accent" />
              <span className="text-muted-foreground">Venue TBD</span>
            </div>
          </div>
        </div>

        {/* Seat Selection */}
        <SeatGrid />
      </main>
    </div>
  );
}
