import { Controller, Get, Post, Body, Param, Delete, Put, Request } from '@nestjs/common';
import { CompanionService } from './companion.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { AddCompanionDto } from './dto/add-companion.dto';
import type { AuthRequest } from 'src/common/interfaces/AuthRequest.interface';

@ApiTags('companions')
@Controller('companions')
@ApiBearerAuth()
export class CompanionController {
  constructor(private readonly companionService: CompanionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new companion' })
  @ApiResponse({ status: 201, description: 'The companion has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createCompanion(@Body() addCompanionDto: AddCompanionDto, @Request() req: AuthRequest) {
    return this.companionService.createCompanion(addCompanionDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all companions for the current user' })
  @ApiResponse({ status: 200, description: 'Return all companions.' })
  async getCompanions(@Request() req: AuthRequest) {
    return this.companionService.getCompanionsByUserId(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a companion by ID' })
  @ApiParam({ name: 'id', description: 'ID of the companion to retrieve' })
  @ApiResponse({ status: 200, description: 'Return the companion.' })
  @ApiResponse({ status: 404, description: 'Companion not found.' })
  async getCompanionById(@Param('id') id: string) {
    return this.companionService.getCompanionById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a companion' })
  @ApiParam({ name: 'id', description: 'ID of the companion to update' })
  @ApiResponse({ status: 200, description: 'The companion has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Companion not found.' })
  async updateCompanion(@Param('id') id: string, @Body() updateData: Partial<AddCompanionDto>) {
    return this.companionService.updateCompanion(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a companion' })
  @ApiParam({ name: 'id', description: 'ID of the companion to delete' })
  @ApiResponse({ status: 200, description: 'The companion has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Companion not found.' })
  async deleteCompanion(@Param('id') id: string) {
    return this.companionService.deleteCompanion(id);
  }
}
