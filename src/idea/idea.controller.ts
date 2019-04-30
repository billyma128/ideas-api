import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '../shared/auth.guard';
import { ValidationPipe } from '../shared/validation.pipe';
import { User } from '../user/user.decorator';
import { IdeaDTO } from './idea.dto';
import { IdeaService } from './idea.service';

@Controller('idea')
export class IdeaController {
  private logger = new Logger('IdeaController');
  constructor(private readonly ideaService: IdeaService) {}

  private logData(options: any) {
    options.user && this.logger.log(`USER ${JSON.stringify(options.user)}`);
    options.data && this.logger.log(`DATA ${JSON.stringify(options.data)}`);
    options.id && this.logger.log(`IDEA ${JSON.stringify(options.id)}`);
  }

  @Get()
  showAllIdeas() {
    return this.ideaService.showAll();
  }

  @Post()
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createIdea(@User('id') user, @Body() data: IdeaDTO) {
    this.logData({ user, data });
    return this.ideaService.create(user, data);
  }

  @Get(':id')
  readIdea(@Param('id') id: string) {
    return this.ideaService.read(id);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  updateIdea(@Param('id') id: string, @Body() data: Partial<IdeaDTO>) {
    this.logger.log(JSON.stringify(data));
    return this.ideaService.update(id, data);
  }

  @Delete(':id')
  destroyIdea(@Param('id') id: string) {
    return this.ideaService.destroy(id);
  }
}
