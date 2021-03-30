"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("./lib/error");
const ArweaveUtils = require("./lib/utils");
class Chunks {
    constructor(api) {
        this.api = api;
    }
    async getTransactionOffset(id) {
        const resp = await this.api.get(`tx/${id}/offset`);
        if (resp.status === 200) {
            return resp.data;
        }
        throw new Error(`Unable to get transaction offset: ${error_1.getError(resp)}`);
    }
    async getChunk(offset) {
        const resp = await this.api.get(`chunk/${offset}`);
        if (resp.status === 200) {
            return resp.data;
        }
        throw new Error(`Unable to get chunk: ${error_1.getError(resp)}`);
    }
    async getChunkData(offset) {
        const chunk = await this.getChunk(offset);
        const buf = ArweaveUtils.b64UrlToBuffer(chunk.chunk);
        return buf;
    }
    firstChunkOffset(offsetResponse) {
        return parseInt(offsetResponse.offset) - parseInt(offsetResponse.size) + 1;
    }
    async downloadChunkedData(id) {
        const offsetResponse = await this.getTransactionOffset(id);
        const size = parseInt(offsetResponse.size);
        const endOffset = parseInt(offsetResponse.offset);
        const startOffset = endOffset - size + 1;
        const data = new Uint8Array(size);
        let byte = 0;
        while (startOffset + byte < endOffset) {
            const chunkData = await this.getChunkData(startOffset + byte);
            data.set(chunkData, byte);
            byte += chunkData.length;
        }
        return data;
    }
}
exports.default = Chunks;
//# sourceMappingURL=chunks.js.map