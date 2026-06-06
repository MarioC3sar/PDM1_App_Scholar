"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const prismaClient_1 = __importDefault(require("../prismaClient"));
dotenv_1.default.config();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;
        if (!email) {
            throw new Error("ADMIN_EMAIL is required");
        }
        if (!password) {
            throw new Error("ADMIN_PASSWORD is required");
        }
        const senhaHash = yield bcryptjs_1.default.hash(password, 10);
        const admin = yield prismaClient_1.default.usuario.upsert({
            where: { email },
            update: {
                senhaHash,
                perfil: "ADMIN",
                primeiroAcesso: false,
            },
            create: {
                email,
                senhaHash,
                perfil: "ADMIN",
                primeiroAcesso: false,
            },
        });
        console.log(`ADMIN criado/atualizado: ${admin.email}`);
    });
}
main()
    .catch((error) => {
    console.error(error);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prismaClient_1.default.$disconnect();
}));
