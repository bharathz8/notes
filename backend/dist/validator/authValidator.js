"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSchema = void 0;
const zod_1 = require("zod");
exports.authSchema = zod_1.z.object({
    name: zod_1.z.string().min(3),
    dob: zod_1.z.string().transform((val) => new Date(val)),
    email: zod_1.z.string().email(),
});
