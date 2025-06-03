
import { Suspense } from "react"
import NewComponent from "./components/NewComponent"

export default function NewComponentPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NewComponent />
        </Suspense>
    )
}