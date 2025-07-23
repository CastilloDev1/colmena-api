import { Controller, Get, Post, Body, Param, Patch, Delete, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { PatientService } from '../services/patient.service';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';

/**
 * Controlador para la gestión de pacientes.
 */
@ApiTags('Patients')
@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  /**
   * Crea un nuevo paciente.
   */
  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Crear paciente' })
  @ApiBody({ type: CreatePatientDto })
  @ApiResponse({ status: 200, description: 'Paciente creado exitosamente.' })
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.create(createPatientDto);
  }

  /**
   * Obtiene todos los pacientes.
   */
  @Get()
  @ApiOperation({ summary: 'Listar pacientes' })
  @ApiResponse({ status: 200, description: 'Lista de pacientes.' })
  findAll() {
    return this.patientService.findAll();
  }

  /**
   * Busca un paciente por su UUID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener paciente por ID' })
  @ApiParam({ name: 'id', description: 'ID del paciente' })
  @ApiResponse({ status: 200, description: 'Paciente encontrado.' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado.' })
  findOne(@Param('id') id: string) {
    return this.patientService.findOne(id);
  }

  /**
   * Actualiza los datos de un paciente.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar paciente' })
  @ApiParam({ name: 'id', description: 'ID del paciente' })
  @ApiBody({ type: UpdatePatientDto })
  @ApiResponse({ status: 200, description: 'Paciente actualizado.' })
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientService.update(id, updatePatientDto);
  }

  /**
   * Elimina un paciente por su UUID.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar paciente' })
  @ApiParam({ name: 'id', description: 'ID del paciente' })
  @ApiResponse({ status: 200, description: 'Paciente eliminado.' })
  remove(@Param('id') id: string) {
    return this.patientService.remove(id);
  }
}