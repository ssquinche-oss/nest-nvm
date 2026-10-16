import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';
import { Libro } from './entities/libro.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LibrosService implements OnModuleInit {
  private libros: Libro[] = [
    { id: 1, titulo: 'Cien años de soledad', autor: 'García Márquez', disponible: true },
    { id: 2, titulo: 'El túnel', autor: 'Sabato', disponible: true },
    { id: 3, titulo: 'Rayuela', autor: 'Cortázar', disponible: false },
  ];
  private siguienteId = 4;

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    if (this.prisma.isConnected && this.prisma.libro) {
      try {
        const count = await this.prisma.libro.count();
        if (count === 0) {
          await this.prisma.libro.create({
            data: { titulo: 'Cien años de soledad', autor: 'García Márquez', disponible: true },
          });
          await this.prisma.libro.create({
            data: { titulo: 'El túnel', autor: 'Sabato', disponible: true },
          });
          await this.prisma.libro.create({
            data: { titulo: 'Rayuela', autor: 'Cortázar', disponible: false },
          });
        }
      } catch {
        // En caso de que la tabla aún no exista
      }
    }
  }

  private parseBoolean(val: any): boolean | undefined {
    if (val === undefined || val === null) return undefined;
    if (typeof val === 'string') {
      return val.trim().toLowerCase() === 'true';
    }
    return Boolean(val);
  }

  async findAll(autor?: string): Promise<Libro[]> {
    if (this.prisma.isConnected && this.prisma.libro) {
      if (autor) {
        return this.prisma.libro.findMany({
          where: {
            autor: { contains: autor, mode: 'insensitive' },
          },
          orderBy: { id: 'asc' },
        });
      }
      return this.prisma.libro.findMany({ orderBy: { id: 'asc' } });
    }

    if (autor) {
      const filtro = autor.trim().toLowerCase();
      return this.libros
        .filter((l) => l.autor.toLowerCase().includes(filtro))
        .map((l) => ({ ...l }));
    }
    return this.libros.map((l) => ({ ...l }));
  }

  async findOne(id: number): Promise<Libro> {
    if (this.prisma.isConnected && this.prisma.libro) {
      const libro = await this.prisma.libro.findUnique({ where: { id } });
      if (!libro) {
        throw new NotFoundException(`No existe el libro ${id}`);
      }
      return libro;
    }

    const libro = this.libros.find((l) => l.id === id);
    if (!libro) {
      throw new NotFoundException(`No existe el libro ${id}`);
    }
    return { ...libro };
  }

  async create(createLibroDto: CreateLibroDto): Promise<Libro> {
    const disponible = this.parseBoolean(createLibroDto.disponible) ?? true;

    if (this.prisma.isConnected && this.prisma.libro) {
      return this.prisma.libro.create({
        data: {
          titulo: createLibroDto.titulo,
          autor: createLibroDto.autor,
          disponible,
        },
      });
    }

    const nuevoLibro: Libro = {
      id: this.siguienteId++,
      titulo: createLibroDto.titulo,
      autor: createLibroDto.autor,
      disponible,
    };
    this.libros.push(nuevoLibro);
    return { ...nuevoLibro };
  }

  async update(id: number, updateLibroDto: UpdateLibroDto): Promise<Libro> {
    const disponible = this.parseBoolean(updateLibroDto.disponible);

    if (this.prisma.isConnected && this.prisma.libro) {
      await this.findOne(id);
      return this.prisma.libro.update({
        where: { id },
        data: {
          titulo: updateLibroDto.titulo,
          autor: updateLibroDto.autor,
          ...(disponible !== undefined ? { disponible } : {}),
        },
      });
    }

    const index = this.libros.findIndex((l) => l.id === id);
    if (index === -1) {
      throw new NotFoundException(`No existe el libro ${id}`);
    }

    const libroActualizado: Libro = {
      id,
      titulo: updateLibroDto.titulo ?? this.libros[index].titulo,
      autor: updateLibroDto.autor ?? this.libros[index].autor,
      disponible: disponible ?? this.libros[index].disponible,
    };
    this.libros[index] = libroActualizado;
    return { ...libroActualizado };
  }

  async patch(id: number, updateLibroDto: UpdateLibroDto): Promise<Libro> {
    const disponible = this.parseBoolean(updateLibroDto.disponible);

    if (this.prisma.isConnected && this.prisma.libro) {
      await this.findOne(id);
      return this.prisma.libro.update({
        where: { id },
        data: {
          ...(updateLibroDto.titulo !== undefined ? { titulo: updateLibroDto.titulo } : {}),
          ...(updateLibroDto.autor !== undefined ? { autor: updateLibroDto.autor } : {}),
          ...(disponible !== undefined ? { disponible } : {}),
        },
      });
    }

    const index = this.libros.findIndex((l) => l.id === id);
    if (index === -1) {
      throw new NotFoundException(`No existe el libro ${id}`);
    }

    const actual = this.libros[index];
    const libroActualizado: Libro = {
      ...actual,
      ...(updateLibroDto.titulo !== undefined ? { titulo: updateLibroDto.titulo } : {}),
      ...(updateLibroDto.autor !== undefined ? { autor: updateLibroDto.autor } : {}),
      ...(disponible !== undefined ? { disponible } : {}),
    };
    this.libros[index] = libroActualizado;
    return { ...libroActualizado };
  }

  async remove(id: number): Promise<void> {
    if (this.prisma.isConnected && this.prisma.libro) {
      await this.findOne(id);
      await this.prisma.libro.delete({ where: { id } });
      return;
    }

    const index = this.libros.findIndex((l) => l.id === id);
    if (index === -1) {
      throw new NotFoundException(`No existe el libro ${id}`);
    }
    this.libros.splice(index, 1);
  }
}
