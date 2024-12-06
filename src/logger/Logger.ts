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

export interface ILogger {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logMessage(message: string, level: LogLevel, ...meta: any): void
}

export class BrowserExtensionLogger implements ILogger {
    constructor(private _level: LogLevel = LogLevel.DEBUG) {}

    public setLevel(level: LogLevel) {
        this._level = level
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public logMessage = (message: string, level: LogLevel, ...meta: any): void => {
        if (this._level >= level) {
            const now = new Date().toLocaleString()
            switch (level) {
                case LogLevel.DEBUG:
                    console.debug(`[${now}] DBG ${message}`, LogLevel[level].toString(), meta)
                    break
                case LogLevel.ERROR:
                    console.error(`[${now}] ERR ${message}`, LogLevel[level].toString(), meta)
                    break
                case LogLevel.INFO:
                    console.info(`[${now}] INF ${message}`, LogLevel[level].toString(), meta)
                    break
                case LogLevel.TRACE:
                    console.trace(`[${now}] TRC ${message}`, LogLevel[level].toString(), meta)
                    break
                case LogLevel.WARN:
                    console.warn(`[${now}] WRN ${message}`, LogLevel[level].toString(), meta)
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
}

export const logger = new BrowserExtensionLogger()
