import { CreateWorkflowExecutionDto } from '@dto/create-workflow-execution.dto';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WorkflowExecutionsService } from '@services/workflow_executions.service';
import { decamelizeKeys } from 'humps';

@Controller('workflow_executions')
export class WorkflowExecutionsController {
  constructor(private workflowExecutionsService: WorkflowExecutionsService) {}

  @Post()
  async create(@Body() createWorkflowExecutionDto: CreateWorkflowExecutionDto) {
    const workflowExecution = await this.workflowExecutionsService.create(createWorkflowExecutionDto);
    const result = await this.workflowExecutionsService.execute(workflowExecution, createWorkflowExecutionDto.params);
    return { workflowExecution, result };
  }

  @Get(':id/status')
  async status(@Param('id') id: any) {
    return decamelizeKeys(await this.workflowExecutionsService.getStatus(id));
  }

  @Get(':id')
  async show(@Param('id') id: any) {
    return await this.workflowExecutionsService.getWorkflowExecution(id);
  }

  @Get('all/:appVersionId')
  async index(@Param('appVersionId') appVersionId: any) {
    return await this.workflowExecutionsService.listWorkflowExecutions(appVersionId);
  }
}