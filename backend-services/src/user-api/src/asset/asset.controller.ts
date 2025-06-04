import { Controller, Get, HttpException, HttpStatus, Param, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ScopeContextGuard } from '../auth/scope-context.guard';
import { AssetService } from './asset.service';

@Controller()
@UseGuards(AuthGuard('jwt'), ScopeContextGuard)
export class AssetController {
  constructor(private assetService: AssetService) {}

  @Get('attachment/:id')
  async downloadAttachment(@Param('id') id: number, @Res() res: Response) {
    const { results, count }: any = await this.assetService.searchAttachments({ id });
    if (!count) throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    const asset = results[0];
    const blobProperties = await this.assetService.getBlobMetadata(asset.url);
    res.set({
      'Content-Type': blobProperties ? blobProperties.contentType : 'application/octet-stream',
      ...(blobProperties?.contentLength && { 'Content-Length': blobProperties.contentLength }),
    });
    const stream = await this.assetService.downloadAttachment(asset.url);
    stream.pipe(res);
  }

  @Get('company-attachment/:id')
  async downloadCompanyAttachment(@Param('id') id: number, @Res() res: Response) {
    const { results, count }: any = await this.assetService.searchCompanyAttachments({ id });
    if (!count) throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    try {
      const asset = results[0];
      const blobProperties = await this.assetService.getBlobMetadata(asset.url);
      res.set({
        'Content-Type': blobProperties ? blobProperties.contentType : 'application/octet-stream',
        ...(blobProperties?.contentLength && { 'Content-Length': blobProperties.contentLength }),
      });
      const stream = await this.assetService.downloadCompanyAttachment(asset.url);
      const response = stream.pipe(res);
      return response;
    } catch (err) {
      const error = res.send(err);
      return error;
    }
  }

  @Get('asset/:id')
  async downloadAsset(@Param('id') id: string, @Res() res: Response) {
    const { results, count }: any = await this.assetService.searchAssets({ id });
    if (!count) throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    try {
      const assetWithRelation = results[0];
      const blobProperties = await this.assetService.getBlobMetadata(assetWithRelation.asset.url);
      res.set({
        'Content-Type': blobProperties ? blobProperties.contentType : 'application/octet-stream',
        ...(blobProperties?.contentLength && { 'Content-Length': blobProperties.contentLength }),
      });
      const stream = await this.assetService.downloadAsset(assetWithRelation.asset.url);
      const response = stream.pipe(res);
      return response;
    } catch (err) {
      const error = res.send(err);
      return error;
    }
  }
}
