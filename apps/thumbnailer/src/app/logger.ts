const writeLog = (message: String, severity: String, data: Object = {}) => {
    const entry = Object.assign(
        {
            severity,
            message,
        },
        data
    );
    if (process.env.NODE_ENV === "production") {
        console.log(JSON.stringify(entry));
    } else {
        console.log(JSON.stringify(entry));
    }

}
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
const logger = {
    log: (msg: String, data?: Object) => writeLog(msg, "DEFAULT", data),
    debug: (msg: String, data?: Object) => writeLog(msg, "DEBUG", data),
    info: (msg: String, data?: Object) => writeLog(msg, "INFO", data),
    notice: (msg: String, data?: Object) => writeLog(msg, "NOTICE", data),
    warning: (msg: String, data?: Object) => writeLog(msg, "WARNING", data),
    error: (msg: String, data?: Object) => writeLog(msg, "ERROR", data),
    critical: (msg: String, data?: Object) => writeLog(msg, "CRITICAL", data),
    alert: (msg: String, data?: Object) => writeLog(msg, "ALERT", data),
    emergency: (msg: String, data?: Object) => writeLog(msg, "EMERGENCY", data),
}
export default logger;
