import { IsNotEmpty, IsString, IsUUID, IsNumber, IsDateString, Min } from "class-validator";

export class CreateTripDto {
    @IsUUID()
    @IsNotEmpty()
    busId: string;

    @IsUUID()
    @IsNotEmpty()
    routeId: string;

    @IsDateString()
    @IsNotEmpty()
    departureDate: string;

    @IsString()
    @IsNotEmpty()
    departureTime: string;

    @IsString()
    @IsNotEmpty()
    arrivalTime: string;

    @IsNumber()
    @Min(0)
    fare: number;
} 