#!/usr/bin/env node

import { readFile } from "fs/promises"
import { join } from "path"
import { fileURLToPath } from "url"

import { Command } from "commander"

import { build } from "./utils/build"
import { dev } from "./utils/dev"
import { hook } from "./utils/hook"

const program = new Command()

const path = fileURLToPath(new URL("../", import.meta.url))

const packageJson = JSON.parse(await readFile(join(path, "package.json"), "utf-8"))

program.name("soda next").version(packageJson.version)

program.command("build").allowUnknownOption(true).allowExcessArguments(true).action(build)

program.command("dev").allowUnknownOption(true).allowExcessArguments(true).action(dev)

program.command("hook").action(hook)

program.parse()
