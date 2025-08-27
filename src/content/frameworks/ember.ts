import { logger, LogLevel } from '../../common/logger'

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

    private log(message: string, ...args: any[]): void {
        if (this.config.debug) {
            console.log(`[EmberSelector] ${message}`, ...args)
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

    // Synchronous element selection (no waiting, no retries)
    public selectElementsSync(
        selector: string,
        options: {
            all?: boolean
            searchInEmberRoots?: boolean
        } = {}
    ): Element[] {
        const { all = true, searchInEmberRoots = true } = options

        logger.logContent(`Sync selecting "${selector}"`, LogLevel.DEBUG)

        // Use robust selection strategies
        const elements = this.robustSelectSync(selector, searchInEmberRoots)

        logger.logContent(`Found ${elements.length} elements matching "${selector}"`, LogLevel.DEBUG)

        return all ? elements : elements.length > 0 ? [elements[0]] : []
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

    // Synchronous robust selection
    private robustSelectSync(selector: string, searchInEmberRoots: boolean = true): Element[] {
        const strategies: (() => Element[])[] = [
            // Standard querySelector
            () => Array.from(document.querySelectorAll(selector)),
        ]

        // Add Ember-specific strategy if requested
        if (searchInEmberRoots) {
            strategies.push(() => {
                const emberRoots = document.querySelectorAll('.ember-application, [data-ember-extension], .ember-view')
                const results: Element[] = []
                emberRoots.forEach((root) => {
                    results.push(...Array.from(root.querySelectorAll(selector)))
                })
                return results
            })
        }

        // Try each strategy and return the first successful result
        for (const strategy of strategies) {
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

    // Convenience methods for common selections
    public async selectH1Elements(options?: {
        timeout?: number
        waitForCount?: number
    }): Promise<HTMLHeadingElement[]> {
        const elements = await this.selectElements('h1', options)
        return elements as HTMLHeadingElement[]
    }

    public async selectH1Text(options?: { timeout?: number; waitForCount?: number }): Promise<string[]> {
        const elements = await this.selectH1Elements(options)
        return elements.map((el) => el.textContent?.trim() || '').filter((text) => text.length > 0)
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

// // Convenience functions for quick usage
// export async function selectH1Elements(config?: EmberSelectorConfig): Promise<HTMLHeadingElement[]> {
//     const selector = new EmberDOMSelector(config)
//     return selector.selectH1Elements()
// }

// export async function selectH1Text(config?: EmberSelectorConfig): Promise<string[]> {
//     const selector = new EmberDOMSelector(config)
//     return selector.selectH1Text()
// }

export async function selectEmberElements(
    cssSelector: string,
    config?: EmberSelectorConfig & { waitForCount?: number }
): Promise<Element[]> {
    const { waitForCount, ...selectorConfig } = config || {}
    const selector = new EmberDOMSelector(selectorConfig)
    return selector.selectElements(cssSelector, { waitForCount })
}

export function selectEmberElementsSync(
    cssSelector: string,
    config?: EmberSelectorConfig & { searchInEmberRoots?: boolean }
): Element[] {
    const { searchInEmberRoots = true, ...selectorConfig } = config || {}
    const selector = new EmberDOMSelector(selectorConfig)
    return selector.selectElementsSync(cssSelector, { searchInEmberRoots })
}

// Usage example for crates.io
// export async function getCratesPageInfo(config?: EmberSelectorConfig) {
//     const selector = new EmberDOMSelector({ debug: true, ...config })

//     try {
//         // Get H1 elements (package title)
//         const h1Elements = await selector.selectH1Elements({ timeout: 15000 })
//         const h1Texts = h1Elements.map((el) => el.textContent?.trim()).filter(Boolean)

//         // Get other useful elements
//         const description = await selector.selectSingle('.crate-description, [data-test="description"]')
//         const version = await selector.selectSingle('.version, [data-test="version"]')
//         const downloads = await selector.selectSingle('.downloads, [data-test="downloads"]')

//         return {
//             titles: h1Texts,
//             h1Elements,
//             description: description?.textContent?.trim() || null,
//             version: version?.textContent?.trim() || null,
//             downloads: downloads?.textContent?.trim() || null,
//         }
//     } catch (error) {
//         console.error('Failed to get crates page info:', error)
//         throw error
//     }
// }

// // Auto-execution example for content scripts
// ;(function () {
//     // Only auto-run on crates.io
//     if (window.location.hostname.includes('crates.io')) {
//         // Wait a bit for the script to load, then try to get H1 elements
//         setTimeout(async () => {
//             try {
//                 console.log('🔍 Starting Ember DOM selection...')

//                 const h1Texts = await selectH1Text({ debug: true, timeout: 20000 })
//                 console.log('📋 Found H1 elements:', h1Texts)

//                 // Also get full page info
//                 const pageInfo = await getCratesPageInfo()
//                 console.log('📦 Page info:', pageInfo)

//                 // Dispatch event with the results
//                 const event = new CustomEvent('emberElementsReady', {
//                     detail: { h1Texts, pageInfo },
//                 })
//                 document.dispatchEvent(event)
//             } catch (error) {
//                 console.error('❌ Failed to select H1 elements:', error)
//             }
//         }, 1000)
//     }
// })()

export { EmberDOMSelector }
