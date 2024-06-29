
import { ExecutionContext,createParamDecorator } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/esm5';
import { validateOrReject } from 'class-validator';

export const RequestHeader = createParamDecorator(
  async (value:  ClassType<unknown>, ctx: ExecutionContext) => {

    // extract headers
    const headers = ctx.switchToHttp().getRequest().headers;

    // Convert headers to DTO object
    const dto = plainToClass(value, headers, { excludeExtraneousValues: true });
    
    // Validate 
    await validateOrReject(dto);

    // return header dto object 
    return dto;
  },
);