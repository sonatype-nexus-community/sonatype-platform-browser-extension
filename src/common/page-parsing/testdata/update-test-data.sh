#!/bin/bash

function get_data() {
    DEST=$1
    SOURCE_URL=$2
    echo "Downloading from ${SOURCE_URL} to: ${DEST}"
    curl -s -X GET -o "${DEST}" "${SOURCE_URL}"
}

# Alpine - Skipped as no direct URL to specific version
# STATIC pkgs.alpinelinux.org/openssl-3.3.2-r4.html

# central.sonatype.com
get_data "central.sonatype.com/cyclonedx-core-java-7.3.2.html" "https://central.sonatype.com/artifact/org.cyclonedx/cyclonedx-core-java/7.3.2"
get_data "central.sonatype.com/c-f-n-p-p-a-21-curl-7.82.0.html" "https://central.sonatype.com/artifact/com.fpliu.ndk.pkg.prefab.android.21/curl/7.82.0/overview"
get_data "central.sonatype.com/scalacheck-bundle.html" "https://central.sonatype.com/artifact/org.scalatestplus/scalacheck-1-17_sjs1_3/3.2.17.0"
get_data "central.sonatype.com/log4j-parent.html" "https://central.sonatype.com/artifact/org.apache.logging.log4j/log4j/3.0.0-alpha1"
get_data "central.sonatype.com/custom-properties-maven-plugin.html" "https://central.sonatype.com/artifact/net.sf.czsem/custom-properties-maven-plugin/4.0.3"
get_data "central.sonatype.com/cool-jconon.html" "https://central.sonatype.com/artifact/it.cnr.si.cool.jconon/cool-jconon/5.2.44"
get_data "central.sonatype.com/jakarta-ivt.html" "https://central.sonatype.com/artifact/com.ibm.mq/wmq.jakarta.jmsra.ivt/9.3.3.1"
get_data "central.sonatype.com/commons-io.html" "https://central.sonatype.com/artifact/commons-io/commons-io/2.15.1/overview"

# CocoaPods
# STATIC "cocoapods.org/log4swift-1.2.0.html"

# Conan.io
get_data "conan.io/proj-8.2.1.html" "https://conan.io/center/recipes/proj?version=8.2.1"
get_data "conan.io/proj-9.5.0.html" "https://conan.io/center/recipes/proj?version=9.5.0"
get_data "conan.io/libxft-2.3.6.html" "https://conan.io/center/recipes/libxft?version=2.3.6"

# CRAN (may break if new version of oysterR is releaseed)
get_data "cran.r-project.org/oysteR-0.1.1.html" "https://cran.r-project.org/web/packages/oysteR/index.html"

# crates.io (Cargo)
get_data "crates.io/cargo-pants-0.4.25.html" "https://crates.io/crates/cargo-pants/0.4.25"
get_data "crates.io/cargo-pants-0.4.24.html" "https://crates.io/crates/cargo-pants/0.4.24"

# Go (pkg.go.dev)
get_data "pkg.go.dev/golang.org-x-text-0.20.0.html" "https://pkg.go.dev/golang.org/x/text@v0.20.0"
get_data "pkg.go.dev/go.etcd.io-etcd-client-v3-3.5.17.html" "https://pkg.go.dev/go.etcd.io/etcd/client/v3@v3.5.17"
get_data "pkg.go.dev/gopkg.in-ini.v1-1.67.0.html" "https://pkg.go.dev/gopkg.in/ini.v1@v1.67.0"

# huggingface.co
get_data "huggingface.co/distilbert-distilbert-base-uncased-home.html" "https://huggingface.co/distilbert/distilbert-base-uncased"
get_data "huggingface.co/distilbert-distilbert-base-uncased-tree-main.html" "https://huggingface.co/distilbert/distilbert-base-uncased/tree/main"
get_data "huggingface.co/OuteTTS-0.2-500M-GGUF-tree-main.html" "https://huggingface.co/OuteAI/OuteTTS-0.2-500M-GGUF/tree/main"
get_data "huggingface.co/mohsen2-pytorch-tree-main.html" "https://huggingface.co/mohsen2/pytorch_model.bin/tree/main"

# mvnrepository.com

# npmjs.com (NPM)
get_data "npmjs.com/sonatype-react-shared-components-13.3.2.html" "https://www.npmjs.com/package/@sonatype/react-shared-components/v/13.3.2"
get_data "npmjs.com/path-is-absolute-2.0.0.html" "https://www.npmjs.com/package/path-is-absolute/v/2.0.0"

# nuget.org (NuGet)
get_data "nuget.org/Newtonsoft.Json-13.0.1.html" "https://www.nuget.org/packages/Newtonsoft.Json/13.0.1"
get_data "nuget.org/Newtonsoft.Json-13.0.3.html" "https://www.nuget.org/packages/Newtonsoft.Json/13.0.3"

# packagist.org (PHP / Composer)
get_data "packagist.org/fomvasss-laravel-its-lte-4.24.html" "https://packagist.org/packages/fomvasss/laravel-its-lte"
#get_data "packagist.org/fomvasss-laravel-its-lte-4.22.html" "https://packagist.org/packages/fomvasss/laravel-its-lte#4.22" # Doesn't respect fragment

# PyPi - BROKEN as the DOM is rendered using Javascript
#get_data "pypi.org/Django-4.2.1.html" "https://pypi.org/project/Django/4.2.1/"
#get_data "pypi.org/numpy-1.14.0.html" "https://pypi.org/project/numpy/1.14.0/"
#get_data "pypi.org/mediapipe-0.10.14.html" "https://pypi.org/project/mediapipe/0.10.14/"
#get_data "pypi.org/Twisted-19.2.0.html" "https://pypi.org/project/Twisted/19.2.0/"

# repo.maven.apache.org (Maven)

# search.maven.org (Maven)

# RubyGems
get_data "rubygems.org/chelsea-0.0.32.html" "https://rubygems.org/gems/chelsea/versions/0.0.32"
get_data "rubygems.org/chelsea-0.0.35.html" "https://rubygems.org/gems/chelsea/versions/0.0.35"
get_data "rubygems.org/logstash-input-tcp-6.0.9-java.html" "https://rubygems.org/gems/logstash-input-tcp/versions/6.0.9-java"

# search.maven.org
get_data "smo-cyclonedx-maven-plugin-2.7.6.html" "https://search.maven.org/artifact/org.cyclonedx/cyclonedx-maven-plugin/2.7.6/maven-plugin"
get_data "smo-struts2-core-2.3.30.html" "https://search.maven.org/artifact/org.apache.struts/struts2-core/2.3.30/jar"
