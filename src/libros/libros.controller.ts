import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { LibrosService } from './libros.service';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';
import { Libro } from './entities/libro.entity';

@Controller('libros')
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}

  @Get()
  async findAll(@Query('autor') autor?: string): Promise<Libro[]> {
    return this.librosService.findAll(autor);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Libro> {
    return this.librosService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createLibroDto: CreateLibroDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Libro> {
    const nuevoLibro = await this.librosService.create(createLibroDto);
    res.setHeader('Location', `/libros/${nuevoLibro.id}`);
    return nuevoLibro;
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLibroDto: UpdateLibroDto,
  ): Promise<Libro> {
    return this.librosService.update(id, updateLibroDto);
  }

  @Patch(':id')
  async patch(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLibroDto: UpdateLibroDto,
  ): Promise<Libro> {
    return this.librosService.patch(id, updateLibroDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.librosService.remove(id);
  }
}
