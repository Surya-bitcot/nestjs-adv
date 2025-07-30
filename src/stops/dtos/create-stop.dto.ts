import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, Max } from "class-validator";

export class CreateStopDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    location: string;

    @IsNumber()
    @Min(-90)
    @Max(90)
    latitude: number;

    @IsNumber()
    @Min(-180)
    @Max(180)
    longitude: number;

    @IsNumber()
    @Min(1)
    sequence: number;

    @IsOptional()
    @IsString()
    arrivalTime?: string;

    @IsOptional()
    @IsString()
    departureTime?: string;
} 