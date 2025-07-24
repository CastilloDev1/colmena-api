import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { AppointmentRepository } from '../repositories/appointment.repository';
import { PatientRepository } from '../../patient/repositories/patient.repository';
import { DoctorRepository } from '../../doctor/repositories/doctor.repository';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';
import { Prisma } from '@prisma/client';
import { UpdateAppointmentStatusDto } from '../dto/update-appointment-status.dto';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly patientRepository: PatientRepository,
    private readonly doctorRepository: DoctorRepository,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    
    const { patientIdentification, doctorIdentification, date } = createAppointmentDto;

    const patient = await this.patientRepository.findByIdentification(patientIdentification);
    if (!patient) {
      throw new NotFoundException(`Paciente con identificación ${patientIdentification} no encontrado.`);
    }

    const doctor = await this.doctorRepository.findByIdentification(doctorIdentification);
    if (!doctor) {
      throw new NotFoundException(`Doctor con identificación ${doctorIdentification} no encontrado.`);
    }

    const appointmentDate = new Date(date);

    const doctorAlreadyBooked = await this.appointmentRepository.findDoctorAppointmentAtDate(
      doctor.doctorId,
      appointmentDate,
    );

    if (doctorAlreadyBooked) {
      throw new ConflictException('El doctor ya tiene una cita programada a esa hora.');
    }

    const duplicate = await this.appointmentRepository.findDuplicate(
      patient.patientId,
      doctor.doctorId,
      appointmentDate,
    );

    if (duplicate) {
      throw new ConflictException('Ya existe una cita para este paciente, doctor y fecha.');
    }

    return this.appointmentRepository.create({
      patientId: patient.patientId,
      doctorId: doctor.doctorId,  
      date: appointmentDate,
    });
  }

  async findAvailableDoctorsByDate(date: string): Promise<any> {
    return this.appointmentRepository.findAvailableDoctorsByDate(new Date(date));
  }

  async findAll(date?: string) {
    return this.appointmentRepository.findAll(date);
  }

  async findByUserIdentification(identification: string) {
    const appointments = await this.appointmentRepository.findByUserIdentification(identification);
    if (!appointments || appointments.length === 0) {
      throw new NotFoundException(`No se encontraron citas para la identificación ${identification}.`);
    }
    return appointments;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    const { patientIdentification, doctorIdentification, date, status } = updateAppointmentDto;

    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException('Cita no encontrada.');
    }

    let patientId = appointment.patientId;
    if (patientIdentification) {
      const patient = await this.patientRepository.findByIdentification(patientIdentification);
      if (!patient) throw new NotFoundException(`Paciente con identificación ${patientIdentification} no encontrado.`);
      patientId = patient.patientId;
    }

    let doctorId = appointment.doctorId;
    if (doctorIdentification) {
      const doctor = await this.doctorRepository.findByIdentification(doctorIdentification);
      if (!doctor) throw new NotFoundException(`Doctor con identificación ${doctorIdentification} no encontrado.`);
      doctorId = doctor.doctorId;
    }

    const appointmentDate = date ? new Date(date) : appointment.date;

    const hasChanged = 
      patientId !== appointment.patientId ||
      doctorId !== appointment.doctorId ||
      appointmentDate.getTime() !== appointment.date.getTime();

    if (hasChanged) {
      const duplicate = await this.appointmentRepository.findDuplicate(patientId, doctorId, appointmentDate);
      if (duplicate && duplicate.id !== id) {
        throw new ConflictException('Ya existe una cita para este paciente, doctor y fecha.');
      }
    }

    const updateData: Prisma.AppointmentUpdateInput = {
      date: appointmentDate,
      status,
    };

    if (patientIdentification) {
      updateData.patient = { connect: { patientId } };
    }

    if (doctorIdentification) {
      updateData.doctor = { connect: { doctorId } };
    }

    return this.appointmentRepository.update(id, updateData);
  }

  async remove(id: string) {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException('Cita no encontrada.');
    }
    return this.appointmentRepository.remove(id);
  }

  async updateStatus(id: string, updateAppointmentStatusDto: UpdateAppointmentStatusDto) {
    await this.appointmentRepository.findById(id);
    return this.appointmentRepository.updateStatus(id, updateAppointmentStatusDto.status);
  }

  async findById(id: string) {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException('Cita no encontrada.');
    }
    return appointment;
  }
}
