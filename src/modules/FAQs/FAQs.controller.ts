import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { FAQsService } from './FAQS.service';
import { CreateFAQsDto } from './dto/create-FAQs.dto';
import { UpdateFAQsDto } from './dto/update-FAqs.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { FAQs } from './schema/FAQs.schema';

@ApiTags('FAQs')
@Controller('FAQs')
export class FAQsController {
  constructor(private readonly faqsService: FAQsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new FAQ' })
  @ApiResponse({ status: 201, description: 'FAQ created successfully', type: FAQs })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
  @ApiBody({ type: CreateFAQsDto })
  async create(@Body() createFAQsDto: CreateFAQsDto): Promise<FAQs> {
    return this.faqsService.createFAQ(createFAQsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all FAQs' })
  @ApiResponse({ status: 200, description: 'List of all FAQs', type: [FAQs] })
  async findAll(): Promise<FAQs[]> {
    return this.faqsService.getAllFAQs();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific FAQ by ID' })
  @ApiParam({ name: 'id', description: 'FAQ ID', example: '507f1f77bcf86cd799439011' })
  @ApiResponse({ status: 200, description: 'FAQ found', type: FAQs })
  @ApiResponse({ status: 404, description: 'FAQ not found' })
  async findOne(@Param('id') id: string): Promise<FAQs | null> {
    return this.faqsService.getFAQById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a FAQ by ID' })
  @ApiParam({ name: 'id', description: 'FAQ ID', example: '507f1f77bcf86cd799439011' })
  @ApiBody({ type: UpdateFAQsDto })
  @ApiResponse({ status: 200, description: 'FAQ updated successfully', type: FAQs })
  @ApiResponse({ status: 404, description: 'FAQ not found' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
  async update(@Param('id') id: string, @Body() updateFAQsDto: UpdateFAQsDto): Promise<FAQs | null> {
    return this.faqsService.updateFAQ(id, updateFAQsDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a FAQ by ID' })
  @ApiParam({ name: 'id', description: 'FAQ ID', example: '507f1f77bcf86cd799439011' })
  @ApiResponse({ status: 204, description: 'FAQ deleted successfully' })
  @ApiResponse({ status: 404, description: 'FAQ not found' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.faqsService.deleteFAQ(id);
  }
}
