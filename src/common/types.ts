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
export type ActiveInfo = chrome.tabs.OnActivatedInfo | browser.tabs._OnActivatedActiveInfo

export type ChangeInfo = browser.tabs._OnUpdatedChangeInfo

export type ContentScripts = chrome.scripting.RegisteredContentScript | browser.scripting.RegisteredContentScript

export type MessageRequestOptions = chrome.runtime.MessageOptions | browser.runtime._SendMessageOptions

export type MessageSender = chrome.runtime.MessageSender | browser.runtime.MessageSender

export type OnInstalledDetails = chrome.runtime.InstalledDetails | browser.runtime._OnInstalledDetails

export type PortType = chrome.runtime.Port | browser.runtime.Port

export type RemoveInfo = chrome.tabs.OnRemovedInfo | browser.tabs._OnRemovedRemoveInfo

export type RuntimeLastError = chrome.runtime.LastError | browser.runtime._LastError

export type TabType = chrome.tabs.Tab | browser.tabs.Tab

export type WindowType = chrome.windows.Window | browser.windows.Window