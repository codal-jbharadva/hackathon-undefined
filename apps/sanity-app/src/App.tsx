import { type SanityConfig } from '@sanity/sdk'
import { SanityApp } from '@sanity/sdk-react'
import { ExampleComponent } from './ExampleComponent'
import './App.css'

const config: SanityConfig[] = [
    {
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: 'production',
    },
]

export default function App() {
    return (
        <SanityApp config={config} fallback={<div>Loading…</div>}>
            <ExampleComponent />
        </SanityApp>
    )
}
