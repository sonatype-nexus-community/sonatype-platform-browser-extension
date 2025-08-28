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
import { NxErrorAlert } from "@sonatype/react-shared-components"
import React from "react"

export default function TabError() {
    return (
        <section className='nx-tile'>
            <div className='nx-tile-content'>
                <NxErrorAlert>
                    <h3 className="nx-h3">How embarassing...</h3>
                    <p className="nx-p">
                        There&apos;s been an unexpected error.
                    </p>
                </NxErrorAlert>
            </div>
        </section>
    )
}