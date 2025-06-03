import { ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"

export default function AccessDenied() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="mx-auto max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <ShieldAlert className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 sm:text-3xl">Access Denied</CardTitle>
          <CardDescription className="mt-2 text-gray-600">
            You don't have permission to access this page
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-gray-600">
          <p>Please contact your administrator if you believe this is an error or return to the homepage.</p>
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
