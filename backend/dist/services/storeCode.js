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
exports.storeCommit = storeCommit;
const prismaClient_1 = __importDefault(require("../db/prismaClient"));
function storeCommit(commitSHA, files) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prismaClient_1.default.commit.upsert({
            where: { sha: commitSHA },
            update: {},
            create: {
                sha: commitSHA,
                files: {
                    create: files.map(file => ({
                        fileName: file.fileName,
                        content: file.content,
                    })),
                },
            },
        });
        console.log(`Stored commit ${commitSHA} in Neon DB`);
    });
}
