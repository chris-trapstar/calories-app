import { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  colors,
  CircularProgress,
  CssBaseline,
  Toolbar,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import {
  BrowserRouter,
  Link,
  Routes,
  Route
} from "react-router-dom";

import axiosInstance from "./axiosInstance";
import Home from "./Home";
import Report from "./Report";
import type { IUser } from "./types";

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        light: "#63b8ff",
        main: "#0989e3",
        dark: "#005db0",
        contrastText: "#000",
      },
      secondary: {
        main: "#4db6ac",
        light: "#82e9de",
        dark: "#00867d",
        contrastText: "#000",
      },
    },
    components: {
      MuiTypography: {
        defaultProps: {
          variantMapping: {
            h1: 'h2',
            h2: 'h2',
            h3: 'h2',
            h4: 'h2',
            h5: 'h2',
            h6: 'h2',
            subtitle1: 'h2',
            subtitle2: 'h2',
            body1: 'span',
            body2: 'span',
          },
        },
      },
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {  
        const { data } = await axiosInstance.get(`/api/user`);
        setUser(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    setIsLoading(true);
    fetchUser();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {(isLoading || !user) && (
        <Box
          display="flex"
          alignItems="center"
          sx={{ width: "100vw", height: "100vh" }}
        >
          <CircularProgress disableShrink sx={{ margin: '0 auto' }} />
        </Box>
      )}
      {!isLoading && user && (
        <BrowserRouter>
          <AppBar position="fixed" >
            <Toolbar>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1 }}
              >
                <Link to="/" style={{ textDecoration: 'none', color: colors.common.white }}>
                  Calories App
                </Link>
              </Typography>
              {user.role === "admin" && (
                <Link to="/report" style={{ textDecoration: 'none', color: colors.common.white }}>
                  reports
                </Link>
              )}
            </Toolbar>
          </AppBar>

          <Box
            height="100vh"
            display="flex"
            alignItems="center"
            flexDirection="column"
            paddingTop={8}
            bgcolor={colors.green[300]}
            position="relative"
          >
            <Routes>
              <Route path="/" element={<Home isAdmin={user.role === "admin"} />} />
              {user.role === "admin" && (
                <Route path="/report" element={<Report />} />
              )}
              <Route
                path="*"
                element={
                  <main style={{ padding: "1rem" }}>
                    <p>404</p>
                  </main>
                }
              />
            </Routes>
          </Box>
        </BrowserRouter>
      )}
    </ThemeProvider>
  );
}

export default App;
