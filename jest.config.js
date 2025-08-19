import { createDefaultPreset } from "ts-jest"

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export const testEnvironment = "jsdom"
export const transform = {
  ...tsJestTransformCfg,
}