'use client'

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import PersonPinCircleRoundedIcon from '@mui/icons-material/PersonPinCircleRounded';
import { Chip, Stack, Modal, Typography, FormControl, InputLabel, Select, Button, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

import { useState, useEffect } from "react";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Minimize';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';
import NavBar from './NavBar';
import Login from './Login';
import ImageListItem from '@mui/material/ImageListItem';
import ImageList from '@mui/material/ImageList';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Signup from './Signup';
import { useSession, getSession } from 'next-auth/react';
import { signOut } from "next-auth/react"
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import ImageListItemBar from '@mui/material/ImageListItemBar';


const theme = createTheme({});

export default function RootLayout({ children, title }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [notifs, setNotifs] = useState([]);
  let loginSection;

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const session = await getSession();
        if (!session) {
          setLoading(false); // Update loading state
          return;
        }
        const response = await fetch("/api/Notifs");
        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const notifications = await response.json();
        setNotifs(notifications.notification)
        
        
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDismiss = () => {
    setAnchorEl(null);
    setOpen(false);
    let notif = filterNotifs();
    for (let i = 0; i < notif.length; i++) {
      notif[i].dismissed = true;
      postNotifs({id: notif[i].id, dismissed: true})
    }
  };

  const postNotifs = async (data) => {
    try {
      const response = await fetch(`/api/Notifs`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Toggle favorite failed
        console.error('Failed to update notifs');
        alert('Failed to update notifs');
      }
    } catch (error) {
      console.error('Error updating post data:', error);
      alert('Error updating notifs');
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });  // Sign out the user first
  };

  const [open, setOpen] = useState(false);
  
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const filterNotifs = () => {
    if(session === undefined) {
      return [];
    }
    let filterednotifs = notifs;
    
    filterednotifs = filterednotifs.filter(notif => notif.userID === session.user.id &&
      notif.dismissed === false);
    return filterednotifs;
  };

  let notifClear = <span> No Notifications!</span>;
  if (filterNotifs().length > 0) {
    notifClear =
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
      <Button variant="outlined" color="secondary" onClick={handleDismiss}>
        Clear Notifications
      </Button>
    </Box>
  }

  if (status === 'authenticated') {
    loginSection = (
      <>
        <Button
          variant="outlined"
          color="inherit"
          onClick={handleMenuOpen}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <span>My Account</span>
          <img
            src="/images/default_pfp.webp"
            style={{
              width: '25px',
              height: '25px',
              borderRadius: '50%',
              marginLeft: '8px' // Apply border-radius to make it a circle
            }}
            alt="Profile"
          />
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}><Button href="/profile" style={{ color: 'black', textDecoration: 'none' }}>Profile</Button></MenuItem>
          <MenuItem onClick={handleMenuClose}><Button href="/favorites" style={{ color: 'black', textDecoration: 'none' }}>Favorites</Button></MenuItem>
          <MenuItem onClick={handleMenuClose}><Button href="/settings" style={{ color: 'black', textDecoration: 'none' }}>Settings</Button></MenuItem>
          <MenuItem onClick={handleMenuClose}><Button onClick={handleOpen} style={{ color: 'black', textDecoration: 'none' }}>Notifications</Button></MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); handleSignOut(); }} style={{ color: 'black' }}><Button>Sign Out</Button></MenuItem>
        </Menu>
      </>
    );
  } else {
    loginSection = <Login />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <PersonPinCircleRoundedIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                {title}
              </Typography>
              <NavBar />
              <Box sx={{ flexGrow: 0 }}>
                <Stack direction='row' spacing={2}>
                  {loginSection}
                </Stack>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
      <Box component="main" sx={{ p: 3 }}>
        {children}
      </Box>
      
      {/* Filter pop-up */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            width: 400,
            borderRadius: 2.5, // Rounded corners
          }}
        >
          {/* Filter Options */}
          <Typography variant="h6" gutterBottom>
            Notifications
          </Typography>

          {/* Close Button */}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              color: 'action.disabled',
            }}
          >
          <CloseIcon />
          </IconButton>

          <ImageList id='notifs' cols={1} gap={10} sx={{ width: 1, height: 0.5, borderRadius: '10px' }}>
            {filterNotifs().map((notif) => (
              <ImageListItem key={notif.id}>
                <ImageListItemBar
                  sx={{ backgroundColor: '#F0F0F0', borderRadius: '5px 5px 5px 5px' }}
                  title={<span style={{ padding: 5, textAlign: 'center' }}><b>{notif.title}</b></span>}
                  subtitle={<div>
                    <span style={{ textAlign: 'center', padding: 5 }}>{notif.description}</span><br />
                    <span style={{ textAlign: 'center', padding: 5 }}><b>Assigned:</b> {notif.start}</span><br />
                  </div>}
                  position="below"
                />
              </ImageListItem>
            ))}
          </ImageList>

          {notifClear}
        </Box>
      </Modal>

    </ThemeProvider>
  );
}

/* 
const notifs = notifications.notification.find(
          (notifs) => notifs.userID === session.user.id &&
          notifs.dismissed === false
        );
        
*/
/*
<ImageList id='notifs' cols={1}  sx={{ width: 1, height: 0.5, borderRadius: '10px' }}>
        

{filterServices().map((service) => (
          <ImageListItem key={service.id}>
            {service.image ? (
              <img
                src={`/images/vendor/${service.id}.png`}
                alt={service.name}
                style={{
                  width: "100%",
                  height: "250px",
                  objectFit: "fill",
                  objectPosition: "center",
                  marginBottom: "8px",
                  borderRadius: '10px'
                }}
              />
            ) : (
              <img
                src={`/images/vendor/${service.id}.png`}
                alt="Placeholder"
                style={{
                  width: "100%",
                  height: "250px",
                  objectFit: "fill",
                  objectPosition: "center",
                  marginBottom: "8px",
                  borderRadius: '10px'
                }}
              />
            )}
            <ImageListItemBar
              sx={{ backgroundColor: '#F0F0F0', borderRadius: '5px 5px 5px 5px' }}
              title={<span style={{ padding: 5, textAlign: 'center' }}><b><Link href={`/service/${service.id}`}>{service.name}</Link></b></span>}
              subtitle={<div>
                <span style={{ textAlign: 'center', padding: 5 }}><b>Type:</b> {service.type.name}</span><br />
                <span style={{ textAlign: 'center', padding: 5 }}><b>Price:</b> ${service.minPrice} - ${service.maxPrice}</span><br />
                <span style={{ padding: 5, textAlign: 'center' }}><b>Location:</b> {service.address}</span>
              </div>}
              position="below"
              actionIcon={currentUser && (
                <IconButton
                  aria-label={`favorite ${service.name}`}
                  onClick={() => toggleFavorite(currentUser.id, service)}
                  sx={{ color: currentUser.favorites.some(fav => fav.id === service.id) ? 'red' : 'black' }}
                >
                  {currentUser.favorites.some(fav => fav.id === service.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              )}
            />
          </ImageListItem>
        ))}
      </ImageList> */