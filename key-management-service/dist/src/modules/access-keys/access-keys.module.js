"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessKeysModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const access_key_entity_1 = require("./entities/access-key.entity");
const access_key_repository_1 = require("./repositories/access-key.repository");
const access_keys_service_1 = require("./services/access-keys.service");
const access_key_publisher_service_1 = require("./services/access-key-publisher.service");
const access_keys_controller_1 = require("./controllers/access-keys.controller");
let AccessKeysModule = class AccessKeysModule {
};
AccessKeysModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([access_key_entity_1.AccessKey]),
        ],
        providers: [
            access_keys_service_1.AccessKeysService,
            access_key_publisher_service_1.AccessKeyPublisherService,
            access_key_repository_1.AccessKeyRepository
        ],
        controllers: [access_keys_controller_1.AccessKeysController],
        exports: [access_keys_service_1.AccessKeysService],
    })
], AccessKeysModule);
exports.AccessKeysModule = AccessKeysModule;
//# sourceMappingURL=access-keys.module.js.map