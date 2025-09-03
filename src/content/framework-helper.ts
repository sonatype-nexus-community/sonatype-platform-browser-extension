/*
 * Copyright (c) 2019-present Sonatype, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
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
import { logger, LogLevel } from "../common/logger"

interface FrameworkDetectionConfig {
    timeout?: number
    checkInterval?: number
    frameworks?: ('react' | 'ember')[]
}

class FrameworkRenderDetector {
    private readonly config: Required<Omit<FrameworkDetectionConfig, 'frameworks'>> & { frameworks: ('react' | 'ember')[] }
    private checkCount = 0
    private maxChecks: number

    constructor(config: FrameworkDetectionConfig = {}) {
        this.config = {
            timeout: config.timeout || 10000, // 10 seconds default timeout
            checkInterval: config.checkInterval || 100, // Check every 100ms
            frameworks: config.frameworks || ['react', 'ember'],
        }
        this.maxChecks = this.config.timeout / this.config.checkInterval
    }

    // React detection methods
    private hasReactDevTools(): boolean {
        // Check for React DevTools extensions
        return !!(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__
    }

    private hasReactFiber(): boolean {
        // Check for React Fiber (React 16+) by looking for fiber nodes
        const rootElements = document.querySelectorAll('[data-reactroot], #root, #app, [id*="react"], [class*="react"]')

        for (const element of Array.from(rootElements)) {
            const keys = Object.keys(element)
            // Look for React Fiber keys (they start with __reactFiber or __reactInternalInstance)
            if (keys.some((key) => key.startsWith('__reactFiber') || key.startsWith('__reactInternalInstance'))) {
                return true
            }
        }
        return false
    }

    private hasReactElements(): boolean {
        // Check for common React patterns in the DOM
        const reactSelectors = [
            '[data-reactroot]',
            '[data-react-helmet]',
            '[data-reactid]',
            '*[class*="react-"]',
            '*[id*="react-"]',
        ]

        return reactSelectors.some((selector) => document.querySelector(selector) !== null)
    }

    private checkForReactRouter(): boolean {
        // Check for React Router elements
        return !!(
            document.querySelector('[data-reach-router-root]') ||
            document.querySelector('*[class*="router"]') ||
            (window as any).history?.location
        )
    }

    // Ember.js detection methods
    private hasEmberApp(): boolean {
        // Check for Ember application instance
        const emberGlobal = (window as any).Ember
        if (!emberGlobal) return false

        // Check for Ember application registry
        const emberApp =
            (window as any).App ||
            Object.values(emberGlobal.Application.REGISTRY || {}).find(Boolean) ||
            document.querySelector('[data-ember-extension]')

        return !!emberApp
    }

    private hasEmberElements(): boolean {
        // Check for Ember-specific DOM patterns
        const emberSelectors = [
            '[data-ember-extension]',
            '[data-ember-action]',
            '*[class*="ember-"]',
            '*[id*="ember-"]',
            '.ember-application',
            '.ember-view',
        ]

        return emberSelectors.some((selector) => document.querySelector(selector) !== null)
    }

    private hasEmberRouter(): boolean {
        // Check for Ember Router
        const emberGlobal = (window as any).Ember
        if (!emberGlobal) return false

        // Check if router has rendered routes
        const router = emberGlobal.getOwner?.(emberGlobal.Application.REGISTRY)?.lookup?.('router:main')
        return (
            !!router ||
            !!document.querySelector('[data-ember-outlet]') ||
            !!document.querySelector('*[class*="route-"]')
        )
    }

    private hasStableDOM(): boolean {
        // Check if DOM appears stable (not actively changing)
        const bodyChildren = document.body.children.length
        const bodyText = document.body.textContent
        const hasContent = bodyChildren > 0 && bodyText !== null && bodyText.trim().length > 0

        // Check for loading indicators
        const loadingElements = document.querySelectorAll(
            [
                '[class*="loading"]',
                '[class*="spinner"]',
                '[class*="skeleton"]',
                '[aria-label*="loading" i]',
                '[aria-label*="Loading" i]',
            ].join(', ')
        )

        const hasVisibleLoaders = Array.from(loadingElements).some((el) => {
            const style = window.getComputedStyle(el)
            return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0'
        })

        return hasContent && !hasVisibleLoaders
    }

    private isFrameworkRendered(): boolean {
        // Combine multiple detection strategies for enabled frameworks
        const results: { [key: string]: boolean } = {}

        if (this.config.frameworks.includes('react')) {
            const hasReact = this.hasReactDevTools() || this.hasReactFiber() || this.hasReactElements()
            const hasReactRouter = this.checkForReactRouter()
            results.react = hasReact
            results.reactRouter = hasReactRouter
        }

        if (this.config.frameworks.includes('ember')) {
            const hasEmber = this.hasEmberApp() || this.hasEmberElements()
            const hasEmberRouter = this.hasEmberRouter()
            results.ember = hasEmber
            results.emberRouter = hasEmberRouter
        }

        const hasStableContent = this.hasStableDOM()

        logger.logContent('Framework Detection results:', LogLevel.DEBUG, {
            ...results,
            hasStableDOM: hasStableContent,
            enabledFrameworks: this.config.frameworks,
        })

        // Framework is considered rendered if we detect any enabled framework and have stable DOM
        const frameworkDetected = Object.values(results).some(Boolean)
        return frameworkDetected && hasStableContent
    }

    public waitForFrameworkRender(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            logger.logContent('Starting framework render detection...', LogLevel.DEBUG)

            const checkRender = () => {
                this.checkCount++
                logger.logContent(`Check ${this.checkCount}/${this.maxChecks}`, LogLevel.DEBUG)

                if (this.isFrameworkRendered()) {
                    logger.logContent('Framework render detected!', LogLevel.DEBUG)
                    resolve(true)
                    return
                }

                if (this.checkCount >= this.maxChecks) {
                    logger.logContent('Timeout reached, framework render not detected', LogLevel.DEBUG)
                    reject(new Error('Timeout: Framework render not detected'))
                    return
                }

                setTimeout(checkRender, this.config.checkInterval)
            }

            // Start checking immediately if DOM is already loaded
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', checkRender)
            } else {
                checkRender()
            }
        })
    }
}

// Simple usage - just detect when React or Ember is rendered
export async function waitForFrameworkPage(config?: FrameworkDetectionConfig): Promise<void> {
    const detector = new FrameworkRenderDetector(config)
    try {
        await detector.waitForFrameworkRender()
    } catch (error) {
        logger.logContent('Failed to detect framework page render:', LogLevel.ERROR, error)
        throw error
    }
}
