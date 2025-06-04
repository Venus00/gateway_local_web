"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plantEnum = exports.Permission = exports.Role = void 0;
var Role;
(function (Role) {
    Role["User"] = "user";
    Role["Admin"] = "admin";
    Role["GAdmin"] = "gadmin";
})(Role || (exports.Role = Role = {}));
var Permission;
(function (Permission) {
    Permission["readDashboard"] = "read";
    Permission["readDeviceType"] = "read";
    Permission["readDevice"] = "read";
    Permission["readEntity"] = "read";
    Permission["readEntityType"] = "read";
    Permission["readConnection"] = "read";
    Permission["readBroker"] = "read";
    Permission["deviceType"] = "device_type";
    Permission["device"] = "device";
    Permission["entity"] = "machines";
    Permission["entityType"] = "machine_type";
    Permission["connection"] = "connections";
    Permission["broker"] = "brokers";
})(Permission || (exports.Permission = Permission = {}));
exports.plantEnum = {
    device_type: "device_type",
    device: "device",
    machines: "entity",
    machine_type: "machine_type",
    connections: "connection",
    brokers: "broker"
};
//# sourceMappingURL=role.enum.js.map