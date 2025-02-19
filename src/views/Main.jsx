import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import useWindowSize from "../hooks/useWindowSize";
import styles from "../styles/Main.module.css";
import { listItems } from "../utils/Menus";

import { AiOutlineMenuUnfold } from "react-icons/ai";

const drawerWidth = 240;

export default function Main(props) {
  const navigate = useNavigate();
  const { width } = useWindowSize();

  const [state, setState] = React.useState({
    left: false,
    size: false,
  });

  React.useEffect(() => {
    if (width < 1200) {
      setState({
        left: false,
        size: true,
      });
    } else {
      setState({
        left: false,
        size: false,
      });
    }
  }, [width]);

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {listItems.map((item, index) => (
          <ListItem button key={index} className={styles.listItem}>
            {props.title.includes(item.item) ? (
              <ListItemIcon>
                <img
                  style={{
                    filter:
                      "invert(49%) sepia(35%) saturate(6495%) hue-rotate(220deg) brightness(99%) contrast(93%)",
                  }}
                  src={item.icon}
                  alt="Menu Icon"
                />
              </ListItemIcon>
            ) : (
              <ListItemIcon>
                <img src={item.icon} alt="Menu Icon" />
              </ListItemIcon>
            )}
            {props.title.includes(item.item) ? (
              <ListItemText primary={item.item} sx={{ color: "#6A6EF4" }} />
            ) : (
              <ListItemText primary={item.item} />
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box className={styles.mainContainer} sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        className={styles.header}
        position="fixed"
        sx={{
          width: state.size ? "100%" : `calc(100% - ${drawerWidth}px)`,
          ml: state.size ? 0 : `${drawerWidth}px`,
        }}
      >
        <Toolbar className={styles.contentHeader}>
          <div>
            {["left"].map((anchor) => (
              <React.Fragment key={anchor}>
                {state.size && (
                  <Button onClick={toggleDrawer(anchor, true)} size="large">
                    {state.left ? (
                      <AiOutlineMenuUnfold
                        fontSize="30px"
                        style={{ color: "#000" }}
                      />
                    ) : (
                      <AiOutlineMenuUnfold
                        fontSize="30px"
                        style={{ color: "#000" }}
                      />
                    )}
                  </Button>
                )}

                <Drawer
                  anchor={anchor}
                  open={state[anchor]}
                  onClose={toggleDrawer(anchor, false)}
                >
                  {list(anchor)}
                </Drawer>
              </React.Fragment>
            ))}
          </div>

          <h2 className="header2">{props.title}</h2>
        </Toolbar>
      </AppBar>

      {!state.size && (
        <Drawer
          className={styles.sideBar}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: "none",
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar
            sx={{
              position: "sticky",
              top: 0,
              backgroundColor: "#fff",
              zIndex: 999,
            }}
          ></Toolbar>
          <List>
            {listItems.map((item, index) => (
              <ListItem button key={index} className={styles.listItem}>
                {props.title.includes(item.item) ? (
                  <ListItemIcon>
                    <img
                      style={{
                        filter:
                          "invert(49%) sepia(35%) saturate(6495%) hue-rotate(220deg) brightness(99%) contrast(93%)",
                      }}
                      src={item.icon}
                      alt="Menu Icon"
                    />
                  </ListItemIcon>
                ) : (
                  <ListItemIcon>
                    <img src={item.icon} alt="Menu Icon" />
                  </ListItemIcon>
                )}
                {props.title.includes(item.item) ? (
                  <ListItemText primary={item.item} sx={{ color: "#6A6EF4" }} />
                ) : (
                  <ListItemText primary={item.item} />
                )}
              </ListItem>
            ))}
          </List>

          <Button
            onClick={() => navigate("/")}
            variant="contained"
            size="medium"
            className="backHomeButton"
            startIcon={<ArrowBackIcon />}
            sx={{
              position: "sticky",
              bottom: "0",
            }}
          >
            Back to Home
          </Button>
        </Drawer>
      )}

      <Box
        className={styles.body}
        component="main"
        sx={{ flexGrow: 1, bgColor: "background.default", p: { xs: 1, md: 3 } }}
      >
        <Toolbar />
        {props.children}
      </Box>
    </Box>
  );
}
