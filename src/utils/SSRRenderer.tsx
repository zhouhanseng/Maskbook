import ReactDOM from 'react-dom'
import React from 'react'
import { ErrorBoundary } from '../components/shared/ErrorBoundary'

export function SSRRenderer(jsx: JSX.Element, container?: HTMLElement) {
    if (typeof window === 'object') {
        if (!container) container = document.getElementById('root') ?? void 0
        if (!container) {
            container = document.createElement('div')
            document.body.appendChild(container)
        }
        const oldChildren = [...container.children]
        ReactDOM.unstable_createRoot(container).render(
            <React.StrictMode>
                <ErrorBoundary>{jsx}</ErrorBoundary>
            </React.StrictMode>,
        )
        oldChildren.forEach((x) => x.remove())
        return ''
    } else {
        async function render() {
            const Server = await import('react-dom/server')
            const { ServerStyleSheets } = await import('@material-ui/core/styles')
            const sheets = new ServerStyleSheets()
            const html = Server.renderToString(sheets.collect(jsx))
            const styles = sheets.toString()
            return `<style>${styles}</style><div id="root">${html}</div>`
        }
        return render()
    }
}
