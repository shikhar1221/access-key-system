const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('../tsconfig.json');

module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  testRegex: "test/.*\\.e2e-spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": ["ts-jest", {"tsconfig": "./tsconfig.json"}]
  },
  rootDir: "..",
  testEnvironment: "node",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '../' })
};