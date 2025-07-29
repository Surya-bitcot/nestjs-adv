import { IsNotEmpty, IsString, IsNumberString, IsUUID } from "class-validator";

export class CreateBooking {
    @IsUUID()
    @IsNotEmpty()
    busId: string;

    @IsUUID()
    @IsNotEmpty()
    routeId: string;

    @IsNumberString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    seatNumber: string;
}