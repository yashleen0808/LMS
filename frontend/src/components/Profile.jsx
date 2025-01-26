import React, { useState, useContext, useEffect } from "react";
import {
  Avatar,
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { token, logout } = useContext(AppContext);
  const [profile, setProfile] = useState({
    name: "",
    role: "",
    username: "",
    phone: "",
    email: "",
    profile_pic: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put("http://127.0.0.1:5000/api/user/me", profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditMode(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Error updating profile";
      console.error(error);
      toast.error(errorMessage);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete("http://127.0.0.1:5000/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      logout();
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Error deleting account";
      console.error(error);
      toast.error(errorMessage);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDeleteConfirm = () => {
    handleDelete();
    handleCloseDialog();
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Avatar
            alt={profile.name}
            src={`http://127.0.0.1:5000/public/${profile.profile_pic}`}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          <Typography variant="h5" fontWeight="bold">
            {profile.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {profile.role}
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Username"
              name="username"
              value={profile.username}
              onChange={handleInputChange}
              fullWidth
              disabled={!editMode}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone"
              name="phone"
              value={profile.phone}
              onChange={handleInputChange}
              fullWidth
              disabled={!editMode}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              fullWidth
              disabled={!editMode}
            />
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          {editMode ? (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdate}
                sx={{ mr: 1 }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              {/* <Button
                variant="contained"
                color="primary"
                onClick={() => setEditMode(true)}
                sx={{ mr: 1 }}
              >
                Edit
              </Button> */}
              <Button variant="outlined" color="error" onClick={handleOpenDialog}>
                Delete Account
              </Button>
            </>
          )}
        </Box>
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete your account?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} color="error" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
