"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const signale_1 = require("signale");
const options = {
    disabled: false,
    interactive: false,
    logLevel: 'info',
    scope: "Kwan's 2 v.2.4.0",
};
class Logger extends signale_1.Signale {
    constructor() {
        super(Object.assign(Object.assign({}, options), { types: {
                info: {
                    badge: 'ℹ',
                    color: 'blue',
                    label: 'info',
                },
                warn: {
                    badge: '⚠',
                    color: 'yellow',
                    label: 'warn',
                },
                error: {
                    badge: '✖',
                    color: 'red',
                    label: 'error',
                },
                debug: {
                    badge: '🐛',
                    color: 'magenta',
                    label: 'debug',
                },
                success: {
                    badge: '✔',
                    color: 'green',
                    label: 'success',
                },
                log: {
                    badge: '📝',
                    color: 'white',
                    label: 'log',
                },
                pause: {
                    badge: '⏸',
                    color: 'yellow',
                    label: 'pause',
                },
                start: {
                    badge: '▶',
                    color: 'green',
                    label: 'start',
                },
            } }));
    }
}
exports.Logger = Logger;
//# sourceMappingURL=Logger.class.js.map