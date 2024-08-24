import { Controller, Get, Res, Param, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { CheckserverService } from '@src/checkserver/checkserver.service';
import { GetServerDto } from '@src/checkserver/dto/GetServer.dto';

@Controller("checkserver")
export class CheckserverController {
  constructor(private readonly checkserverService: CheckserverService) {}

  /**
   * @param {Response} res
   * @returns {Response} Http response
   */
  @Get()
  async listServer(@Res() res: Response) {
    return res.status(HttpStatus.OK).json(await this.checkserverService.listOfAvailableSevers());
  }

  /**
   * @param {GetServerDto} getServerDto
   * @param {Response} res
   * @returns {Response} Http response
   */
  @Get(":priority")
  async getServerByPriority(
    @Param() getServerDto: GetServerDto,
    @Res() res: Response
  ) {
    return res.status(HttpStatus.OK).json(await this.checkserverService.getServer(getServerDto));
  }
}