import { Injectable, Logger } from '@nestjs/common';
import { Trip } from '../trips/trip.entity';
import { Route } from '../routes/routes.entity';
import { Bus } from '../buses/buses.entity';

@Injectable()
export class SearchService {
    private readonly logger = new Logger(SearchService.name);
    
    // In-memory search index for demonstration
    // In production, this would be replaced with actual Elasticsearch client
    private searchIndex: Map<string, any> = new Map();

    async indexTrip(trip: Trip): Promise<void> {
        const searchDoc = {
            id: trip.id,
            type: 'trip',
            departureDate: trip.departureDate,
            departureTime: trip.departureTime,
            arrivalTime: trip.arrivalTime,
            fare: trip.fare,
            status: trip.status,
            bus: {
                id: trip.bus.id,
                name: trip.bus.name,
                capacity: trip.bus.capacity
            },
            route: {
                id: trip.route.id,
                name: trip.route.name,
                startLocation: trip.route.startLocation,
                endLocation: trip.route.endLocation,
                distance: trip.route.distance,
                duration: trip.route.duration
            },
            availableSeats: this.getAvailableSeatsCount(trip.seatMap),
            createdAt: trip.createdAt
        };

        this.searchIndex.set(`trip:${trip.id}`, searchDoc);
        this.logger.log(`Indexed trip ${trip.id}`);
    }

    async indexRoute(route: Route): Promise<void> {
        const searchDoc = {
            id: route.id,
            type: 'route',
            name: route.name,
            startLocation: route.startLocation,
            endLocation: route.endLocation,
            distance: route.distance,
            duration: route.duration,
            stops: route.stops?.map(stop => ({
                name: stop.name,
                location: stop.location,
                sequence: stop.sequence
            })) || [],
            createdAt: route.createdAt
        };

        this.searchIndex.set(`route:${route.id}`, searchDoc);
        this.logger.log(`Indexed route ${route.id}`);
    }

    async searchTrips(query: {
        from?: string;
        to?: string;
        date?: string;
        minFare?: number;
        maxFare?: number;
        minSeats?: number;
    }): Promise<any[]> {
        const results: any[] = [];

        for (const [key, doc] of this.searchIndex.entries()) {
            if (doc.type !== 'trip') continue;

            let match = true;

            if (query.from && doc.route.startLocation.toLowerCase() !== query.from.toLowerCase()) {
                match = false;
            }

            if (query.to && doc.route.endLocation.toLowerCase() !== query.to.toLowerCase()) {
                match = false;
            }

            if (query.date) {
                const tripDate = new Date(doc.departureDate).toISOString().split('T')[0];
                if (tripDate !== query.date) {
                    match = false;
                }
            }

            if (query.minFare && doc.fare < query.minFare) {
                match = false;
            }

            if (query.maxFare && doc.fare > query.maxFare) {
                match = false;
            }

            if (query.minSeats && doc.availableSeats < query.minSeats) {
                match = false;
            }

            if (match) {
                results.push(doc);
            }
        }

        // Sort by departure time
        return results.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    }

    async searchRoutes(query: {
        from?: string;
        to?: string;
        maxDistance?: number;
    }): Promise<any[]> {
        const results: any[] = [];

        for (const [key, doc] of this.searchIndex.entries()) {
            if (doc.type !== 'route') continue;

            let match = true;

            if (query.from && !doc.startLocation.toLowerCase().includes(query.from.toLowerCase())) {
                match = false;
            }

            if (query.to && !doc.endLocation.toLowerCase().includes(query.to.toLowerCase())) {
                match = false;
            }

            if (query.maxDistance && doc.distance > query.maxDistance) {
                match = false;
            }

            if (match) {
                results.push(doc);
            }
        }

        return results;
    }

    async removeFromIndex(type: string, id: string): Promise<void> {
        const key = `${type}:${id}`;
        if (this.searchIndex.has(key)) {
            this.searchIndex.delete(key);
            this.logger.log(`Removed ${type} ${id} from search index`);
        }
    }

    async updateIndex(type: string, id: string, data: any): Promise<void> {
        const key = `${type}:${id}`;
        if (this.searchIndex.has(key)) {
            const existing = this.searchIndex.get(key);
            this.searchIndex.set(key, { ...existing, ...data });
            this.logger.log(`Updated ${type} ${id} in search index`);
        }
    }

    private getAvailableSeatsCount(seatMap: any): number {
        let count = 0;
        for (const seatNumber in seatMap) {
            if (seatMap[seatNumber].status === 'AVAILABLE') {
                count++;
            }
        }
        return count;
    }

    async getSearchStats(): Promise<any> {
        const stats = {
            totalDocuments: this.searchIndex.size,
            trips: 0,
            routes: 0
        };

        for (const [key, doc] of this.searchIndex.entries()) {
            if (doc.type === 'trip') stats.trips++;
            if (doc.type === 'route') stats.routes++;
        }

        return stats;
    }
} 