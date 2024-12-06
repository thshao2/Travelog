import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useNavigation } from "@react-navigation/native";
import { removeToken } from "@/app/utils/util";
import { useLoginContext } from "@/app/context/LoginContext";
import LogoutIcon from "@mui/icons-material/Logout";

const pages: (keyof ReactNavigation.RootParamList)[] = ["map", "saved", "explore", "profile"];

function NavBar() {
  const navigation = useNavigation();
  const loginContext = useLoginContext();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const logout = async () => {
    await removeToken();
    loginContext.setEmail("");
    loginContext.setAccessToken("");
    navigation.navigate("login");
  };

  const navigateToHome = async () => {
    navigation.navigate("index");
  };

  return (
    <AppBar position="static" sx={{
      backgroundColor: "#4361ee",
      color: "#FFFFFF",
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* App icon & name */}
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
            onClick={() => navigateToHome()}
          />
          <Button
            onClick={() => navigateToHome()}
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 900,
              fontSize: 25,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Travelog
          </Button>

          {/* Mobile Nav Bar - When user is logged in */}
          {loginContext.accessToken && <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Button
              onClick={() => navigation.navigate("index")}
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} onClick={() => navigation.navigate("index")} />
              TRAVELOG
            </Button>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page: any) => (
                <MenuItem key={page} onClick={() => {
                  handleCloseNavMenu();
                  navigation.navigate(page);
                }}>
                  <Typography sx={{ textAlign: "center", textTransform: "capitalize" }}>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>}

          {/* Desktop version - show all buttons if user is logged in */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex", position: "absolute", right: loginContext.accessToken ? 120 : 0 } }}>
            {loginContext.accessToken && pages.map((page: any) => (
              <Button
                key={page}
                onClick={() => {
                  handleCloseNavMenu();
                  navigation.navigate(page);
                }}
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  marginLeft: 6,
                  fontSize: "1.2rem",
                  "&:hover": {
                    backgroundColor: "#4895ef",
                  },
                }}
              >
                {page}
              </Button>
            ))}
            {/* Login Button if User has not logged in */}
            {!loginContext.accessToken &&
              <Button
                key="login"
                onClick={() => {
                  handleCloseNavMenu();
                  navigation.navigate("login");
                }}
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  marginLeft: 6,
                  fontSize: "1.2rem",
                  border: "2px solid white",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px", 
                  "&:hover": {
                    backgroundColor: "#4895ef",
                  },
                }}
              >
                Log In
              </Button>
            }
          </Box>
          {/* Log out button - only display if user is logged in */}
          <Box sx={{ flexGrow: 0 }}>
            {loginContext.accessToken && <IconButton
              onClick={logout}
              sx={{
                position: "absolute",
                right: 16, 
                top: "50%", 
                transform: "translateY(-50%)",
                color: "inherit",
                "&:hover": {
                  backgroundColor: "#4895ef",
                },
              }}
            >
              <LogoutIcon />
            </IconButton>}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default NavBar;
