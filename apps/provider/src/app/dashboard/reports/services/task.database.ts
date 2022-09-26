import { Injectable } from '@angular/core'

import { CcrDatabase } from '@app/shared/model'
import {
  CreateTaskRequest,
  CreateTaskResponse,
  FetchTasksRequest,
  FetchTasksResponse,
  FetchTaskStatusListRequest,
  FetchTaskStatusListResponse,
  FetchTaskTypeListRequest,
  FetchTaskTypeListResponse,
  SetTaskStatusRequest,
  TaskEntity,
  TaskArtifact,
  Task
} from '@coachcare/sdk'

@Injectable()
export class TaskDatabase extends CcrDatabase {
  constructor(private task: Task) {
    super()
  }

  fetchTasks(args: FetchTasksRequest): Promise<FetchTasksResponse> {
    return this.task.fetchTasks(args)
  }

  fetchTaskSingle(id: string): Promise<TaskEntity> {
    return this.task.fetchTaskSingle(id)
  }

  createTask(args: CreateTaskRequest): Promise<CreateTaskResponse> {
    return this.task.createTask(args)
  }

  deleteTask(id: string): Promise<void> {
    return this.task.deleteTask(id)
  }

  setTaskStatus(args: SetTaskStatusRequest): Promise<void> {
    return this.task.setTaskStatus(args)
  }

  fetchTaskArtifacts(id: string): Promise<TaskArtifact[]> {
    return this.task.fetchTaskArtifacts(id)
  }

  fetchTaskStatusList(
    args: FetchTaskStatusListRequest
  ): Promise<FetchTaskStatusListResponse> {
    return this.task.fetchTaskStatusList(args)
  }

  fetchTaskTypeList(
    args: FetchTaskTypeListRequest
  ): Promise<FetchTaskTypeListResponse> {
    return this.task.fetchTaskTypeList(args)
  }
}
