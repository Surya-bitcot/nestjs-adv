import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateBookingDto {
  @IsOptional()
  @IsString()
  seatNumber?: string;

  @IsOptional()
  @IsIn(['CONFIRMED', 'CANCELLED'])
  status?: 'CONFIRMED' | 'CANCELLED';
}
