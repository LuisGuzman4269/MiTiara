'use client'

import { useState, useEffect } from 'react';
import { Box, TextField, Grid, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from "@mui/material";
import { getSession } from "next-auth/react";
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import { Clear } from "@mui/icons-material";


export default function Favorites() {

    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const types = [null, 'Venue', 'Entertainment', 'Catering', 'Production', 'Decoration']

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const session = await getSession();
            if (!session) {
                setLoading(false); // Update loading state
                return;
            }

            try {
                const response = await fetch("/api/users");
                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }
                const data = await response.json();
                const user = data.users.find(
                    (user) => user.email === session.user.email
                );
                setCurrentUser(user);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false); // Update loading state after fetching user
            }
        };

        fetchCurrentUser();
    }, []);

    function confirmRemove(userId, service) {
        if (confirm("Are you sure you want to remove this from your favorites?")) {
            removeFavorite(userId, service);
        }
    }

    const removeFavorite = async (userId, service) => {
        try {
            const updateFavoriteData = { id: userId, favorites: [service] };
            try {
                const response = await fetch(`/api/users`, {
                    method: 'POST',
                    body: JSON.stringify(updateFavoriteData),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    // Toggle favorite successful
                    const newFavorites = currentUser.favorites.some(fav => fav.id === service.id)
                        ? currentUser.favorites.filter(fav => fav.id !== service.id)
                        : [...currentUser.favorites, service];
                    const updatedUser = { ...currentUser, favorites: newFavorites };
                    setCurrentUser(updatedUser);
                } else {
                    // Toggle favorite failed
                    console.error('Failed to toggle favorite');
                    alert('Failed to toggle favorite');
                }
            } catch (error) {
                console.error('Error toggling favorite:', error);
                alert('Error toggling favorite');
            }
        } catch (error) {
            console.error('Error preparing favorite data:', error);
            alert('Error preparing favorite data');
        }
    };

    // Loading page...
    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <h2 style={{ fontFamily: 'Verdana, sans-serif' }}>My Favorites</h2>
            <Grid container spacing={3} sx={{ maxWidth: "1400px", margin: "0" }}>
                {currentUser.favorites.map((service, index) => (
                    <Grid item xs="auto" sm="auto" md={3} key={index}>
                        <Box
                            sx={{
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                padding: "16px",
                                position: "relative",
                                cursor: "pointer",
                            }}
                        >
                            <IconButton aria-label="delete" color="warning"
                                sx={{
                                    position: "absolute",
                                    top: "8px", // Adjust this value for vertical positioning
                                    right: "8px", // Adjust this value for horizontal positioning
                                }}
                                onClick={() => confirmRemove(currentUser.id, service)}>
                                <ClearIcon></ClearIcon>
                            </IconButton>
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
                                    src="/images/placeholder.png"
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
                            <Typography variant="subtitle1" gutterBottom>
                                Name: {service.name}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                Type: {types[service.typeID]}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                Min Price: {service.minPrice}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                Max Price: {service.maxPrice}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                Address: {service.address}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}