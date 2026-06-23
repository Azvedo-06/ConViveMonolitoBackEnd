import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { City } from './entity/city.model';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Injectable()
export class CitiesService {
  constructor(
    @InjectModel(City)
    private readonly cityModel: typeof City,
  ) {}

  async findAll() {
    return this.cityModel.findAll({
      order: [['label', 'ASC']],
    });
  }

  async create(dto: CreateCityDto) {
    const id = dto.label
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const existing = await this.cityModel.findByPk(id);
    if (existing) {
      throw new ConflictException('Cidade já cadastrada com esse nome.');
    }

    const imageUrl = dto.imageUrl || 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=900&q=80';
    const imageFallbackUrl = dto.imageFallbackUrl || 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=900&q=80';

    return this.cityModel.create({
      id,
      label: dto.label,
      theme: id,
      accentClassName: '',
      imageUrl,
      imageFallbackUrl,
      colorPrimary: dto.colorPrimary || '46 125 50',
      colorSecondary: dto.colorSecondary || '102 187 106',
      description: dto.description || '',
      tags: dto.tags || ['cultura', 'eventos'],
      spotlight: dto.spotlight || `Cidade de ${dto.label}`,
    });
  }

  async update(id: string, dto: UpdateCityDto) {
    const city = await this.cityModel.findByPk(id);
    if (!city) {
      throw new NotFoundException('Cidade não encontrada.');
    }

    if (dto.label !== undefined) city.label = dto.label;
    if (dto.imageUrl !== undefined) city.imageUrl = dto.imageUrl;
    if (dto.imageFallbackUrl !== undefined) city.imageFallbackUrl = dto.imageFallbackUrl;
    if (dto.colorPrimary !== undefined) city.colorPrimary = dto.colorPrimary;
    if (dto.colorSecondary !== undefined) city.colorSecondary = dto.colorSecondary;
    if (dto.description !== undefined) city.description = dto.description;
    if (dto.tags !== undefined) city.tags = dto.tags;
    if (dto.spotlight !== undefined) city.spotlight = dto.spotlight;

    return city.save();
  }

  async remove(id: string) {
    const city = await this.cityModel.findByPk(id);
    if (!city) {
      throw new NotFoundException('Cidade não encontrada.');
    }
    await city.destroy();
    return { message: 'Cidade excluída com sucesso.' };
  }

  async uploadImage(id: string, filename: string): Promise<any> {
    const city = await this.cityModel.findByPk(id);
    if (!city) {
      throw new NotFoundException('Cidade não encontrada.');
    }

    city.imageUrl = `/uploads/${filename}`;
    city.imageFallbackUrl = `/uploads/${filename}`;
    await city.save();

    return {
      message: 'Imagem enviada com sucesso',
      imageUrl: city.imageUrl,
    };
  }
}

