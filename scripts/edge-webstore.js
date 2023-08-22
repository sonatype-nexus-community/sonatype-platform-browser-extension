/**
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

const fs = require('fs')
const ews = '@plasmo-corp/ewu'

if (process.argv.length < 3) {
    console.error(`Expected a two arguments: ${process.argv[1]} <verify|publish> <major|minor|patch>`)
    process.exit(1)
}

const SCRIPT_MODE = process.argv[2].toUpperCase()
let RELEASE_TYPE = 'UNKNOWN'
if (SCRIPT_MODE === 'PUBLISH') {
    RELEASE_TYPE = process.argv[3].toUpperCase()
}

const PRODUCT_ID = process.env.EDGE_PRODUCT_ID
const CLIENT_ID = process.env.EDGE_CLIENT_ID
const CLIENT_SECRET = process.env.EDGE_CLIENT_SECRET
const ACCESS_TOKEN_URL = process.env.EDGE_ACCESS_TOKEN_URL
const SUBMISSION_NOTES = process.env.EDGE_SUBMISSION_NOTES
const ZIP_PATH = './sonatype-platform-browser-extension.zip'

if (RELEASE_TYPE === 'PATCH') {
    console.log('Skipping release to Microsoft Edge Webstore for patch release')
    process.exit(0)
}

if (PRODUCT_ID === undefined) {
    console.log('EDGE_PRODUCT_ID is not set - cannot continue.')
    process.exit(1)
}

if (CLIENT_ID === undefined) {
    console.log('EDGE_CLIENT_ID is not set - cannot continue.')
    process.exit(1)
}

if (CLIENT_SECRET === undefined) {
    console.log('EDGE_CLIENT_SECRET is not set - cannot continue.')
    process.exit(1)
}

if (ACCESS_TOKEN_URL === undefined) {
    console.log('EDGE_ACCESS_TOKEN_URL is not set - cannot continue.')
    process.exit(1)
}

if (SUBMISSION_NOTES === undefined) {
    console.log('EDGE_SUBMISSION_NOTES is not set - cannot continue.')
    process.exit(1)
}

if (SCRIPT_MODE == 'PUBLISH') {
    if (!fs.existsSync(ZIP_PATH)) {
        console.log(`ZIP does not exist at expected location: ${ZIP_PATH}`)
        process.exit(1)
    }

    import(ews).then((module) => {
        const client = new module.EdgeWebstoreClient({
            productId: PRODUCT_ID,
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            accessTokenUrl: ACCESS_TOKEN_URL,
        })

        client
            .submit({
                filePath: ZIP_PATH,
                notes: atob(SUBMISSION_NOTES),
            })
            .then((r) => {
                console.log(r)
                console.log('Published to Edge Web Store')
            })
    })
}
