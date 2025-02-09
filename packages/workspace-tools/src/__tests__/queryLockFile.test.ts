import { setupFixture } from "workspace-tools-scripts/jest/setupFixture";
import { parseLockFile, queryLockFile, ParsedLock } from "..";

/**
 * These tests rely on the "@microsoft/task-scheduler" package as defined in package.json in fixtures:
 * - monorepo-npm
 * - basic-yarn
 * - monorepo-pnpm
 *
 * If making any changes to those fixtures, update the `packageName` constant.
 */

const packageName = "@microsoft/task-scheduler";
const getPackageVersion = (parsedLockFile: ParsedLock) => {
  const packageSpec = Object.keys(parsedLockFile.object).find((spec) => spec.startsWith(`${packageName}@`));
  expect(packageSpec).toBeTruthy();
  return parsedLockFile.object[packageSpec!].version;
};

describe("queryLockFile()", () => {
  // NPM
  it("retrieves a dependency from a lock generated by npm", async () => {
    const packageRoot = setupFixture("monorepo-npm");
    const parsedLockFile = await parseLockFile(packageRoot);
    const packageVersion = getPackageVersion(parsedLockFile)!;

    const result = queryLockFile(packageName, packageVersion, parsedLockFile);
    expect(result).toBeDefined();
    expect(result.version).toBe(packageVersion);
  });

  // Yarn
  it("retrieves a dependency from a lock generated by yarn", async () => {
    const packageRoot = setupFixture("basic-yarn");
    const parsedLockFile = await parseLockFile(packageRoot);
    const packageVersion = getPackageVersion(parsedLockFile)!;

    // NOTE: Yarn’s locks include ranges.
    const result = queryLockFile(packageName, `^${packageVersion}`, parsedLockFile);
    expect(result).toBeDefined();
    expect(result.version).toBe(packageVersion);
  });

  // PNPM
  it("retrieves a dependency from a lock generated by pnpm", async () => {
    const packageRoot = setupFixture("monorepo-pnpm");
    const parsedLockFile = await parseLockFile(packageRoot);
    const packageVersion = getPackageVersion(parsedLockFile)!;

    const result = queryLockFile(packageName, packageVersion, parsedLockFile);
    expect(result).toBeDefined();
    expect(result.version).toBe(packageVersion);
  });
});
