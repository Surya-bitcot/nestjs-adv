import { Injectable, NotFoundException, ConflictException, BadRequestException } from "@nestjs/common";
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
        return this.busRepository.find({
            relations: ['route'],
            order: { createdAt: 'DESC' }
        });
    }

    async findActiveBuses(): Promise<Bus[]> {
        return this.busRepository.find({
            where: { status: 'ACTIVE' },
            relations: ['route'],
            order: { createdAt: 'DESC' }
        });
    }

    async findOne(id: string): Promise<Bus> {
        const bus = await this.busRepository.findOne({ 
            where: { id },
            relations: ['route', 'bookings']
        });
        
        if (!bus) {
            throw new NotFoundException('Bus not found');
        }
        return bus;
    }

    async create(createBusDto: CreateBus): Promise<Bus> {
        // Validate capacity
        if (createBusDto.capacity <= 0) {
            throw new BadRequestException('Capacity must be greater than 0');
        }

        // Validate seat layout
        if (!createBusDto.seatLayout || createBusDto.seatLayout.length === 0) {
            throw new BadRequestException('Seat layout is required');
        }

        const newBus = this.busRepository.create({
            ...createBusDto,
            status: 'ACTIVE'
        });
        
        return this.busRepository.save(newBus);
    }

    async update(id: string, updateBusDto: CreateBus): Promise<Bus> {
        const bus = await this.findOne(id);
        
        // Validate capacity
        if (updateBusDto.capacity && updateBusDto.capacity <= 0) {
            throw new BadRequestException('Capacity must be greater than 0');
        }

        Object.assign(bus, updateBusDto);
        return this.busRepository.save(bus);
    }

    async updateStatus(id: string, status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE'): Promise<Bus> {
        const bus = await this.findOne(id);
        bus.status = status;
        return this.busRepository.save(bus);
    }

    async remove(id: string): Promise<void> {
        const bus = await this.findOne(id);
        
        // Check if bus has active bookings
        const activeBookings = await this.busRepository
            .createQueryBuilder('bus')
            .leftJoin('bus.bookings', 'booking')
            .where('bus.id = :id', { id })
            .andWhere('booking.status = :status', { status: 'CONFIRMED' })
            .getCount();

        if (activeBookings > 0) {
            throw new ConflictException('Cannot delete bus with active bookings');
        }

        await this.busRepository.remove(bus);
    }
}