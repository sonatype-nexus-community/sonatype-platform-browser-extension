---
title: Details for Hugging Face support
layout: default
# menus:
#   main
#     title: Details for Hugging Face support
#     weight: 10
toc: true
---

[&lt; Back]({{ 'supported-registries.html' | relative_url }})

Hugging Face supports multiple formats, and often a repository contains models in various formats.

For that reason, you can expect to see multiple Components identified for a single repository on Hugging Face.

To trigger this Extension, be sure to be on the **`Files and versions`** section of the repository.

Sonatype details the support for [Hugging Face Model Analysis here](https://help.sonatype.com/en/hugging-face-model-analysis.html){:target="_blank"}.

This Extension has the following supoprt for identifying Models:

| Format                   | File Extension             | Supported Since Extension Version |
| ------------------------ | -------------------------- | --------------------------------- |
| Pytorch                  | `.bin, .pt, .pth, .pickle` | ✅ `3.0.0`                        |
| Safetensors              | `.safetensors`             | ✅ `3.0.0`                        |
| Tensorflow               | `.h5`                      | ✅ `3.0.0`                        |
| OpenVino                 | `.bin`                     | ✅ `3.0.0`                        |
| MLC-LLM                  | `.bin`                     | ✅ `3.0.0`                        |
| GGUF                     | `.gguf`                    | ✅ `3.0.0`                        |
| Rust                     | `.ot`                      | ✅ `3.0.0`                        |
| Transformers Pytorch     | `.bin.index.json`          | ✅ `3.0.0`                        |
| Transformers Safetensors | `.safetensors.index.json`  | ✅ `3.0.0`                        |
| ONNX                     | `.onnx`                    | ✅ `3.0.0`                        |
| Flax/Jax                 | `.msgpack`                 | ✅ `3.0.0`                        |

Formats not listed as supported in the above table will be addressed where possible on an demand-basis.