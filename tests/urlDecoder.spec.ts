import { decodeUrl } from '../src/urlDecoder'

describe('urlDecoder', () => {
	it('should resolve paths', () => {
		const sshUrl = decodeUrl('git@github.com:asmadsen/cli-utils.git')
		expect(sshUrl).toHaveProperty('path', 'github.com/asmadsen')
		expect(sshUrl).toHaveProperty('projectName', 'cli-utils')

		const httpUrl = decodeUrl('https://github.com/asmadsen/cli-utils.git')
		expect(httpUrl).toHaveProperty('path', 'github.com/asmadsen')
		expect(httpUrl).toHaveProperty('projectName', 'cli-utils')

		const subProjectUrl = decodeUrl('https://gitlab.com/asmadsen/subproject/cli-utils.git')
		expect(subProjectUrl).toHaveProperty('path', 'gitlab.com/asmadsen/subproject')
		expect(subProjectUrl).toHaveProperty('projectName', 'cli-utils')
	})
})