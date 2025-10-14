import { RouterProvider } from "react-router/dom"
import { router } from "@/blocks"

const AppContent = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}