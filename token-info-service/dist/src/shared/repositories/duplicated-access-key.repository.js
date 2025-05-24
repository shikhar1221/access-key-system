"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicatedAccessKeyRepository = void 0;
const typeorm_1 = require("typeorm");
const duplicated_access_key_entity_1 = require("../../entities/duplicated-access-key.entity");
const base_repository_1 = require("./base.repository");
const common_1 = require("@nestjs/common");
let DuplicatedAccessKeyRepository = class DuplicatedAccessKeyRepository extends base_repository_1.BaseRepository {
    constructor(dataSource) {
        super(duplicated_access_key_entity_1.DuplicatedAccessKey, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async findOneByApiKey(apiKey) {
        return this.findOne({ where: { apiKey } });
    }
    async upsertKey(createDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let key = await queryRunner.manager.findOne(duplicated_access_key_entity_1.DuplicatedAccessKey, { where: { apiKey: createDto.apiKey } });
            if (key) {
                key = queryRunner.manager.merge(duplicated_access_key_entity_1.DuplicatedAccessKey, key, createDto);
            }
            else {
                key = queryRunner.manager.create(duplicated_access_key_entity_1.DuplicatedAccessKey, createDto);
                console.log(key);
            }
            const savedKey = await queryRunner.manager.save(key);
            await queryRunner.commitTransaction();
            return savedKey;
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async updateKey(apiKey, updateDto) {
        const key = await this.findOneByApiKey(apiKey);
        if (!key) {
            throw new common_1.NotFoundException(`DuplicatedAccessKey with API key "${apiKey}" not found`);
        }
        const updatedKey = this.merge(key, updateDto);
        return this.save(updatedKey);
    }
    async deleteKey(apiKey) {
        const result = await this.delete({ apiKey });
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`DuplicatedAccessKey with API key "${apiKey}" not found for deletion`);
        }
    }
    async setKeyActiveStatus(apiKey, isActive) {
        const key = await this.findOneByApiKey(apiKey);
        if (!key) {
            throw new common_1.NotFoundException(`DuplicatedAccessKey with API key "${apiKey}" not found to update active status.`);
        }
        key.isActive = isActive;
        return this.save(key);
    }
};
DuplicatedAccessKeyRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], DuplicatedAccessKeyRepository);
exports.DuplicatedAccessKeyRepository = DuplicatedAccessKeyRepository;
