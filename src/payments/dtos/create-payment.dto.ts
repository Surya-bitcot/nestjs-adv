import { IsNotEmpty, IsString, IsUUID, IsNumber, IsEnum, IsOptional, Min } from "class-validator";

export class CreatePaymentDto {
    @IsUUID()
    @IsNotEmpty()
    bookingId: string;

    @IsNumber()
    @Min(0)
    amount: number;

    @IsEnum(['CREDIT_CARD', 'DEBIT_CARD', 'UPI', 'WALLET', 'NET_BANKING'])
    @IsOptional()
    paymentMethod?: 'CREDIT_CARD' | 'DEBIT_CARD' | 'UPI' | 'WALLET' | 'NET_BANKING';
}

export class ProcessRefundDto {
    @IsUUID()
    @IsNotEmpty()
    paymentId: string;

    @IsString()
    @IsNotEmpty()
    refundReason: string;
} 