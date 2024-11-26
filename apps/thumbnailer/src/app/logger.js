"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var writeLog = function (message, severity, data) {
    if (data === void 0) { data = {}; }
    var entry = Object.assign({
        severity: severity,
        message: message,
    }, data);
    if (process.env.NODE_ENV === "production") {
        console.log(JSON.stringify(entry));
    }
    else {
        console.log(JSON.stringify(entry));
    }
};
/**
 Enums
 DEFAULT    (0) The log entry has no assigned severity level.
 DEBUG    (100) Debug or trace information.
 INFO    (200) Routine information, such as ongoing status or performance.
 NOTICE    (300) Normal but significant events, such as start up, shut down, or a configuration change.
 WARNING    (400) Warning events might cause problems.
 ERROR    (500) Error events are likely to cause problems.
 CRITICAL    (600) Critical events cause more severe problems or outages.
 ALERT    (700) A person must take an action immediately.
 EMERGENCY    (800) One or more systems are unusable.
 */
var logger = {
    log: function (msg, data) { return writeLog(msg, "DEFAULT", data); },
    debug: function (msg, data) { return writeLog(msg, "DEBUG", data); },
    info: function (msg, data) { return writeLog(msg, "INFO", data); },
    notice: function (msg, data) { return writeLog(msg, "NOTICE", data); },
    warning: function (msg, data) { return writeLog(msg, "WARNING", data); },
    error: function (msg, data) { return writeLog(msg, "ERROR", data); },
    critical: function (msg, data) { return writeLog(msg, "CRITICAL", data); },
    alert: function (msg, data) { return writeLog(msg, "ALERT", data); },
    emergency: function (msg, data) { return writeLog(msg, "EMERGENCY", data); },
};
exports.default = logger;
