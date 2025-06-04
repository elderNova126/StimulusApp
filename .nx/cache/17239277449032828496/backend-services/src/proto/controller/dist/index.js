"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
function getControllerProtoPackagePath(packageName) {
    return path_1.join(__dirname, `../proto/${packageName}.proto`);
}
exports.default = getControllerProtoPackagePath;
//# sourceMappingURL=index.js.map