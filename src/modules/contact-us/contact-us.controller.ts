import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ContactUsService } from './contact-us.service';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { UpdateContactUsDto } from './dto/update-contact-us.dto';
import { ContactUs } from './schema/contact-us.schema';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { ContactStatus } from './enum/contact-status.enum';

@ApiTags('Contact Us')
@Controller('contact-us')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new contact request' })
  @ApiResponse({
    status: 201,
    description: 'Contact request created successfully',
    type: ContactUs
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
  @ApiBody({ type: CreateContactUsDto })
  async create(@Body() createContactUsDto: CreateContactUsDto): Promise<ContactUs> {
    return this.contactUsService.create(createContactUsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all contact requests' })
  @ApiResponse({
    status: 200,
    description: 'List of all contact requests',
    type: [ContactUs]
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by status (pending, in_progress, resolved, closed)',
    enum: ['pending', 'in_progress', 'resolved', 'closed']
  })
  @ApiQuery({
    name: 'email',
    required: false,
    description: 'Filter by email address',
    type: String
  })
  async findAll(@Query('status') status?: ContactStatus, @Query('email') email?: string): Promise<ContactUs[]> {
    if (status) {
      return this.contactUsService.findByStatus(status);
    }
    if (email) {
      return this.contactUsService.findByEmail(email);
    }
    return this.contactUsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific contact request by ID' })
  @ApiParam({
    name: 'id',
    description: 'Contact request ID',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({
    status: 200,
    description: 'Contact request found',
    type: ContactUs
  })
  @ApiResponse({ status: 404, description: 'Contact request not found' })
  async findOne(@Param('id') id: string): Promise<ContactUs> {
    return this.contactUsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a contact request by ID' })
  @ApiParam({
    name: 'id',
    description: 'Contact request ID',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiBody({ type: UpdateContactUsDto })
  @ApiResponse({
    status: 200,
    description: 'Contact request updated successfully',
    type: ContactUs
  })
  @ApiResponse({ status: 404, description: 'Contact request not found' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
  async update(@Param('id') id: string, @Body() updateContactUsDto: UpdateContactUsDto): Promise<ContactUs> {
    return this.contactUsService.update(id, updateContactUsDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a contact request by ID' })
  @ApiParam({
    name: 'id',
    description: 'Contact request ID',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({
    status: 204,
    description: 'Contact request deleted successfully'
  })
  @ApiResponse({ status: 404, description: 'Contact request not found' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.contactUsService.remove(id);
  }
}
