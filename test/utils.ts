export function test(html) {
	const template = document.createElement('template')
	template.innerHTML = html

	return (spec) => () => {
		const wrapper = document.createElement('div')
		document.body.appendChild(wrapper)
		wrapper.appendChild(template.content.cloneNode(true))
		const result = spec(wrapper.children[0])

		if(result) {
			return Promise.resolve(result).then(() => {
				requestAnimationFrame(() => {
					document.body.removeChild(wrapper)
				})
			})
		} else {
			return new Promise<void>((res) => {
				requestAnimationFrame(() => {
					document.body.removeChild(wrapper)
					res()
				})
			})
		}
	}
}
