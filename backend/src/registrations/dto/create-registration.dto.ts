import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { LanguagePreference } from '@prisma/client';

export class CreateRegistrationDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome completo é obrigatório' })
  @MinLength(3, { message: 'Nome completo deve ter ao menos 3 caracteres' })
  @MaxLength(150)
  fullName: string;

  // Aceita formatos com máscara vindos do front, ex: (99) 99999-9999
  @IsString()
  @IsNotEmpty({ message: 'WhatsApp é obrigatório' })
  @Matches(/^\(\d{2}\)\s?\d{4,5}-\d{4}$/, {
    message: 'WhatsApp inválido. Use o formato (99) 99999-9999',
  })
  whatsapp: string;

  @IsOptional()
  @IsEmail({}, { message: 'E-mail inválido' })
  email?: string;

  @IsEnum(LanguagePreference, {
    message: 'Preferência de idioma deve ser EN ou ES',
  })
  language: LanguagePreference;
}
