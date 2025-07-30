import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get('trips')
    searchTrips(
        @Query('from') from?: string,
        @Query('to') to?: string,
        @Query('date') date?: string,
        @Query('minFare') minFare?: number,
        @Query('maxFare') maxFare?: number,
        @Query('minSeats') minSeats?: number
    ) {
        return this.searchService.searchTrips({
            from,
            to,
            date,
            minFare,
            maxFare,
            minSeats
        });
    }

    @Get('routes')
    searchRoutes(
        @Query('from') from?: string,
        @Query('to') to?: string,
        @Query('maxDistance') maxDistance?: number
    ) {
        return this.searchService.searchRoutes({
            from,
            to,
            maxDistance
        });
    }

    @Get('stats')
    getSearchStats() {
        return this.searchService.getSearchStats();
    }
} 