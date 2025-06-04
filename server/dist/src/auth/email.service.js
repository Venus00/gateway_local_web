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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const process_1 = __importDefault(require("process"));
const local_auth_1 = require("@google-cloud/local-auth");
const googleapis_1 = require("googleapis");
let MailService = MailService_1 = class MailService {
    constructor() {
        this.logger = new common_1.Logger(MailService_1.name);
        this.SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
        this.TOKEN_PATH = path_1.default.join(process_1.default.cwd(), 'token.json');
        this.CREDENTIALS_PATH = path_1.default.join(process_1.default.cwd(), './mail/auth.json');
    }
    async loadSavedCredentialsIfExist() {
        try {
            const content = await fs_1.promises.readFile(this.TOKEN_PATH, 'utf-8');
            const credentials = JSON.parse(content);
            return googleapis_1.google.auth.fromJSON(credentials);
        }
        catch (err) {
            return null;
        }
    }
    async saveCredentials(client) {
        const content = await fs_1.promises.readFile(this.CREDENTIALS_PATH, 'utf-8');
        const keys = JSON.parse(content);
        const key = keys.installed || keys.web;
        const payload = JSON.stringify({
            type: 'authorized_user',
            client_id: key.client_id,
            client_secret: key.client_secret,
            refresh_token: client.credentials.refresh_token,
        });
        await fs_1.promises.writeFile(this.TOKEN_PATH, payload);
    }
    async authorize() {
        let client = await this.loadSavedCredentialsIfExist();
        if (client) {
            return client;
        }
        client = (await (0, local_auth_1.authenticate)({
            scopes: this.SCOPES,
            keyfilePath: this.CREDENTIALS_PATH,
        }));
        if (client.credentials) {
            await this.saveCredentials(client);
        }
        return client;
    }
    async sendEmail(auth, to, subject, html) {
        const gmail = googleapis_1.google.gmail({ version: 'v1', auth });
        const email = [
            `From: "no-reply" <no--reply@digisense.es>`,
            `To: ${to}`,
            `Subject: ${subject}`,
            'Content-Type: text/html; charset="UTF-8"',
            '',
            `${html}`,
        ].join('\n');
        const encodedMessage = Buffer.from(email)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
        try {
            const res = await gmail.users.messages.send({
                userId: 'me',
                requestBody: {
                    raw: encodedMessage,
                },
            });
            console.log('Email sent:', res.data);
        }
        catch (error) {
            console.error('Error sending email:', error);
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailService);
//# sourceMappingURL=email.service.js.map