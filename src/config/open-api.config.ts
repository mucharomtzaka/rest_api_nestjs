import { registerAs } from '@nestjs/config';

export interface OpenApiConfig {
  title: string;
  description: string;
  version: string;
}

export default registerAs(
  'open-api',
  (): OpenApiConfig => ({
    title: 'NestJS RESTful API Technical Test',
    description: 'Rest Api for technical test backend',
    version: '1.0.0',
  }),
);