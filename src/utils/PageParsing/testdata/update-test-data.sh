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
get_data "central-s-c-android.html" "https://central.sonatype.com/artifact/com.fpliu.ndk.pkg.prefab.android.21/curl/7.82.0/overview"
get_data "central-s-c-scalacheck-bundle.html" "https://central.sonatype.com/artifact/org.scalatestplus/scalacheck-1-17_sjs1_3/3.2.17.0"
get_data "central-s-c-log4j-parent.html" "https://central.sonatype.com/artifact/org.apache.logging.log4j/log4j/3.0.0-alpha1"
get_data "central-s-c-custom-properties-maven-plugin.html" "https://central.sonatype.com/artifact/net.sf.czsem/custom-properties-maven-plugin/4.0.3"
get_data "central-s-c-cool-jconon.html" "https://central.sonatype.com/artifact/it.cnr.si.cool.jconon/cool-jconon/5.2.44"
get_data "central-s-c-jakarta-ivt.html" "https://central.sonatype.com/artifact/com.ibm.mq/wmq.jakarta.jmsra.ivt/9.3.3.1"
get_data "central-s-c-commons-io.html" "https://central.sonatype.com/artifact/commons-io/commons-io/2.15.1/overview"

# CocoaPods

# Conan.io
get_data "conanio-proj-8.2.1.html" "https://conan.io/center/recipes/proj?version=8.2.1"
get_data "conanio-libxft-2.3.8.html" "https://conan.io/center/recipes/libxft?version=2.3.8"
get_data "conanio-libxft-2.3.6.html" "https://conan.io/center/recipes/libxft?version=2.3.6"

# CRAN (may break if new version of oysterR is releaseed)
get_data "cran.html" "https://cran.r-project.org/web/packages/oysteR/index.html"

# Go
get_data "pkg.go.dev/golang.org-x-text-0.20.0.html" "https://pkg.go.dev/golang.org/x/text@v0.20.0"
get_data "pkg.go.dev/go.etcd.io-etcd-client-v3-3.5.17.html" "https://pkg.go.dev/go.etcd.io/etcd/client/v3@v3.5.17"
get_data "pkg.go.dev/gopkg.in-ini.v1-1.67.0.html" "https://pkg.go.dev/gopkg.in/ini.v1@v1.67.0"

# mvnrepository.com
get_data "MVNRepository.html" "https://mvnrepository.com/artifact/org.apache.struts/struts2-core/2.2.3"

# NPM
get_data "npm.html" "https://www.npmjs.com/package/@sonatype/react-shared-components/v/13.3.2"
get_data "npm2.html" "https://www.npmjs.com/package/@sonatype/policy-demo/v/2.3.0"
get_data "npm-deprecated.html" "https://www.npmjs.com/package/path-is-absolute/v/2.0.0"

# NuGet
get_data "nuget-Newtonsoft.JSON-v13.0.1.html" "https://www.nuget.org/packages/Newtonsoft.Json/13.0.1"
get_data "nuget-Newtonsoft.JSON-v13.0.3.html" "https://www.nuget.org/packages/Newtonsoft.Json/13.0.3"

# Packagist
get_data "packagist-laravel-its-lte-4.23.0.html" "https://packagist.org/packages/fomvasss/laravel-its-lte#4.23.0"
get_data "packagist-laravel-its-lte-4.22.html" "https://packagist.org/packages/fomvasss/laravel-its-lte#4.22"

# PyPi
get_data "pypi-Django-4.2.1.html" "https://pypi.org/project/Django/4.2.1/"
get_data "pypi-numpy-1.14.0.html" "https://pypi.org/project/numpy/1.14.0/"
get_data "pypi-Twisted-19.2.0.html" "https://pypi.org/project/Twisted/19.2.0/"
get_data "pypi-mediapipe-0.10.14.html" "https://pypi.org/project/mediapipe/0.10.14/"

# RubyGems
get_data "rubygems-chelsea-0.0.32.html" "https://rubygems.org/gems/chelsea/versions/0.0.32"
get_data "rubygems-chelsea-0.0.35.html" "https://rubygems.org/gems/chelsea/versions/0.0.35"
get_data "rubygems-logstash-input-tcp-6.0.9-java.html" "https://rubygems.org/gems/logstash-input-tcp/versions/6.0.9-java"

# search.maven.org
get_data "smo-cyclonedx-maven-plugin-2.7.6.html" "https://search.maven.org/artifact/org.cyclonedx/cyclonedx-maven-plugin/2.7.6/maven-plugin"
get_data "smo-struts2-core-2.3.30.html" "https://search.maven.org/artifact/org.apache.struts/struts2-core/2.3.30/jar"
