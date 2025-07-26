import { Injectable } from "@nestjs/common";
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
        return this.routeRepository.find();
    }

    async findOne(id: string): Promise<Route> {
        const route = await this.routeRepository.findOne({ where: { id } });
        if (!route) {
            throw new Error('Route not found');
        }
        return route;
    }

    async create(createRouteDto: CreateRouteDto): Promise<Route> {
        const existingRoute = await this.findOne(createRouteDto.id as string);
        if (existingRoute) {
            throw new Error('Route already exists');
        }

        const newRoute = this.routeRepository.create(createRouteDto);
        return this.routeRepository.save(newRoute);
    }


    async update(id: string, updateRouteDto: CreateRouteDto): Promise<Route> {
        const route = await this.findOne(id);
        if (!route) {
            throw new Error('Route not found');
        }
        Object.assign(route, updateRouteDto);
        return this.routeRepository.save(route);
    }


    async delete(id: string): Promise<void> {
        const route = await this.findOne(id);
        if (!route) {
            throw new Error('Route not found');
        }
        await this.routeRepository.remove(route);
    }
}
