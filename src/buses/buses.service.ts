import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Bus } from "./buses.entity";
import { Repository } from "typeorm";
import { CreateBus } from "./dtos/create-bus.dto";

@Injectable()
export class BusesService {
    constructor(
        @InjectRepository(Bus)
        private readonly busRepository: Repository<Bus>
    ) { }


    async findAll(): Promise<Bus[]> {
        return this.busRepository.find()
    }


    async findOne(id: string): Promise<Bus> {
        const bus = await this.busRepository.findOne({ where: { id } })
        if (!bus) {
            throw new NotFoundException('Bus not found')
        }
        return bus;
    }


    async create(createBusDto: CreateBus): Promise<Bus> {

        const bus = this.findOne(createBusDto.id as string);
        if (bus) {
            throw new NotFoundException('Bus already exists');
        }
        const newBus = this.busRepository.create(createBusDto);
        return this.busRepository.save(newBus);
    }

    async update(id: string, updateBusDto: CreateBus): Promise<Bus> {
        const bus = await this.findOne(id);
        if (!bus) {
            throw new NotFoundException('Bus not found');
        }
        Object.assign(bus, updateBusDto);
        return this.busRepository.save(bus);

    }


    async remove(id: string): Promise<void> {
        const bus = await this.findOne(id);
        if (!bus) {
            throw new NotFoundException('Bus not found');
        }
        await this.busRepository.remove(bus);
    }       

}