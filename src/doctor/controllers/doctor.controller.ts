import { Controller, Get, Post, Body, Param, Patch, Delete, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { DoctorService } from '../services/doctor.service';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { UpdateDoctorDto } from '../dto/update-doctor.dto';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Crear doctor' })
  @ApiBody({ type: CreateDoctorDto })
  @ApiResponse({ status: 201, description: 'Doctor creado exitosamente.' })
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorService.create(createDoctorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar doctores' })
  @ApiResponse({ status: 200, description: 'Lista de doctores.' })
  findAll() {
    return this.doctorService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener doctor por ID' })
  @ApiParam({ name: 'id', description: 'id (documento) del doctor' })
  @ApiResponse({ status: 200, description: 'Doctor encontrado.' })
  @ApiResponse({ status: 404, description: 'Doctor no encontrado.' })
  findOne(@Param('id') id: string) {
    return this.doctorService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar doctor' })
  @ApiParam({ name: 'id', description: 'id (documento) del doctor' })
  @ApiResponse({ status: 200, description: 'Doctor actualizado.' })
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorService.update(id, updateDoctorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar doctor' })
  @ApiParam({ name: 'id', description: 'id (documento) del doctor' })
  @ApiResponse({ status: 200, description: 'Doctor eliminado.' })
  remove(@Param('id') id: string) {
    return this.doctorService.remove(id);
  }
}
