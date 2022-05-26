import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { TestService } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { TokenGuard } from './token-post.guard';
import { PreventDuplicateRequest } from 'src/prevent-duplicate';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}
  @Get('/token')
  @HttpCode(200)
  async generateToken() {
    try {
      return await PreventDuplicateRequest.generateToken();
    } catch (e) {
      console.log(e);
    }
  }

  @Post()
  @UseGuards(TokenGuard)
  create(@Body() createTestDto: CreateTestDto, @Headers() headers) {
    return this.testService.create(createTestDto);
  }

  @Get()
  findAll() {
    return this.testService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
    return this.testService.update(+id, updateTestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testService.remove(+id);
  }
}
