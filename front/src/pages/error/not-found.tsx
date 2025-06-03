import { Link } from "react-router-dom"
import { FileQuestion } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="mx-auto max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <FileQuestion className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 sm:text-3xl">Page Not Found</CardTitle>
          <CardDescription className="mt-2 text-gray-600">
            The page you are looking for doesn't exist or has been moved
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-gray-600">
          <p>Check the URL or navigate back to the homepage to find what you're looking for.</p>
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
          <Button asChild className="px-6">
            <Link to={'/'}>Return to Homepage</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
