import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/images/logo.svg';
import styles from '../styles/Main.module.css';
import { listItems } from '../utils/Menus';

const drawerWidth = 240;

export default function Main(props) {
  const navigate = useNavigate();

  const handleClick = (url, index) => {
    navigate(url);
  };

  return (
    <Box className={styles.mainContainer} sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        className={styles.header}
        position='fixed'
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
        }}>
        <Toolbar className={styles.contentHeader}>
          <h2 className='header2'>{props.title}</h2>
        </Toolbar>
      </AppBar>
      <Drawer
        className={styles.sideBar}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: 'none',
          },
        }}
        variant='permanent'
        anchor='left'>
        <Toolbar>
          <img
            onClick={() => navigate('/')}
            className={styles.drawerLogo}
            src={Logo}
            alt='Logo'
          />
        </Toolbar>
        <List>
          {listItems.map((item, index) => (
            <ListItem
              onClick={() => handleClick(item.url, index)}
              button
              key={index}
              className={styles.listItem}>
              {props.title.includes(item.item) ? (
                <ListItemIcon>
                  <img
                    style={{
                      filter:
                        'invert(49%) sepia(35%) saturate(6495%) hue-rotate(220deg) brightness(99%) contrast(93%)',
                    }}
                    src={item.icon}
                    alt='Menu Icon'
                  />
                </ListItemIcon>
              ) : (
                <ListItemIcon>
                  <img src={item.icon} alt='Menu Icon' />
                </ListItemIcon>
              )}
              {props.title.includes(item.item) ? (
                <ListItemText primary={item.item} sx={{ color: '#6A6EF4' }} />
              ) : (
                <ListItemText primary={item.item} />
              )}
            </ListItem>
          ))}
        </List>
        <Button
          onClick={() => navigate('/')}
          variant='contained'
          size='medium'
          className='backHomeButton'
          startIcon={<ArrowBackIcon />}>
          Back to Home
        </Button>
      </Drawer>
      <Box
        className={styles.body}
        component='main'
        sx={{ flexGrow: 1, bgColor: 'background.default', p: 3 }}>
        <Toolbar />
        {props.children}
      </Box>
    </Box>
  );
}
