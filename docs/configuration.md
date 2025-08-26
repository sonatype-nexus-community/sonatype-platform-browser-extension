---
title: Configuring the Sonatype Platform Browser Extension
layout: default
menus:
  main:
    title: Configuration
    weight: 25
---

Upon successfully addition of the Sonatype Platform Browser Extension, you'll automatically be shown the "Getting Started" screen to make the necessary configuration.

![Installation Step 1](./images/install-01.png)

Enter the URL of your Sonatype IQ Server and click "Grant Permissions to your Sonatype IQ Server".

![Installation Step 2](./images/install-02.png)

Click "Allow".

You can now enter your credentials for your Sonatype IQ Server and click "Connect". Upon successful authentication, you'll be provided a list of Applications you have permissions for in your Sonatype IQ Server - choose one!

![Installation Step 3](./images/install-03.png)

That's it - you have configured the Sonatype Platform Browser Extension. You can close the configuration tab. If you need to make changes to the configuration

## Advanced Configuration

### Support for Sonatype Nexus Repository

If your organisation runs one or more instances of Sonatype Nexus Repository, you can add these under Advanced Options.

![Configure Sonatype Nexus Repository](./images/configure-add-nxrm.png)

> **_NOTE:_** The Sonatype Nexus Repository instance must be accessible via `http://` or `https://`

When browsing Sonatype Nexus Repository instances you have added, this extension will look to provide insight for Open Source Components for the following format repositories:

-   CocoaPods
-   Maven (Java)
-   NPM (Javascript)
-   PyPi (Python)
-   R (CRAN)
-   RubyGems

![Browsing Sonatype Nexus Repository](./images/browse-nxrm.png)