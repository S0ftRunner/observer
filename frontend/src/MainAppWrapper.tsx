import { RouterProvider } from "react-router/dom"
import { router } from "@/blocks"
import { ErrorBoundary } from "./blocks/ErrorBoundary";
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "theme";

const AppContent = () => {
  // сделать проверку на загрузку (если будет авторизация)

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
};

export const MainAppWrapper = () => {
  return (
    <ErrorBoundary>
      <SnackbarProvider anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}>
        <ThemeProvider>
          {/* Сюда подключить стор + тему? */}
          <AppContent />
        </ ThemeProvider>
      </SnackbarProvider>
    </ErrorBoundary>
  )
}