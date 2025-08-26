---
title: Using the Sonatype Platform Browser Extension
layout: default
menus:
  main:
    title: Usage
    weight: 25
---

When you browse to a website that is supported by the Sonatype Platform Browser Extension, such as [Maven Central](https://central.sonatype.com/) the extension will assess the component you are viewing and alert you if there are known issues.

### Pinning the Extension

Extension by default are not always visible - we recommend you Pin the Sonatype Platform Browser Extension so it is easily accessible as you navigate. To do this find the "Extensions" icon in the top right of your browser (usually) as highlighed in red:

![Pinning the Extension - Step 1](./images/pin-extension-01.png)

Then click the Pin icon as highlighted next to the Sonatype Platform Browser Extension.

![Pinning the Extension - Step 2](./images/pin-extension-02.png)

You'll now always have the Sonatype Platform Browser Extension icon visible in the top right.

### Opening the Extension

As you browse supported registries, you'll notice the Sonatype Platform Browser Extension change colour to warn you when your Sonatype IQ Server reports issues for the component you are viewing.

![Browsing Maven Central](./images/browse-01.png)

To get the details behind the warning, click the Sonatype Platform Browser Extension icon (top right).

### Component Information

When you acess the Sonatype Platform Browser Extension, you'll be shown the information known by Sonatype about the component you are viewing.

![Component Information](./images/extension-open-01.png)

### Remediation Advice

Accessing the "Remediation" tab will provide easy access to recommended versions along with a timeline of all known versions and how they stack up against your organisations policies in your Sonatype IQ Server.

![Remediation Information](./images/extension-open-02.png)

For Open Source Registries that support navigation to specific versions, you can click on the Remediation or Version to have your browser navigate to that version easily.
See [this table](#public-registries) to see which Registries we have support for this.

### Policy Violation(s)

The "Policy" tab allows you to understand why your Organisational policies were violated - i.e. what caused the violations.

![Policy Violation(s) Details](./images/extension-open-03.png)

### Known Security Issues

The "Security" tab allows you to understand what known security issues affect the component you are viewing.

![Known Security Issues](./images/extension-open-04.png)

### Open Source License(s)

The "Legal" tab allows you to understand what open source licenses apply or might apply to the component you are viewing.

![Known Security Issues](./images/extension-open-05.png)

## Additional Feature Support

Current and future additional features are available based on the additional capabilities provided by your Sonatype Platform license. In addition to having the correct license installed at the Sonatype IQ Server, some features require that they be enabled.

[Advanced Legal Pack](https://help.sonatype.com/iqserver/product-information/add-on-packs/advanced-legal-pack-quickstart)

-   [Extended Observed License Detections](https://help.sonatype.com/iqserver/configuring/advanced-legal-pack-extended-observed-license-detections) - When enabled, the browser extenstion shows the observed licenses detected for that component.

## Caveats

### PyPi Packages with No Source Distribution

There are a few examples of projects published to PyPi (such as [mediapipe](https://pypi.org/project/mediapipe/)) that have not published a Source Distribution.

By default, when the Sonatype Platform Browser Extension looks up data on PyPi packages, we default to looking up information based on it's Source Distribution - 
this has no consideration as to your Python Version or Architecture.

When looking up data based on a Built Distribution, this can include the Python Version and/or Architecture, and this may not provide an accurate representation
of the risks associated with your use of the Package if your Python Version and/or Architrecture differ from the first Build Distribution in the list.