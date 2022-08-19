import { join } from 'path'
import parse from 'url-parse-lax'

export type RepoInfo = {
	path: string
	projectName: string
}

export const decodeUrl = (url: string): RepoInfo => {
	const urlObj = parse(url)

	const pathParts = urlObj.pathname.slice(1).split('/')
	if (pathParts[0]) {
		pathParts[0] = pathParts[0].replace(/^:/, '')
	}

	const projectName = pathParts.pop().replace(/\.git$/, '')

	const path = join(urlObj.hostname, ...pathParts)

	return {
		path,
		projectName
	}
}