import { Box, styled } from "@mui/material"
import { Outlet } from "react-router"
import { Background } from "./components"
import { Header } from "./blocks"

function App () {
  const MainWrapper = styled(Box)`
    display: flex;
    min-height: 100vh;
    height: 100vh;
    width: 100vw;

    overflow-x: hidden;
    overflow-y: scroll;
  `
  return (
    <MainWrapper>
      <Background />
      <Header />
      <Outlet />
    </MainWrapper>
  )
}

export default App;