/*
 * Copyright 2021-Present Sonatype Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export enum LogLevel {
    OFF = 0,
    ERROR = 1,
    WARN = 2,
    INFO = 3,
    DEBUG = 4,
    TRACE = 5,
}

export enum LogSource {
    GENERAL = "GEN",
    CONTENT_SCRIPT = "CON",
    SERVICE_WORKER = "SER",
    REACT_UI = "RUI",
    UNKNOWN = "UNK"
}

export interface ILogger {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logContent(message: string, level: LogLevel, ...meta: any): void

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logGeneral(message: string, level: LogLevel, ...meta: any): void

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logReact(message: string, level: LogLevel, ...meta: any): void

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logServiceWorker(message: string, level: LogLevel, ...meta: any): void

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logUnknown(message: string, level: LogLevel, ...meta: any): void

    /** @deprecated */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logMessage(message: string, level: LogLevel, source: LogSource, ...meta: any): void
}

export class BrowserExtensionLogger implements ILogger {

    constructor(private _level: LogLevel = LogLevel.DEBUG) { }

    public setLevel(level: LogLevel) {
        this._level = level
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public logContent(message: string, level: LogLevel, ...meta: any): void {
        this.doLog(message, level, LogSource.CONTENT_SCRIPT, meta)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public logGeneral(message: string, level: LogLevel, ...meta: any): void {
        this.doLog(message, level, LogSource.GENERAL, meta)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public logReact(message: string, level: LogLevel, ...meta: any): void {
        this.doLog(message, level, LogSource.REACT_UI, meta)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public logServiceWorker(message: string, level: LogLevel, ...meta: any): void {
        this.doLog(message, level, LogSource.SERVICE_WORKER, meta)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public logUnknown(message: string, level: LogLevel, ...meta: any): void {
        this.doLog(message, level, LogSource.UNKNOWN, meta)
    }

     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public doLog(message: string, level: LogLevel, source: LogSource = LogSource.UNKNOWN, ...meta: any): void {
        if (this._level >= level) {
            const now = new Date().toLocaleString()
            const messageToLog = `[${now}] [${level}] [${source}] ${message}`
            switch (level) {
                case LogLevel.DEBUG:
                    console.debug(messageToLog, meta)
                    break
                case LogLevel.ERROR:
                    console.error(messageToLog, meta)
                    break
                case LogLevel.INFO:
                    console.info(messageToLog, meta)
                    break
                case LogLevel.TRACE:
                    console.trace(messageToLog, meta)
                    break
                case LogLevel.WARN:
                    console.warn(messageToLog, meta)
                    break
                case LogLevel.OFF:
                    // Silence!
                    break
                default:
                    console.log(message, meta)
                    break
            }
        }
    }

    /** @deprecated */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public logMessage(message: string, level: LogLevel, source: LogSource = LogSource.UNKNOWN, ...meta: any): void {
        this.doLog(message, level, source, meta)
    }
}

export const logger = new BrowserExtensionLogger()
