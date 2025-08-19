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
import React from 'react'

interface ErrorBoundaryProps {
    fallback?: React.ReactNode;
    children?: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true }
    }

      componentDidCatch(error, info) {
        // logErrorToMyService(
        //   error,
        //   // Example "componentStack":
        //   //   in ComponentThatThrows (created by App)
        //   //   in ErrorBoundary (created by App)
        //   //   in div (created by App)
        //   //   in App
        //   info.componentStack,
        //   // Warning: `captureOwnerStack` is not available in production.
        //   React.captureOwnerStack(),
        // );
      }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return this.props.fallback
        }

        return this.props.children
    }
}
