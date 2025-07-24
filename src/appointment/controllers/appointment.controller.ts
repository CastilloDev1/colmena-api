import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AppointmentService } from '../services/appointment.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';
import { UpdateAppointmentStatusDto } from '../dto/update-appointment-status.dto';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiOperation({ summary: 'Crear cita' })
  @ApiResponse({ status: 200, description: 'Cita creada.' })
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(createAppointmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las citas' })
  @ApiResponse({ status: 200, description: 'Lista de todas las citas.' })
  @ApiQuery({ name: 'date', required: false, description: 'Filtrar citas por fecha (YYYY-MM-DD)' })
  findAll(@Query('date') date?: string) {
    return this.appointmentService.findAll(date);
  }

  @Get('identification/:id')
  @ApiOperation({ summary: 'Obtener citas por identificación de usuario' })
  @ApiParam({ name: 'id', description: 'Identificación de usuario' })
  @ApiResponse({ status: 200, description: 'Citas encontradas.' })
  @ApiResponse({ status: 404, description: 'Citas no encontradas.' })
  findByUserIdentification(@Param('id') id: string) {
    return this.appointmentService.findByUserIdentification(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar cita' })
  @ApiParam({ name: 'id', description: 'ID de la cita' })
  @ApiResponse({ status: 200, description: 'Cita actualizada.' })
  update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentService.update(id, updateAppointmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar cita' })
  @ApiParam({ name: 'id', description: 'ID de la cita' })
  @ApiResponse({ status: 200, description: 'Cita eliminada.' })
  async remove(@Param('id') id: string) {
    return this.appointmentService.remove(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Actualizar el estado de una cita' })
  @ApiResponse({ status: 200, description: 'Estado de la cita actualizado.' })
  @ApiResponse({ status: 404, description: 'Cita no encontrada.' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateAppointmentStatusDto: UpdateAppointmentStatusDto,
  ) {
    return this.appointmentService.updateStatus(id, updateAppointmentStatusDto);
  }

  /**
   * Consulta los médicos disponibles para una fecha dada.
   */
  @Get('available-doctors')
  @ApiOperation({ summary: 'Obtener médicos disponibles para una fecha' })
  @ApiResponse({ status: 200, description: 'Lista de médicos disponibles.' })
  async getAvailableDoctors(@Query('date') date: string) {
    return this.appointmentService.findAvailableDoctorsByDate(date);
  }
}
