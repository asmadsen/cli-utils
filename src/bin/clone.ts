#!/usr/bin/env node
import { mkdir, access } from 'fs/promises'
import { resolve, join } from 'path'
import os from 'os'
import minimist from 'minimist'
import Confirm from 'prompt-confirm'
import SimpleGit from 'simple-git'
import { decodeUrl } from '../urlDecoder'

const args = minimist(process.argv.slice(2))

const url = args['_']?.[0]

if (!url) {
	console.error('Missing url argument')
	process.exit(1)
}

const srcDir = args['base'] ?? resolve(os.homedir(), 'src')

const decodedUrl = decodeUrl(url)

const projectName = args['_']?.[1] ?? decodedUrl.projectName

const clone = async () => {
	const baseDir = join(srcDir, decodedUrl.path)
	try {
		await access(baseDir)
	} catch (e) {
		await mkdir(baseDir, { recursive: true})
	}

	const repoPath = join(srcDir, decodedUrl.path, projectName)

	try {
		await access(repoPath)
		console.error(`Destination path '${repoPath}' already exists and is not an empty directory`)
	} catch (e) {
		const git = SimpleGit(baseDir)
			.outputHandler((command, stdout, stderr) => {
				stdout.pipe(process.stdout);
				stderr.pipe(process.stderr);
			})
		await git.clone(url, projectName)
		console.log(`Cloned into: ${repoPath}`)
	}
}

if (args['i']) {
	const prompt = new Confirm(`Do you want to clone into "${join(srcDir, decodedUrl.path, projectName)}"`)
	prompt.run()
		.then(result => {
			if (result) {
				clone()
			}
		})
} else {
	clone()
}