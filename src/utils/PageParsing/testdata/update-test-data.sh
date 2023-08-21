#!/bin/bash

function get_data() {
    DEST=$1
    SOURCE_URL=$2
    echo "Downloading from ${SOURCE_URL} to: ${DEST}"
    curl -s -X GET -o "${DEST}" "${SOURCE_URL}"
}

# Alpine - Skipped as no direct URL to specific version
# This is an ecosystem limitation - they only keep the latest release!

# central.sonatype.com
get_data "CentralSonatypeCom.html" "https://central.sonatype.com/artifact/org.cyclonedx/cyclonedx-core-java/7.3.2"

# CocoaPods

# Conan.io

# CRAN (may break if new version of oysterR is releaseed)
get_data "cran.html" "https://cran.r-project.org/web/packages/oysteR/index.html"

# mvnrepository.com
get_data "MVNRepository.html" "https://mvnrepository.com/artifact/org.apache.struts/struts2-core/2.2.3"

# NPM
get_data "npm.html" "https://www.npmjs.com/package/@sonatype/react-shared-components/v/6.0.1"
get_data "npm2.html" "https://www.npmjs.com/package/@sonatype/policy-demo/v/2.3.0"

# NuGet
get_data "nuget-Newtonsoft.JSON-v13.0.1.html" "https://www.nuget.org/packages/Newtonsoft.Json/13.0.1"
get_data "nuget-Newtonsoft.JSON-v13.0.3.html" "https://www.nuget.org/packages/Newtonsoft.Json/13.0.3"

# Packagist
get_data "packagist-laravel-its-lte-4.23.0.html" "https://packagist.org/packages/fomvasss/laravel-its-lte#4.23.0"
get_data "packagist-laravel-its-lte-4.22.html" "https://packagist.org/packages/fomvasss/laravel-its-lte#4.22"

# PyPi
get_data "" "https://pypi.org/project/Django/4.2.1/"

# RubyGems
get_data "rubygems-chelsea-0.0.32.html" "https://rubygems.org/gems/chelsea/versions/0.0.32"
get_data "rubygems-chelsea-0.0.35.html" "https://rubygems.org/gems/chelsea/versions/0.0.35"
get_data "rubygems-logstash-input-tcp-6.0.9-java.html" "https://rubygems.org/gems/logstash-input-tcp/versions/6.0.9-java"

# search.maven.org
get_data "smo-cyclonedx-maven-plugin-2.7.6.html" "https://search.maven.org/artifact/org.cyclonedx/cyclonedx-maven-plugin/2.7.6/maven-plugin"
get_data "smo-struts2-core-2.3.30.html" "https://search.maven.org/artifact/org.apache.struts/struts2-core/2.3.30/jar"
