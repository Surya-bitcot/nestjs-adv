import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stop } from './stop.entity';
import { Route } from '../routes/routes.entity';
import { CreateStopDto } from './dtos/create-stop.dto';

@Injectable()
export class StopsService {
    constructor(
        @InjectRepository(Stop) private stopRepo: Repository<Stop>,
        @InjectRepository(Route) private routeRepo: Repository<Route>,
    ) {}

    async createStop(routeId: string, createStopDto: CreateStopDto): Promise<Stop> {
        const route = await this.routeRepo.findOne({ where: { id: routeId } });
        if (!route) {
            throw new NotFoundException('Route not found');
        }

        // Check if sequence number already exists for this route
        const existingStop = await this.stopRepo.findOne({
            where: { route: { id: routeId }, sequence: createStopDto.sequence }
        });

        if (existingStop) {
            throw new ConflictException('Stop with this sequence number already exists for this route');
        }

        const stop = this.stopRepo.create({
            ...createStopDto,
            route
        });

        return await this.stopRepo.save(stop);
    }

    async findOne(id: string): Promise<Stop> {
        const stop = await this.stopRepo.findOne({
            where: { id },
            relations: ['route']
        });

        if (!stop) {
            throw new NotFoundException('Stop not found');
        }

        return stop;
    }

    async getRouteStops(routeId: string): Promise<Stop[]> {
        return await this.stopRepo.find({
            where: { route: { id: routeId } },
            order: { sequence: 'ASC' }
        });
    }

    async updateStop(id: string, updateStopDto: Partial<CreateStopDto>): Promise<Stop> {
        const stop = await this.findOne(id);

        // If sequence is being updated, check for conflicts
        if (updateStopDto.sequence && updateStopDto.sequence !== stop.sequence) {
            const existingStop = await this.stopRepo.findOne({
                where: { 
                    route: { id: stop.route.id }, 
                    sequence: updateStopDto.sequence 
                }
            });

            if (existingStop) {
                throw new ConflictException('Stop with this sequence number already exists for this route');
            }
        }

        Object.assign(stop, updateStopDto);
        return await this.stopRepo.save(stop);
    }

    async removeStop(id: string): Promise<{ message: string }> {
        const stop = await this.findOne(id);
        await this.stopRepo.remove(stop);
        return { message: `Stop ${stop.name} has been removed from route` };
    }

    async reorderStops(routeId: string, stopIds: string[]): Promise<Stop[]> {
        const stops = await this.getRouteStops(routeId);
        
        // Validate all stops belong to the route
        const stopIdsInRoute = stops.map(stop => stop.id);
        const invalidStops = stopIds.filter(id => !stopIdsInRoute.includes(id));
        
        if (invalidStops.length > 0) {
            throw new BadRequestException('Some stops do not belong to this route');
        }

        // Update sequence numbers
        for (let i = 0; i < stopIds.length; i++) {
            const stop = stops.find(s => s.id === stopIds[i]);
            if (stop) {
                stop.sequence = i + 1;
                await this.stopRepo.save(stop);
            }
        }

        return await this.getRouteStops(routeId);
    }
} 