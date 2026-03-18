import type { Trip, TripActivity, TripDay } from '../types';

const STORAGE_KEY = 'travelvista_trips';

export function getTrips(): Trip[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveTrips(trips: Trip[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  window.dispatchEvent(new Event('trips-changed'));
}

export function getTrip(id: string): Trip | undefined {
  return getTrips().find((t) => t.id === id);
}

export function createTrip(destinationId: string, name: string, numDays: number): Trip {
  const trips = getTrips();
  const days: TripDay[] = Array.from({ length: numDays }, (_, i) => ({
    dayNumber: i + 1,
    activities: [],
  }));
  const trip: Trip = {
    id: Date.now().toString(36),
    name,
    destinationId,
    days,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  trips.push(trip);
  saveTrips(trips);
  return trip;
}

export function updateTrip(updated: Trip): void {
  const trips = getTrips();
  const idx = trips.findIndex((t) => t.id === updated.id);
  if (idx !== -1) {
    trips[idx] = { ...updated, updatedAt: new Date().toISOString() };
    saveTrips(trips);
  }
}

export function deleteTrip(id: string): void {
  const trips = getTrips().filter((t) => t.id !== id);
  saveTrips(trips);
}

export function addActivity(
  tripId: string,
  dayNumber: number,
  activity: Omit<TripActivity, 'id'>
): Trip | undefined {
  const trip = getTrip(tripId);
  if (!trip) return undefined;
  const day = trip.days.find((d) => d.dayNumber === dayNumber);
  if (!day) return undefined;
  day.activities.push({ ...activity, id: Date.now().toString(36) });
  updateTrip(trip);
  return trip;
}

export function removeActivity(
  tripId: string,
  dayNumber: number,
  activityId: string
): Trip | undefined {
  const trip = getTrip(tripId);
  if (!trip) return undefined;
  const day = trip.days.find((d) => d.dayNumber === dayNumber);
  if (!day) return undefined;
  day.activities = day.activities.filter((a) => a.id !== activityId);
  updateTrip(trip);
  return trip;
}
