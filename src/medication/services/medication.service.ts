import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { MedicationRepository } from '../repositories/medication.repository';
import { CreateMedicationDto } from '../dto/create-medication.dto';
import { UpdateMedicationDto } from '../dto/update-medication.dto';

@Injectable()
export class MedicationService {
  constructor(private readonly medicationRepository: MedicationRepository) {}

  async create(createMedicationDto: CreateMedicationDto) {
    // Verificar si ya existe un medicamento con el mismo nombre
    const existingMedication = await this.medicationRepository.findByName(createMedicationDto.name);
    if (existingMedication) {
      throw new ConflictException(`Ya existe un medicamento con el nombre "${createMedicationDto.name}"`);
    }

    return this.medicationRepository.create(createMedicationDto);
  }

  async findAll() {
    return this.medicationRepository.findAll();
  }

  async findById(id: string) {
    const medication = await this.medicationRepository.findById(id);
    if (!medication) {
      throw new NotFoundException(`Medicamento con ID ${id} no encontrado`);
    }
    return medication;
  }

  async findByDisease(disease: string) {
    if (!disease || disease.trim() === '') {
      throw new BadRequestException('El parámetro "disease" es requerido');
    }
    return this.medicationRepository.findByDisease(disease.toLowerCase());
  }

  async update(id: string, updateMedicationDto: UpdateMedicationDto) {
    // Verificar que el medicamento existe
    await this.findById(id);

    // Si se está actualizando el nombre, verificar que no exista otro con el mismo nombre
    if (updateMedicationDto.name) {
      const existingMedication = await this.medicationRepository.findByName(updateMedicationDto.name);
      if (existingMedication && existingMedication.id !== id) {
        throw new ConflictException(`Ya existe un medicamento con el nombre "${updateMedicationDto.name}"`);
      }
    }

    return this.medicationRepository.update(id, updateMedicationDto);
  }

  async remove(id: string) {
    // Verificar que el medicamento existe
    await this.findById(id);

    // Verificar si el medicamento está siendo usado en alguna orden médica
    const isInUse = await this.medicationRepository.checkIfInUse(id);
    if (isInUse) {
      throw new ConflictException('No se puede eliminar el medicamento porque está siendo usado en órdenes médicas');
    }

    return this.medicationRepository.remove(id);
  }
}
