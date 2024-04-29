'use client'

import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import Signup from './Signup';

import { signIn } from 'next-auth/react';

export default function Login() {

  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [error, setError] = useState(false);

  function handleLoginButton() {
    setOpen(true);
  }

  function handleClose() {
    reset();
    setOpen(false);
  }

  function reset() {
    setError(false);
    setFormValues({ email: '', password: '' });
  }

  function handleSignin() {
    signIn("normal", {...formValues, redirect: false}).then((result) => {
      if (!result.error) {
        setOpen(false);
        reset();
      } else {
        setError(true);
      }
    })
  }
  
  function handleChange({ field, value }) {
    setFormValues({ ...formValues, [field]: value });
  }

  return (
    <>
      <Button
        variant="outlined"
        color="inherit"
        onClick={handleLoginButton}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <span>Login / Sign-Up</span>
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
      {open && <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To login, please enter your email address and password.
          </DialogContentText>
          {error ? (
            <Alert severity="error">There was an issue signing in! Check email and password.</Alert>
          ) : null}
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            value={formValues.email}
            onChange={(e) => handleChange({ field: 'email', value: e.target.value })}
            variant="standard"
          />
          <TextField
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            value={formValues.password}
            onChange={(e) => handleChange({ field: 'password', value: e.target.value })}
            variant='standard' />
        </DialogContent>
        <DialogContent>
          No account? <Signup />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => handleSignin()}>Login</Button>
        </DialogActions>
      </Dialog>}
    </>
  );
}