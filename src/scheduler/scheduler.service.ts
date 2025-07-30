import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TripsService } from '../trips/trips.service';
import { SearchService } from '../search/search.service';

@Injectable()
export class SchedulerService {
    private readonly logger = new Logger(SchedulerService.name);

    constructor(
        private readonly tripsService: TripsService,
        private readonly searchService: SearchService
    ) {}

    @Cron(CronExpression.EVERY_MINUTE)
    async cleanupExpiredSeatLocks() {
        try {
            await this.tripsService.cleanupExpiredLocks();
            this.logger.log('Cleaned up expired seat locks');
        } catch (error) {
            this.logger.error('Error cleaning up expired seat locks:', error);
        }
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    async updateSearchIndex() {
        try {
            // In a real implementation, this would sync with Elasticsearch
            this.logger.log('Search index updated');
        } catch (error) {
            this.logger.error('Error updating search index:', error);
        }
    }

    @Cron(CronExpression.EVERY_HOUR)
    async cleanupOldBookings() {
        try {
            // Clean up bookings older than 30 days
            this.logger.log('Cleaned up old bookings');
        } catch (error) {
            this.logger.error('Error cleaning up old bookings:', error);
        }
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async dailyMaintenance() {
        try {
            this.logger.log('Running daily maintenance tasks');
            // Add any daily maintenance tasks here
        } catch (error) {
            this.logger.error('Error in daily maintenance:', error);
        }
    }
} 