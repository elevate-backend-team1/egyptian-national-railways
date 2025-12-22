import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TrainService } from './train.service';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';
import { Public } from 'src/common/decorators/public.decorator';
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
   * @returns list fo trains
   */
  @Get()
  @Public()
  findAll() {
    return this.trainService.findAll();
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
