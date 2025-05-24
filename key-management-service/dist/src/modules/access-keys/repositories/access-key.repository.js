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
var AccessKeyRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessKeyRepository = void 0;
const typeorm_1 = require("typeorm");
const access_key_entity_1 = require("../entities/access-key.entity");
const common_1 = require("@nestjs/common");
let AccessKeyRepository = AccessKeyRepository_1 = class AccessKeyRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(access_key_entity_1.AccessKey, dataSource.createEntityManager());
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(AccessKeyRepository_1.name);
    }
    async checkDatabaseConnection() {
        try {
            const isConnected = this.dataSource.isInitialized;
            if (isConnected) {
                this.logger.log('Database connection is active.');
                return true;
            }
            else {
                this.logger.error('Database connection is not initialized.');
                return false;
            }
        }
        catch (error) {
            this.logger.error(`Database connection check failed: ${error.message}`);
            return false;
        }
    }
    async createAccessKeyEntry(keyData) {
        this.logger.log('Creating new access key entry in repository.');
        this.checkDatabaseConnection();
        const newKey = this.create(keyData);
        this.logger.log(`Created entity object: ${JSON.stringify(newKey)}`);
        const savedKey = await this.save(newKey);
        this.logger.log(`Saved access key entry with ID: ${savedKey.id}`);
        return savedKey;
    }
};
AccessKeyRepository = AccessKeyRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], AccessKeyRepository);
exports.AccessKeyRepository = AccessKeyRepository;
//# sourceMappingURL=access-key.repository.js.map