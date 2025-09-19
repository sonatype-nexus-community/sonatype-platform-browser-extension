---
title: Frequently Asked Questions
layout: default
menus:
  main:
    title: FAQs
    weight: 450
toc: true
---

## I have Sonatype Repository Firewall and no Applications?

You may have zero Applications if any of the following are true:
- You installed your Sonatype IQ Server without `createSampleData: true` in your `config.yml` ([read more here](https://help.sonatype.com/en/sample-data-configuration.html){:target="_blank"})
- You are connecting to a Sonatype IQ Server in Sonatype's Cloud (a SaaS tenant)
- Your Sonatype IQ Server is licensed only for Sonatype Respository Firewall

### Solution 1: I am licensed for Sonatype Lifecycle

Create (or have your Sonatype Administrator create) an Application for you - see [official documentation](https://help.sonatype.com/en/application-management.html){:target="_blank"}.

### Solution 2: I am licensed ONLY for Sonatype Repository Firewall

Sonatype Repository Firewall doesn't require Applications in the same way as Sonatype Lifecycle - thus there is no User Interface available to create and manage Applications.

An Application can be created using the Public REST APIs:
- [Organizations REST API](https://help.sonatype.com/en/organizations-rest-api.html){:target="_blank"}
- [Application REST API](https://help.sonatype.com/en/application-rest-api.html){:target="_blank"}

An **example** BASH script using curl is provided below - be sure to substitute your Sonatype IQ Server URL and provide your Sonatype IQ Server Administrator credentials:

```bash
#!/bin/bash

read -p "Base URL: " base_url
read -p "Username: " user
read -s -p "Password: " pass
echo

# Create organization
org_id=$(curl -s -X POST "$base_url/api/v2/organizations" \
  -u "$user:$pass" \
  -H 'Content-Type: application/json' \
  -d '{"name": "Sandbox Organization", "parentOrganizationId": "ROOT_ORGANIZATION_ID"}' \
  | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

echo "Organization ID: $org_id"

# Create application
curl -X POST "$base_url/api/v2/applications" \
  -u "$user:$pass" \
  -H 'Content-Type: application/json' \
  -d "{\"publicId\": \"sandbox-application\", \"name\": \"Sandbox Application\", \"organizationId\": \"$org_id\"}"
```
