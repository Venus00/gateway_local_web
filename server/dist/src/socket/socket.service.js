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
var SocketService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
let SocketService = SocketService_1 = class SocketService {
    constructor() {
        this.logger = new common_1.Logger(SocketService_1.name);
    }
    onModuleInit() {
        this.io = new socket_io_1.Server({
            cors: {
                origin: '*',
            },
        });
        this.io.listen(5000, {
            cors: { origin: '*' },
        });
        this.io.on('connection', this.onConnect.bind(this));
    }
    onConnect(socket) {
        console.log('[d] new Socket Client Connected!', socket.id);
        socket.on('disconnect', () => console.log('client disconnected', socket.id));
        socket.on('discovery', this.onDiscovery.bind(this, socket.id));
    }
    async onDiscovery(data) {
        console.log('data', data);
    }
    send(topic, data) {
        if (this.io) {
            this.io.emit(topic, data);
        }
        else {
            this.logger.error('Socket server is not initialized.');
        }
    }
};
exports.SocketService = SocketService;
exports.SocketService = SocketService = SocketService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SocketService);
//# sourceMappingURL=socket.service.js.map