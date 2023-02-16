import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';
//import sharp from 'sharp';
const sharp = require('sharp');

@Injectable()
export class FilesService {
  constructor(@InjectAwsService(S3) private readonly s3: S3) {}
  /*
  async uploadImage(file: Buffer, folder: string, subfolder: string) {
    try {
      const fileName = Date.now().toString();
      const params = {
        Bucket: `${process.env.AWS_PUBLIC_BUCKET_KEY}`,
        Body: file,
        Key: `${folder}/${subfolder}/${fileName}.jpg`,
      };

      await this.s3.upload(params).promise();

      return fileName;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
*/
  async upload(bucket: string, path: string, payload: string) {
    return await this.s3
      .upload({
        Bucket: bucket,
        Key: path,
        Body: payload,
      })
      .promise();
  }

  async uploadImage(
    file: Express.Multer.File,
    username: string,
    subfolder: string,
  ): Promise<any> {
    /*   const buffer = await sharp(file.buffer)
      .resize({ height: 300, width: 300, fit: 'contain' })
      .toBuffer();
*/
    const fileName = Date.now().toString();
    const key = `users/${username}/${subfolder}/${fileName}.jpg`;

    //const r =
    this.s3
      .upload({
        Bucket: process.env.AWS_PUBLIC_BUCKET_KEY,
        Key: key,
        //  ACL: 'public-read',
        Body: file.buffer || file,
      })
      .promise();
    //   .then(() => this.getLinkMediaKey(key))
    //    .then((data) => data);
    // console.log('r ===== ', r);
    const url = await this.getLinkMediaKey(key);

    return {
      url: url,
      name: fileName,
    };
  }

  async uploadImage2(
    file: Express.Multer.File,
    username: string,
    subfolder: string,
  ): Promise<any> {
    /*   const buffer = await sharp(file.buffer)
      .resize({ height: 300, width: 300, fit: 'contain' })
      .toBuffer();
*/
    const fileName = Date.now().toString();
    const key = `users/${username}/${subfolder}/${fileName}.jpg`;

    //const r =
    this.s3
      .putObject({
        Bucket: process.env.AWS_PUBLIC_BUCKET_KEY,
        Key: key,
        //   ACL: 'public-read',
        Body: file.buffer || file,
      })
      .promise();
    //   .then(() => this.getLinkMediaKey(key))
    //    .then((data) => data);
    // console.log('r ===== ', r);
    //  const url = await this.getLinkMediaKey(key);
    const url = `https://${process.env.AWS_PUBLIC_BUCKET_KEY}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    return {
      url: url,
      name: fileName,
    };
  }

  async listBucketContents(bucket: string) {
    const response = await this.s3.listObjectsV2({ Bucket: bucket }).promise();
    return response.Contents.map((c) => c.Key);
  }

  async getURL(key: string) {
    this.s3.putObjectAcl({
      Bucket: 'videos-imvoraus',
      Key: key,
      ACL: 'public-read',
    });

    const fileURL =
      this.s3.endpoint.protocol +
      '//videos-imvoraus.' +
      this.s3.endpoint.hostname +
      '/' +
      key;

    //  .createReadStream();
    //console.log(this.s3.endpoint);
    return fileURL;
  }

  async getLinkMediaKey(media_key: string) {
    return this.s3.getSignedUrl('getObject', {
      Bucket: process.env.AWS_PUBLIC_BUCKET_KEY,
      Key: media_key,
      Expires: 60 * 60 * 12,
    });
  }

  async deleteFile(key: string) {
    return await this.s3
      .deleteObject({
        Bucket: process.env.AWS_PUBLIC_BUCKET_KEY,
        Key: key,
      })
      .promise();
  }

  async getFile(key: string) {
    const res = await this.s3
      .getObject({
        Bucket: process.env.AWS_PUBLIC_BUCKET_KEY,
        Key: key,
      })
      .promise();
    return res.Body;
  }
}
