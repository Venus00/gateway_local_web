import { Link } from "react-router-dom"
import { Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Forbidden() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="mx-auto max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <Lock className="h-8 w-8 text-amber-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 sm:text-3xl">Forbidden</CardTitle>
          <CardDescription className="mt-2 text-gray-600">
            You don't have sufficient permissions to access this resource
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-gray-600">
          <p>
            If you believe you should have access to this page, please contact your administrator or try logging in with
            a different account.
          </p>
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
