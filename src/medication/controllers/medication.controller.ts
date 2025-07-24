import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { MedicationService } from '../services/medication.service';
import { CreateMedicationDto } from '../dto/create-medication.dto';
import { UpdateMedicationDto } from '../dto/update-medication.dto';

@ApiTags('Medications')
@Controller('medications')
export class MedicationController {
  constructor(private readonly medicationService: MedicationService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo medicamento' })
  @ApiResponse({ status: 201, description: 'Medicamento creado exitosamente.' })
  @ApiResponse({ status: 409, description: 'Ya existe un medicamento con ese nombre.' })
  create(@Body() createMedicationDto: CreateMedicationDto) {
    return this.medicationService.create(createMedicationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los medicamentos' })
  @ApiQuery({ name: 'disease', required: false, description: 'Filtrar por enfermedad' })
  @ApiResponse({ status: 200, description: 'Lista de medicamentos obtenida exitosamente.' })
  findAll(@Query('disease') disease?: string) {
    if (disease) {
      return this.medicationService.findByDisease(disease);
    }
    return this.medicationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un medicamento por ID' })
  @ApiParam({ name: 'id', description: 'ID del medicamento' })
  @ApiResponse({ status: 200, description: 'Medicamento encontrado.' })
  @ApiResponse({ status: 404, description: 'Medicamento no encontrado.' })
  findById(@Param('id') id: string) {
    return this.medicationService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un medicamento' })
  @ApiParam({ name: 'id', description: 'ID del medicamento' })
  @ApiResponse({ status: 200, description: 'Medicamento actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Medicamento no encontrado.' })
  @ApiResponse({ status: 409, description: 'Ya existe un medicamento con ese nombre.' })
  update(@Param('id') id: string, @Body() updateMedicationDto: UpdateMedicationDto) {
    return this.medicationService.update(id, updateMedicationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un medicamento' })
  @ApiParam({ name: 'id', description: 'ID del medicamento' })
  @ApiResponse({ status: 200, description: 'Medicamento eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Medicamento no encontrado.' })
  @ApiResponse({ status: 409, description: 'No se puede eliminar porque está en uso.' })
  remove(@Param('id') id: string) {
    return this.medicationService.remove(id);
  }
}
