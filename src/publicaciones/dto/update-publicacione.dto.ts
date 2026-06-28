import { PartialType } from '@nestjs/mapped-types';
import { PublicacionDto } from './create-publicacione.dto';

export class UpdatePublicacioneDto extends PartialType(PublicacionDto) {}
