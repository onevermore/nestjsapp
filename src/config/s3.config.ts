import { S3 } from 'aws-sdk';
import {
  AwsServiceConfigurationOptionsFactory,
  AwsServiceType,
  AwsService,
  AwsServiceWithServiceOptions,
} from 'nest-aws-sdk';
import { ConfigService } from '@nestjs/config';

interface IS3Config {
  defaultServiceOptions?: AwsServiceConfigurationOptionsFactory;
  services?: Array<AwsServiceType<AwsService> | AwsServiceWithServiceOptions>;
}

export const awsConfig = async (
  configService: ConfigService,
): Promise<any> => ({
  //defaultServiceOptions: {
  region: configService.get('AWS_REGION'),
  credentials: {
    accessKeyId: configService.get('AWS_ACCESS_KEY'),
    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
  },
  //},
  // services: [S3],
});
