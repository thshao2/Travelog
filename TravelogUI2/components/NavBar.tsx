import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
// import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
// import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useNavigation } from "@react-navigation/native";
import { removeToken } from "../app/utils/util";
import { useLoginContext } from "@/app/context/LoginContext";
import LogoutIcon from "@mui/icons-material/Logout";

const pages = ["map", "saved", "profile"];
const settings = ["Logout"];

function NavBar() {
  const navigation = useNavigation();
  const loginContext = useLoginContext();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logout = async () => {
    await removeToken();
    loginContext.setEmail("");
    loginContext.setAccessToken("");
    navigation.navigate("login");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#4E5BA6" }}>
      <Container maxWidth="xxl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} onClick={() => navigation.navigate("index")} />
          
          {/* Wrapping Typography in Button for proper click handling */}
          <Button
            onClick={() => navigation.navigate("index")}
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

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
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
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => {
                  handleCloseNavMenu();
                  navigation.navigate(page);
                }}>
                  <Typography sx={{ textAlign: "center" }}>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} onClick={() => navigation.navigate("index")} />
          
          {/* Wrapping Typography in Button for proper click handling (mobile view) */}
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
            }}
          >
            TRAVELOG
          </Button>
          
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex", marginLeft: 80 } }}>
            {pages.map((page) => (
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
                  marginLeft: 10,
                  fontSize: "1.2rem",
                }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            {/* <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >

              <MenuItem key={"Logout"} onClick={handleCloseUserMenu}>
                <Button
                  sx={{
                    textAlign: "center",
                    width: "100%",
                    color: "inherit", // Inherit color to match the app"s theme
                    justifyContent: "center", // Centers the text inside the button
                    textTransform: "none", // Prevents text from being uppercased automatically
                  }}
                  onClick={logout}
                >
                  Logout
                </Button>
              </MenuItem>
            </Menu> */}
            <IconButton
              onClick={logout}
              sx={{
                position: "absolute", // Position it absolutely to the right
                right: 16, // Adjust the value as needed for padding
                top: "50%", // Center vertically
                transform: "translateY(-50%)", // Adjust the vertical alignment
                color: "inherit", // Inherit color to match the theme
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default NavBar;
