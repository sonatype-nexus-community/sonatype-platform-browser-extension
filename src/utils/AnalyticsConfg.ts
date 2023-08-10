/*
 * Copyright (c) 2019-present Sonatype, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Set GA_ENDPOINT == 'https://www.google-analytics.com/mp/collect' for Production builds
 *
 */

export const GA_ENDPOINT = 'https://www.google-analytics.com/debug/mp/collect'
export const MEASUREMENT_ID = 'GA_MEASUREMENT_ID'
export const API_SECRET = 'GA_API_SECRET'
export const DEFAULT_ENGAGEMENT_TIME_MSEC = 100
export const SESSION_EXPIRATION_IN_MIN = 30
