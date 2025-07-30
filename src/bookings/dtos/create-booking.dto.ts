import { IsNotEmpty, IsString, IsNumberString, IsUUID } from "class-validator";

export class CreateBooking {
    @IsUUID()
    @IsNotEmpty()
    tripId: string;

    @IsString()
    @IsNotEmpty()
    seatNumber: string;
}