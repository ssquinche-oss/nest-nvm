import { Test, TestingModule } from '@nestjs/testing';
import { LibrosController } from './libros.controller';
import { LibrosService } from './libros.service';
import { PrismaService } from '../prisma/prisma.service';
import { Response } from 'express';

describe('LibrosController (Unit / Integration)', () => {
  let controller: LibrosController;
  let service: LibrosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LibrosController],
      providers: [LibrosService, PrismaService],
    }).compile();

    controller = module.get<LibrosController>(LibrosController);
    service = module.get<LibrosService>(LibrosService);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('GET /libros - debe listar los libros iniciales', async () => {
    const libros = await controller.findAll();
    expect(Array.isArray(libros)).toBe(true);
    expect(libros.length).toBeGreaterThanOrEqual(3);
  });

  it('GET /libros/1 - debe devolver el libro 1', async () => {
    const libro = await controller.findOne(1);
    expect(libro.id).toBe(1);
    expect(libro.titulo).toBe('Cien años de soledad');
  });

  it('POST /libros - debe crear un nuevo libro con Location header', async () => {
    const mockRes = {
      setHeader: jest.fn(),
    } as unknown as Response;

    const nuevo = await controller.create(
      { titulo: 'Pedro Páramo', autor: 'Rulfo', disponible: true },
      mockRes,
    );

    expect(nuevo.id).toBe(4);
    expect(mockRes.setHeader).toHaveBeenCalledWith('Location', '/libros/4');
  });

  it('PUT /libros/:id - debe reemplazar el libro', async () => {
    const actualizado = await controller.update(4, {
      titulo: 'Pedro Páramo (Edición Completa)',
      autor: 'Juan Rulfo',
      disponible: true,
    });

    expect(actualizado.titulo).toBe('Pedro Páramo (Edición Completa)');
    expect(actualizado.autor).toBe('Juan Rulfo');
  });

  it('PATCH /libros/:id - debe modificar solo disponible', async () => {
    const parchado = await controller.patch(4, { disponible: false });
    expect(parchado.disponible).toBe(false);
  });

  it('DELETE /libros/:id - debe eliminar el libro', async () => {
    await controller.remove(4);
    await expect(controller.findOne(4)).rejects.toThrow();
  });
});
