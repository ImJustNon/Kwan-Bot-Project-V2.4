"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConvertTime {
    convertTime(duration) {
        const covertToISOString = new Date(duration).toISOString();
        const splitTimeFromDate = covertToISOString.split("T");
        return splitTimeFromDate[1].slice(0, 8);
    }
}
exports.default = ConvertTime;
//# sourceMappingURL=convertTime.util.js.map