import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TrainService } from './train.service';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';
import { CarDto } from './dto/car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Public } from '../../common/decorators/public.decorator';
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

  /**
   * Add a new car to a train
   * @param id Train ID
   * @param carDto Car details
   * @returns Updated train
   */
  @Post(':id/cars')
  @Public()
  addCar(@Param('id') id: string, @Body() carDto: CarDto) {
    return this.trainService.addCar(id, carDto);
  }

  /**
   * Update a specific car in a train by car number
   * @param id Train ID
   * @param carNumber Car number
   * @param updateCarDto Updated car details
   * @returns Updated train
   */
  @Patch(':id/cars/:carNumber')
  @Public()
  updateCar(
    @Param('id') id: string,
    @Param('carNumber') carNumber: string,
    @Body() updateCarDto: UpdateCarDto
  ) {
    return this.trainService.updateCar(id, parseInt(carNumber), updateCarDto);
  }

  /**
   * Delete a specific car from a train by car number
   * @param id Train ID
   * @param carNumber Car number
   * @returns Updated train
   */
  @Delete(':id/cars/:carNumber')
  @Public()
  removeCar(@Param('id') id: string, @Param('carNumber') carNumber: string) {
    return this.trainService.removeCar(id, parseInt(carNumber));
  }
}
