import { OAuth2Client } from 'google-auth-library';
export declare class MailService {
    private logger;
    private SCOPES;
    private TOKEN_PATH;
    private CREDENTIALS_PATH;
    private transporter;
    constructor();
    loadSavedCredentialsIfExist(): Promise<OAuth2Client | null>;
    saveCredentials(client: OAuth2Client): Promise<void>;
    authorize(): Promise<OAuth2Client>;
    sendEmail(auth: OAuth2Client, to: any, subject: any, html: any): Promise<void>;
}
