import { Injectable, NotFoundException, ConflictException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Route } from "./routes.entity";
import { Repository } from "typeorm";
import { CreateRouteDto } from "./dtos/create-routes.dto";

@Injectable()
export class RoutesService {
    constructor(
        @InjectRepository(Route)
        private readonly routeRepository: Repository<Route>
    ) {}

    async findAll(): Promise<Route[]> {
        return this.routeRepository.find({
            relations: ['buses'],
            order: { createdAt: 'DESC' }
        });
    }

    async findOne(id: string): Promise<Route> {
        const route = await this.routeRepository.findOne({ 
            where: { id },
            relations: ['buses']
        });
        
        if (!route) {
            throw new NotFoundException('Route not found');
        }
        return route;
    }

    async create(createRouteDto: CreateRouteDto): Promise<Route> {
        // Validate distance
        if (createRouteDto.distance <= 0) {
            throw new BadRequestException('Distance must be greater than 0');
        }

        // Validate duration
        if (createRouteDto.duration <= 0) {
            throw new BadRequestException('Duration must be greater than 0');
        }

        // Check if route with same start and end location already exists
        const existingRoute = await this.routeRepository.findOne({
            where: {
                startLocation: createRouteDto.startLocation,
                endLocation: createRouteDto.endLocation
            }
        });

        if (existingRoute) {
            throw new ConflictException('Route with same start and end location already exists');
        }

        const newRoute = this.routeRepository.create(createRouteDto);
        return this.routeRepository.save(newRoute);
    }

    async update(id: string, updateRouteDto: CreateRouteDto): Promise<Route> {
        const route = await this.findOne(id);
        
        // Validate distance
        if (updateRouteDto.distance && updateRouteDto.distance <= 0) {
            throw new BadRequestException('Distance must be greater than 0');
        }

        // Validate duration
        if (updateRouteDto.duration && updateRouteDto.duration <= 0) {
            throw new BadRequestException('Duration must be greater than 0');
        }

        Object.assign(route, updateRouteDto);
        return this.routeRepository.save(route);
    }

    async delete(id: string): Promise<void> {
        const route = await this.findOne(id);
        
        // Check if route has buses assigned
        const busesCount = await this.routeRepository
            .createQueryBuilder('route')
            .leftJoin('route.buses', 'bus')
            .where('route.id = :id', { id })
            .getCount();

        if (busesCount > 0) {
            throw new ConflictException('Cannot delete route with assigned buses');
        }

        await this.routeRepository.remove(route);
    }
}
