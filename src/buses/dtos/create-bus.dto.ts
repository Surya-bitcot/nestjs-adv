import { ArrayNotEmpty, IsArray, IsInt, IsNumber, IsString, Min, Max } from "class-validator";

export class CreateBus {
    @IsString()
    name: string;

    @IsInt()
    @Min(1)
    @Max(100)
    capacity: number;

    @IsArray()
    @ArrayNotEmpty()
    seatLayout: string[][];
}