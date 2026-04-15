import Link from "next/link";
import { Header } from "@/components/header";
import { Ticket, Zap, Shield, Clock, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">
                Book Your Tickets
                <br />
                <span className="text-accent">Effortlessly</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Experience the easiest way to book tickets for your favorite events. 
                Select your seats, complete your booking, and get ready for an amazing time.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/book"
                  className="group flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 text-lg font-medium text-primary-foreground transition-all hover:bg-primary/90 sm:w-auto"
                >
                  Book Now
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/register"
                  className="w-full rounded-lg border border-border px-8 py-4 text-lg font-medium text-foreground transition-colors hover:bg-secondary sm:w-auto"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t border-border bg-muted/50 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight">
                Why Choose BookMyTicket?
              </h2>
              <p className="mt-4 text-muted-foreground">
                We make ticket booking simple, secure, and seamless
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="rounded-xl border border-border bg-card p-8 transition-colors hover:border-accent/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">Lightning Fast</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  Book your tickets in seconds with our streamlined booking process. No unnecessary steps or delays.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-xl border border-border bg-card p-8 transition-colors hover:border-accent/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">Secure Booking</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  Your data is protected with industry-standard security. Book with confidence every time.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-xl border border-border bg-card p-8 transition-colors hover:border-accent/50 sm:col-span-2 lg:col-span-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">Real-time Availability</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  See seat availability in real-time. No more double bookings or disappointments.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="flex flex-col items-center justify-between gap-8 p-8 sm:flex-row sm:p-12">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                    <Ticket className="h-8 w-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Ready to get started?</h3>
                    <p className="text-muted-foreground">
                      Book your first ticket today
                    </p>
                  </div>
                </div>
                <Link
                  href="/book"
                  className="w-full rounded-lg bg-accent px-8 py-4 text-center font-medium text-accent-foreground transition-colors hover:bg-accent/90 sm:w-auto"
                >
                  Browse Available Seats
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-accent" />
                <span className="font-semibold">BookMyTicket</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Built with Next.js
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
