import { Controller, Post, Body, Delete, Param, Put, Get, HttpCode, HttpStatus, UsePipes, ValidationPipe, Headers, UnauthorizedException, Logger } from '@nestjs/common';
import { AccessKeysService } from '../services/access-keys.service';
import { CreateAccessKeyDto } from '../dto/create-access-key.dto';
import { UpdateAccessKeyDto } from '../dto/update-access-key.dto';
import { AccessKey } from '../entities/access-key.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiHeader } from '@nestjs/swagger'; // Added Swagger imports

@ApiTags('access-keys') // Tag for grouping endpoints in Swagger UI
@Controller()
export class AccessKeysController {
  private readonly logger = new Logger(AccessKeysController.name);
  constructor(private readonly accessKeysService: AccessKeysService) {}

  @Post('admin/keys')
  @ApiOperation({ summary: 'Create a new access key (Admin)', description: 'Allows an administrator to create a new access key.' })
  @ApiBody({ type: CreateAccessKeyDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The access key has been successfully created.', type: AccessKey })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  async createKey(@Body() createAccessKeyDto: CreateAccessKeyDto): Promise<AccessKey> {
    this.logger.log(`Received request to create access key: ${JSON.stringify(createAccessKeyDto)}`);
    return this.accessKeysService.createKey(createAccessKeyDto);
  }

  @Get('admin/keys')
  @ApiOperation({ summary: 'List all access keys (Admin)', description: 'Retrieves a list of all access keys. For administrative use.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved list of access keys.', type: [AccessKey] })
  async listKeys(): Promise<AccessKey[]> {
    this.logger.log('Received request to list all access keys.');
    return this.accessKeysService.listKeys();
  }

  @Put('admin/keys/:apiKey')
  @ApiOperation({ summary: 'Update an access key (Admin)', description: 'Allows an administrator to update an existing access key by its API key.' })
  @ApiParam({ name: 'apiKey', description: 'The API key of the access key to update', type: String })
  @ApiBody({ type: UpdateAccessKeyDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'The access key has been successfully updated.', type: AccessKey })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Access key not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateKey(
    @Param('apiKey') apiKey: string,
    @Body() updateAccessKeyDto: UpdateAccessKeyDto,
  ): Promise<AccessKey> {
    this.logger.log(`Received request to update access key with API Key: ${apiKey}, data: ${JSON.stringify(updateAccessKeyDto)}`);
    return this.accessKeysService.updateKey(apiKey, updateAccessKeyDto);
  }

  @Delete('admin/keys/:apiKey')
  @ApiOperation({ summary: 'Delete an access key (Admin)', description: 'Allows an administrator to delete an access key by its API key.' })
  @ApiParam({ name: 'apiKey', description: 'The API key of the access key to delete', type: String })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The access key has been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Access key not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteKey(@Param('apiKey') apiKey: string): Promise<void> {
    this.logger.log(`Received request to delete access key with API Key: ${apiKey}`);
    return this.accessKeysService.deleteKey(apiKey);
  }

  @Get('keys/my-plan')
  @ApiOperation({ summary: 'Get current user plan details', description: 'Retrieves details of the access key associated with the provided X-API-Key.' })
  @ApiHeader({ name: 'x-api-key', description: 'The API key for authentication.', required: true })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved key details.', type: AccessKey })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'X-API-Key header is missing or invalid.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Access key not found or inactive.' })
  async getUserPlan(@Headers('x-api-key') apiKey: string): Promise<AccessKey> {
    this.logger.log(`Received request for user plan with API Key: ${apiKey}`);
    if (!apiKey) {
      this.logger.warn('X-API-Key header is missing for getUserPlan request.');
      throw new UnauthorizedException('X-API-Key header is missing');
    }
    return this.accessKeysService.getUserPlan(apiKey);
  }

  @Post('keys/my-plan/disable')
  @ApiOperation({ summary: 'Disable current user access key', description: 'Disables the access key associated with the provided X-API-Key.' })
  @ApiHeader({ name: 'x-api-key', description: 'The API key for authentication.', required: true })
  @ApiResponse({ status: HttpStatus.OK, description: 'The access key has been successfully disabled.', type: AccessKey })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'X-API-Key header is missing or invalid.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Access key not found.' })
  @HttpCode(HttpStatus.OK)
  async disableKey(@Headers('x-api-key') apiKey: string): Promise<AccessKey> {
    this.logger.log(`Received request to disable key with API Key: ${apiKey}`);
    if (!apiKey) {
      this.logger.warn('X-API-Key header is missing for disableKey request.');
      throw new UnauthorizedException('X-API-Key header is missing');
    }
    return this.accessKeysService.disableKey(apiKey);
  }
}