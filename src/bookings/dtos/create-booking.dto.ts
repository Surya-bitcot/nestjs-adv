import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateBooking {
    @IsString()
    @IsNotEmpty()
    busId: string

    @IsString()
    @IsNotEmpty()
    routeId: string

    @IsString()
    @IsNotEmpty()
    userId: string

    @IsString()
    @IsNotEmpty()
    seatNumber: string
}