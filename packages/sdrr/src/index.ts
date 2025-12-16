#!/usr/bin/env node

import { readFileSync } from "fs"
import { join } from "path"

import { Command } from "commander"

import { build } from "./utils/build"
import { dev } from "./utils/dev"

const program = new Command()

const path = process.platform === "win32" ? import.meta.resolve("../").replace(/^file:\/\/\//, "") : import.meta.resolve("../").replace(/^file:\/\//, "")

const packgeJson = JSON.parse(readFileSync(join(path, "package.json"), "utf-8"))

program.name("soda react router").version(packgeJson.version)

program.command("build").allowUnknownOption(true).allowExcessArguments(true).action(build)

program.command("dev").allowUnknownOption(true).allowExcessArguments(true).action(dev)

program.parse()
