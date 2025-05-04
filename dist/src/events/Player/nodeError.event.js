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
Object.defineProperty(exports, "__esModule", { value: true });
const Event_class_1 = require("../../classes/Event.class");
class NodeError extends Event_class_1.Event {
    constructor(client, file) {
        super(client, file, {
            name: "nodeError",
            type: "player"
        });
    }
    callback(node, error) {
        return __awaiter(this, void 0, void 0, function* () {
            this.client.logger.error(`Node ${node} Error: ${JSON.stringify(error)}`);
        });
    }
}
exports.default = NodeError;
//# sourceMappingURL=nodeError.event.js.map