export enum Role {
    User = 'user',
    Admin = 'admin',
    GAdmin = 'gadmin'
}

export enum Permission {
    readDashboard= 'read',
    readDeviceType = 'read',
    readDevice = 'read',
    readEntity = 'read',
    readEntityType = 'read',
    readConnection = 'read',
    readBroker = 'read',
    deviceType = 'device_type',
    device = 'device',
    entity = 'machines',
    entityType = 'machine_type',
    connection = 'connections',
    broker = 'brokers'
}

export const plantEnum = {
    device_type: "device_type",
    device: "device",
    machines: "entity",
    machine_type: "machine_type",
    connections: "connection",
    brokers: "broker"
}