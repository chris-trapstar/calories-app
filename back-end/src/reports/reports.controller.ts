import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';

import { ReportResponseDto } from './dto/report-response.dto';
import { ReportsService } from './reports.service';

@Crud({
  serialize: {
    get: ReportResponseDto,
  },
  model: {type:ReportResponseDto},
  routes: {
    exclude: [
      'createManyBase',
      'replaceOneBase',
      'createOneBase',
      'deleteOneBase',
      'recoverOneBase',
      'updateOneBase',
      'getManyBase',
      'getOneBase'
    ]
  }
})

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@UseGuards(RolesGuard)
@ApiUnauthorizedResponse()
@Controller('reports')
export class ReportController {
  constructor(
    public service: ReportsService
  ) { }

  @Get('/get-food-entries-report')
  @Roles(Role.Admin)
  async getFoodEntries() {
    return this.service.getFoodCountEntries()
  }
}
