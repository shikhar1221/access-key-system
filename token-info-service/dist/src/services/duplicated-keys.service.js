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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicatedKeysService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const duplicated_access_key_repository_1 = require("../shared/repositories/duplicated-access-key.repository");
let DuplicatedKeysService = class DuplicatedKeysService {
    constructor(duplicatedKeysRepository) {
        this.duplicatedKeysRepository = duplicatedKeysRepository;
    }
    async findOne(apiKey) {
        return this.duplicatedKeysRepository.findOneByApiKey(apiKey);
    }
    async upsertDuplicatedKey(createDto) {
        return this.duplicatedKeysRepository.upsertKey(createDto);
    }
    async updateDuplicatedKey(apiKey, updateDto) {
        return this.duplicatedKeysRepository.updateKey(apiKey, updateDto);
    }
    async deleteDuplicatedKey(apiKey) {
        return this.duplicatedKeysRepository.deleteKey(apiKey);
    }
    async setKeyActiveStatus(apiKey, isActive) {
        return this.duplicatedKeysRepository.setKeyActiveStatus(apiKey, isActive);
    }
};
DuplicatedKeysService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(duplicated_access_key_repository_1.DuplicatedAccessKeyRepository)),
    __metadata("design:paramtypes", [duplicated_access_key_repository_1.DuplicatedAccessKeyRepository])
], DuplicatedKeysService);
exports.DuplicatedKeysService = DuplicatedKeysService;
