import { ArrayNotEmpty, IsArray, IsInt, IsNumber, IsString } from "class-validator";

export class CreateBus {
    @IsString()
    id: string;

    @IsString()
    name: string;

    @IsNumber()
    capacity: number;

    @IsArray()
    @ArrayNotEmpty()
    seatLayout: string[][];
}