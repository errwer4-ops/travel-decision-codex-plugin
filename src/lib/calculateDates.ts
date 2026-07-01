export function calculateDates(departureDate: string, returnDate: string): { nights: number; days: number } {
  const start = new Date(`${departureDate}T00:00:00Z`);
  const end = new Date(`${returnDate}T00:00:00Z`);
  const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  return {
    nights,
    days: nights + 1
  };
}

export function calculateRooms(travelers: number): number {
  return Math.ceil(travelers / 2);
}
