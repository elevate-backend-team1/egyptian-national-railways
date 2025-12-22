import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TrainService } from './train.service';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { QueryTrainDto } from './dto/query-train.dto';

@Controller('trains')
export class TrainController {
  constructor(private readonly trainService: TrainService) {}

  /**
   *
   * @param createTrainDto
   * @returns newTrain
   */
  @Post()
  @Public()
  create(@Body() createTrainDto: CreateTrainDto) {
    return this.trainService.createTrain(createTrainDto);
  }

  /**
   *@param query
   * @returns list fo trains
   */
  @Get()
  @Public()
  findAll(@Query() query: QueryTrainDto) {
    return this.trainService.findAll(query);
  }

  /**
   *
   * @param id
   * @returns specific train
   */
  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.trainService.findOne(id);
  }

  /**
   *
   * @param id
   * @param updateTrainDto
   * @returns updated train
   */

  @Patch(':id')
  @Public()
  update(@Param('id') id: string, @Body() updateTrainDto: UpdateTrainDto) {
    return this.trainService.updateTrain(id, updateTrainDto);
  }

  /**
   *
   * @param id
   * @returns string
   */
  @Delete(':id')
  @Public()
  remove(@Param('id') id: string) {
    return this.trainService.removeTrain(id);
  }
}
