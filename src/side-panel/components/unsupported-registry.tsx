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
import { NxInfoAlert } from "@sonatype/react-shared-components"
import React from "react"

export default function UnsupportedSite() {
    return (
        <section className='nx-tile'>
            <div className='nx-tile-content'>
                <NxInfoAlert>
                    <h3 className="nx-h3">Ooops...</h3>
                    <p className="nx-p">
                        The current site is not supported by this Extension.
                    </p>
                    <p className="nx-p">
                        We probably tried to close this Side Panel for you - just hit the <strong>X</strong> to hide this side panel for now.
                    </p>
                </NxInfoAlert>
            </div>
        </section>
    )
}