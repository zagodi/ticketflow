import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsDateString()
  date!: string;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsString()
  @IsNotEmpty()
  organizerId!: string;
}
