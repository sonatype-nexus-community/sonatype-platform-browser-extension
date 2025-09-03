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
import { logger, LogLevel } from '../../common/logger'

interface EmberSelectorConfig {
    timeout?: number
    checkInterval?: number
    debug?: boolean
    waitForEmber?: boolean
}

class EmberDOMSelector {
    private config: Required<EmberSelectorConfig>

    constructor(config: EmberSelectorConfig = {}) {
        this.config = {
            timeout: config.timeout || 15000,
            checkInterval: config.checkInterval || 100,
            debug: config.debug || false,
            waitForEmber: config.waitForEmber !== false, // Default to true
        }
    }

    // Wait for Ember to be ready
    private async waitForEmberReady(): Promise<void> {
        if (!this.config.waitForEmber) return

        return new Promise((resolve, reject) => {
            let attempts = 0
            const maxAttempts = this.config.timeout / this.config.checkInterval

            const checkEmber = () => {
                attempts++
                logger.logContent(`Waiting for Ember... attempt ${attempts}/${maxAttempts}`, LogLevel.DEBUG)

                // Check multiple Ember readiness indicators
                const emberReady = this.isEmberReady()

                if (emberReady) {
                    logger.logContent('Ember is ready!', LogLevel.DEBUG)
                    // Give a small additional delay for final DOM updates
                    setTimeout(resolve, 50)
                    return
                }

                if (attempts >= maxAttempts) {
                    logger.logContent('Timeout waiting for Ember', LogLevel.DEBUG)
                    reject(new Error('Timeout waiting for Ember to be ready'))
                    return
                }

                setTimeout(checkEmber, this.config.checkInterval)
            }

            checkEmber()
        })
    }

    private isEmberReady(): boolean {
        // Check for Ember application readiness
        const emberGlobal = (window as any).Ember
        const emberApp = (window as any).App

        // Multiple ways to check if Ember is ready
        const hasEmberGlobal = !!emberGlobal
        const hasEmberApp = !!emberApp
        const hasEmberViews = document.querySelectorAll('.ember-view').length > 0
        const hasEmberExtension = !!document.querySelector('[data-ember-extension]')
        const bodyText = document.body.textContent || ''
        const hasContent = bodyText.trim().length > 0

        // Check for loading indicators being gone
        const loadingSelectors = ['.loading', '.spinner', '.ember-loading', '[data-loading]', '.loading-spinner']

        const hasVisibleLoaders = loadingSelectors.some((selector) => {
            const elements = document.querySelectorAll(selector)
            return Array.from(elements).some((el) => {
                const style = window.getComputedStyle(el)
                return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0'
            })
        })

        logger.logContent('Ember readiness check:', LogLevel.DEBUG, {
            hasEmberGlobal,
            hasEmberApp,
            hasEmberViews,
            hasEmberExtension,
            hasContent,
            hasVisibleLoaders,
        })

        return (hasEmberGlobal || hasEmberApp || hasEmberViews || hasEmberExtension) && hasContent && !hasVisibleLoaders
    }

    // Enhanced element selection with retries
    public async selectElements(
        selector: string,
        options: {
            timeout?: number
            all?: boolean
            waitForCount?: number
        } = {}
    ): Promise<Element[]> {
        const { timeout = 10000, all = true, waitForCount = 0 } = options

        // First wait for Ember to be ready
        await this.waitForEmberReady()

        return new Promise((resolve, reject) => {
            let attempts = 0
            const maxAttempts = timeout / this.config.checkInterval

            const trySelect = () => {
                attempts++
                logger.logContent(`Selecting "${selector}"... attempt ${attempts}/${maxAttempts}`, LogLevel.DEBUG)

                // Use multiple selection strategies
                const elements = this.robustSelect(selector)

                if (elements.length > 0 && (waitForCount === 0 || elements.length >= waitForCount)) {
                    logger.logContent(`Found ${elements.length} elements matching "${selector}"`, LogLevel.DEBUG)
                    resolve(all ? elements : [elements[0]])
                    return
                }

                if (attempts >= maxAttempts) {
                    logger.logContent(`Timeout: Could not find elements matching "${selector}"`, LogLevel.DEBUG)
                    reject(new Error(`Timeout: Could not find elements matching "${selector}"`))
                    return
                }

                setTimeout(trySelect, this.config.checkInterval)
            }

            trySelect()
        })
    }

    // Robust selection that tries multiple approaches
    private robustSelect(selector: string): Element[] {
        const strategies = [
            // Standard querySelector
            () => Array.from(document.querySelectorAll(selector)),

            // Try within Ember application root
            () => {
                const emberRoots = document.querySelectorAll('.ember-application, [data-ember-extension], .ember-view')
                const results: Element[] = []
                emberRoots.forEach((root) => {
                    results.push(...Array.from(root.querySelectorAll(selector)))
                })
                return results
            },

            // Try with a small delay (for late-rendering content)
            () => {
                return new Promise<Element[]>((resolve) => {
                    setTimeout(() => {
                        resolve(Array.from(document.querySelectorAll(selector)))
                    }, 100)
                })
            },
        ]

        // Try each strategy and return the first successful result
        for (const strategy of strategies.slice(0, 2)) {
            // Skip async strategy in sync context
            try {
                const result = strategy()
                if (Array.isArray(result) && result.length > 0) {
                    return result
                }
            } catch (error) {
                logger.logContent('Selection strategy failed:', LogLevel.DEBUG, error)
            }
        }

        return []
    }

    public async selectSingle(selector: string, timeout = 10000): Promise<Element | null> {
        try {
            const elements = await this.selectElements(selector, { timeout, all: false })
            return elements[0] || null
        } catch {
            return null
        }
    }
}

export { EmberDOMSelector }
