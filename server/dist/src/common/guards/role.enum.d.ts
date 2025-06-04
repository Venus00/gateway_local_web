export declare enum Role {
    User = "user",
    Admin = "admin",
    GAdmin = "gadmin"
}
export declare enum Permission {
    readDashboard = "read",
    readDeviceType = "read",
    readDevice = "read",
    readEntity = "read",
    readEntityType = "read",
    readConnection = "read",
    readBroker = "read",
    deviceType = "device_type",
    device = "device",
    entity = "machines",
    entityType = "machine_type",
    connection = "connections",
    broker = "brokers"
}
export declare const plantEnum: {
    device_type: string;
    device: string;
    machines: string;
    machine_type: string;
    connections: string;
    brokers: string;
};
