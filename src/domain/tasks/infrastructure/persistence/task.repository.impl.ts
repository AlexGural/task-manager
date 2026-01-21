import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UUID } from 'crypto';
import { Task } from '@domain/tasks/domain/task.entity';
import { TaskRepository } from '@domain/tasks/application/ports/task.repository';
import { TaskRecord } from '@domain/tasks/infrastructure/persistence/schema/task.record';
import { TaskMapper } from '@domain/tasks/infrastructure/persistence/mappers/task.mapper';

@Injectable()
export class TaskRepositoryImpl extends TaskRepository {
  constructor(
    @InjectRepository(TaskRecord)
    private readonly repo: Repository<TaskRecord>,
  ) {
    super();
  }

  async create(task: Task): Promise<Task> {
    const record = this.repo.create(TaskMapper.toRecord(task));
    const saved = await this.repo.save(record);
    return TaskMapper.toDomain(saved);
  }

  async findAll(): Promise<Task[]> {
    const records = await this.repo.find({
      relations: ['assignees'],
      order: { createdAt: 'DESC' },
    });
    return records.map(TaskMapper.toDomain);
  }

  async findById(id: UUID): Promise<Task | null> {
    const record = await this.repo.findOne({ where: { id } });
    return record ? TaskMapper.toDomain(record) : null;
  }

  async findByIdWithAssignees(id: UUID): Promise<Task | null> {
    const record = await this.repo.findOne({
      where: { id },
      relations: ['assignees'],
    });
    return record ? TaskMapper.toDomain(record) : null;
  }

  async update(task: Task): Promise<Task> {
    const record = await this.repo.preload({
      id: task.id,
      ...TaskMapper.toRecord(task),
    });
    const saved = await this.repo.save(record);
    return TaskMapper.toDomain(saved);
  }

  async delete(id: UUID): Promise<void> {
    await this.repo.delete(id);
  }

  async addAssignee(taskId: UUID, userId: UUID): Promise<Task> {
    await this.repo
      .createQueryBuilder()
      .relation(TaskRecord, 'assignees')
      .of(taskId)
      .add(userId);

    return this.findByIdWithAssignees(taskId);
  }

  async removeAssignee(taskId: UUID, userId: UUID): Promise<Task> {
    await this.repo
      .createQueryBuilder()
      .relation(TaskRecord, 'assignees')
      .of(taskId)
      .remove(userId);

    return this.findByIdWithAssignees(taskId);
  }
}
