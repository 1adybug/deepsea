import { vi } from "vitest"

import { build } from "../src/utils/build"
import { dev } from "../src/utils/dev"
import { runCommand, waitForChild } from "../src/utils/runCommand"

import { testCLIProcesses } from "../../../tests/cli-processes"

vi.mock("node:child_process", () => ({ spawn: vi.fn() }))
vi.mock("node:fs/promises", async importOriginal => ({ ...(await importOriginal<object>()), readdir: vi.fn(async () => []) }))
vi.mock("../src/utils/createRouter", () => ({ createRouter: vi.fn(async () => false) }))
vi.mock("../src/utils/excludeRouter", () => ({ excludeRouter: vi.fn(async () => {}) }))

testCLIProcesses({ build, dev, runCommand, waitForChild })
