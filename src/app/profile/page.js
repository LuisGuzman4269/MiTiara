"use client";

import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import {
  Box,
  TextField,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from "@mui/material";

import { Block, ConstructionOutlined } from "@mui/icons-material";

import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import { Clear } from "@mui/icons-material";


export default function Profile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceMinPrice, setServiceMinPrice] = useState("");
  const [serviceMaxPrice, setServiceMaxPrice] = useState("");
  const [serviceAddress, setServiceAddress] = useState("");
  const [services, setServices] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [serviceTypeID, setServiceTypeID] = useState(1);

  const [bookings, setBookings] = useState([]);
  const types = [
    null,
    "Venue",
    "Entertainment",
    "Catering",
    "Production",
    "Decoration",
  ];

  const [editServiceData, setEditServiceData] = useState({
    name: "",
    description: "",
    minPrice: "",
    maxPrice: "",
    address: "",
  });
  const [openEditDialog, setOpenEditDialog] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const session = await getSession();
        if (!session) {
          setLoading(false); // Update loading state
          return;
        }
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const dataUser = await response.json();
        const user = dataUser.users.find(
          (dataUser) => dataUser.email === session.user.email
        );
        setCurrentUser(user);
        if (user && user.role != "VENDOR") {
          const responseBookings = await fetch("/api/bookings");
          if (!responseBookings.ok) {
            throw new Error("Failed to fetch bookings");
          }

          const bookingData = await responseBookings.json();
          const allBookings = bookingData.bookings.filter(
            (booking) => user.id === booking.customerID
          );
          setBookings(allBookings || []);
          const responseServices = await fetch("/api/servicesProfile");
          if (!responseServices.ok) {
            throw new Error("Failed to fetch services");
          }

          const serviceData = await responseServices.json();
          const bookedServices = serviceData.services.filter((service) =>
            allBookings.some((booking) => booking.serviceID === service.id)
          );
          setServices(bookedServices || []);
        }
        if (user && user.role === "VENDOR") {
          const dbServicesResp = await fetch("/api/servicesProfile");
          if (!dbServicesResp.ok) {
            throw new Error("Failed to fetch services");
          }
          const serviceData = await dbServicesResp.json();
          const vendorServices = serviceData.services.filter(
            (service) => service.vendorID === user.id
          );
          setServices(vendorServices || []);
          const bookingResp = await fetch("/api/bookings");
          if (!bookingResp.ok) {
            throw new Error("Failed to fetch bookings");
          }
          const bookingData = await bookingResp.json();
          const allBookings = bookingData.bookings.filter(
            // need to check if each booking is associated with any of our services...
            (booking) =>
              vendorServices.some((service) => service.id === booking.serviceID)
          );
          setBookings(allBookings || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Loading page...
  if (loading) {
    return <p>Loading...</p>;
  }

  function handleOpenDialog() {
    setOpenDialog(true);
  }

  function handleCloseDialog() {
    setOpenDialog(false);
  }

  function confirmDelete(serviceID) {
    if (confirm('Are you sure you want to delete this service?')) {
      deleteService(serviceID);
    }

  }

  function validateServiceData(service) {
    const errors = {};

    if (!service.name || service.name.length > 30) {
      errors.name = "Service name must be between 1 and 30 characters";
    }

    if (!service.description || service.description.length > 2000) {
      errors.description = "Description must be between 1 and 2000 characters";
    }

    if (!service.minPrice || isNaN(service.minPrice) || service.minPrice < 0 || service.minPrice > 1000000) {
      errors.minPrice = "Minimum price must be a number between 0 and 1000000";
    }

    if (!service.maxPrice || isNaN(service.maxPrice) || service.maxPrice < 0 || service.maxPrice > 1000000) {
      errors.maxPrice = "Maximum price must be a number between 0 and 1000000";
    }

    if (service.minPrice >= service.maxPrice) {
      errors.maxPrice = "Maximum price must be greater than minimum price";
    }

    if (!service.address || service.address.length > 100) {
      errors.address = "Address must be between 1 and 100 characters";
    }
    if (service.address.split(',').length < 2) {
      errors.address = 'Please input a valid address: 123 Something Ave, City, State ZipCode';
    }

    return errors;
  }

  const handleShowErrorDialog = (errors) => {
    let message = "";
    for (const key in errors) {
      message += `${errors[key]}\n`;
    }
    alert(message);
  };

  const deleteService = async (serviceId) => {
    try {
      setServices((prevServices) =>
        prevServices.filter((service) => service.id !== serviceId)
      );

      // Send a request to delete the service from the server
      const response = await fetch(`/api/servicesProfile`, {
        method: "DELETE",
        body: JSON.stringify({ id: serviceId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete service");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      fetchData(); // Refetch the data to revert UI state
    }
  };

  // Function to add service for vendors
  async function handleAddService() {
    if (
      !serviceName ||
      !serviceDescription ||
      !serviceMinPrice ||
      !serviceMaxPrice ||
      !serviceAddress ||
      !selectedFile
    ) {
      setError(true);
      alert("Image required");
      return;
    }

    setError(false);

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = async function () {
      const base64data = reader.result.split(",")[1];

      const newService = {
        name: serviceName,
        description: serviceDescription,
        minPrice: Number(serviceMinPrice),
        maxPrice: Number(serviceMaxPrice),
        address: serviceAddress,
        typeID: Number(serviceTypeID),
        vendorID: Number(currentUser.id),
        image: {
          data: base64data,
        },
      };

      const errors = validateServiceData(newService);

      if (Object.keys(errors).length > 0) {
        handleShowErrorDialog(errors);
        return;
      }

      try {
        const response = await fetch("/api/servicesProfile", {
          method: "POST",
          body: JSON.stringify(newService),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to add service");
        }
        const responseData = await response.json();
        if (responseData.hasOwnProperty("service")) {
          responseData.service.image = `/images/vendor/${responseData.service.id}.png`;
          setServices((prevServices) => [
            ...prevServices,
            responseData.service,
          ]);
        } else {
          console.error("Unexpected response format:", responseData);
        }
      } catch (error) {
        console.error(error);
      }

      setOpenDialog(false);
    };
  }


  const handleEditService = (service) => {
    // Set the edit service data with the details of the service to be edited
    setEditServiceData({
      id: service.id,
      name: service.name,
      description: service.description,
      minPrice: service.minPrice.toString(),
      maxPrice: service.maxPrice.toString(),
      address: service.address,
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleUpdateService = async () => {
    try {
      const updatedService = {
        id: editServiceData.id,
        name: editServiceData.name,
        description: editServiceData.description,
        minPrice: Number(editServiceData.minPrice),
        maxPrice: Number(editServiceData.maxPrice),
        address: editServiceData.address,
      };

      const errors = validateServiceData(updatedService);

      if (Object.keys(errors).length > 0) {
        handleShowErrorDialog(errors);
        return;
      }

      setErrorMessages({});

      const response = await fetch(`/api/servicesProfile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedService),
      });

      if (!response.ok) {
        throw new Error("Failed to update service");
      }

      const responseData = await response.json();

      setServices(prevServices =>
        prevServices.map(service =>
          service.id === responseData.service.id ? responseData.service : service
        )
      );

      setOpenEditDialog(false);
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };



  const handleReject = async (booking) => {
    try {
      const data = { id: booking.id, status: false, hasBeenConfirmed: true };

      // Update the status of the booking
      const updatedBooking = { ...booking, status: "rejected" };

      // Send a request to update the booking status
      const response = await fetch(`/api/bookings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update booking status");
      }
      const updatedBookings = bookings.map((b) =>
        b.id === booking.id
          ? { ...b, status: false, hasBeenConfirmed: true }
          : b
      );
      setBookings(updatedBookings);

      // Perform additional logic if needed
    } catch (error) {
      console.error("Error rejecting booking:", error);
    }
  };

  const handleAccept = async (booking) => {
    try {
      const data = { id: booking.id, status: true, hasBeenConfirmed: true };
      const updatedBooking = { ...booking, status: "accepted" };

      // Send a request to update the booking status
      const response = await fetch(`/api/bookings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update booking status");
      }
      const updatedBookings = bookings.map((b) =>
        b.id === booking.id ? { ...b, status: true, hasBeenConfirmed: true } : b
      );
      setBookings(updatedBookings);
      // Perform additional logic if needed
    } catch (error) {
      console.error("Error accepting booking:", error);
    }
  };

  // Function to format dateTime objects
  function formatDate(dateString) {
    const date = new Date(dateString);

    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    return new Intl.DateTimeFormat("en-US", options).format(date);
  }
  return (
    <>
      {currentUser && (
        <>
          {currentUser.role === "CUSTOMER" && (
            <>
              <h1>My Profile (Customer)</h1>
              <h2>Bookings</h2>
              {bookings &&
                bookings.map((booking, index) => (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      padding: "16px",
                    }}
                    key={index}
                  >
                    <div
                      style={{
                        display: "inline-block",
                        border: "1px solid black",
                        borderRadius: "8px",
                        padding: "16px",
                        backgroundColor: "gray",
                        color: "white", // You can adjust the text color based on your preference
                      }}
                      className="booking"
                      key={index}
                    >
                      <h3>{`Service Name: ${services.find((s) => s.id === booking.serviceID)?.name
                        }`}</h3>
                      <p>{`Start Date: ${formatDate(booking.start)}`}</p>
                      <p>{`End Date: ${formatDate(booking.end)}`}</p>
                      <p>{`Proposed Price: ${booking.price}`}</p>
                      <p>{`Status: ${booking.hasBeenConfirmed === false
                        ? "Pending"
                        : booking.status
                          ? "Accepted"
                          : "Rejected"
                        }`}</p>
                    </div>
                  </div>
                ))}
            </>
          )}
          {currentUser.role === "VENDOR" && (
            <>
              <h1>My Profile (Vendor)</h1>
              <h2>My Services</h2>
              <Grid
                container
                spacing={3}
                sx={{ maxWidth: "1400px", margin: "0" }}
              >
                {services &&
                  services.map((service, index) => (
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
                              borderRadius: "10px",
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
                              borderRadius: "10px",
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
                        {/* Edit button */}
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{
                            position: "absolute",
                            bottom: "8px", // Adjust this value for vertical positioning
                            right: "8px", // Adjust this value for horizontal positioning
                          }}
                          onClick={() => handleEditService(service)} // Pass the service data to the edit function
                        >
                          Edit
                        </Button>
                        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
                          <DialogTitle>Edit Service</DialogTitle>
                          <DialogContent>
                            <TextField
                              label="Service Name"
                              value={editServiceData.name}
                              onChange={(e) => setEditServiceData({ ...editServiceData, name: e.target.value })}
                              fullWidth
                              margin="normal"
                            />
                            <TextField
                              label="Description"
                              value={editServiceData.description}
                              onChange={(e) => setEditServiceData({ ...editServiceData, description: e.target.value })}
                              fullWidth
                              margin="normal"
                              multiline
                              rows={4}
                            />
                            <TextField
                              label="Minimum Price"
                              value={editServiceData.minPrice}
                              onChange={(e) => setEditServiceData({ ...editServiceData, minPrice: e.target.value })}
                              fullWidth
                              margin="normal"
                            />
                            <TextField
                              label="Maximum Price"
                              value={editServiceData.maxPrice}
                              onChange={(e) => setEditServiceData({ ...editServiceData, maxPrice: e.target.value })}
                              fullWidth
                              margin="normal"
                            />
                            <TextField
                              label="Address"
                              value={editServiceData.address}
                              onChange={(e) => setEditServiceData({ ...editServiceData, address: e.target.value })}
                              fullWidth
                              margin="normal"
                            />
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleCloseEditDialog}>Cancel</Button>
                            <Button onClick={handleUpdateService} color="primary">
                              Update
                            </Button>
                          </DialogActions>
                        </Dialog>
                        <IconButton aria-label="delete" color="warning"
                          sx={{
                            position: "absolute",
                            top: "8px", // Adjust this value for vertical positioning
                            right: "8px", // Adjust this value for horizontal positioning
                          }}
                          onClick={() => confirmDelete(service.id)}>
                          <ClearIcon></ClearIcon>
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                <Grid item xs={12} sm="auto" md={3}>
                  <Box
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      padding: "16px",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                    onClick={handleOpenDialog}
                  >
                    <img
                      src="/images/placeholder.png"
                      alt="Placeholder"
                      style={{
                        width: "100%",
                        height: "auto",
                        aspectRatio: "4 / 3",
                        objectFit: "contain",
                        marginBottom: "8px",
                      }}
                    />
                    <Typography variant="subtitle1" gutterBottom>
                      Click to add a service
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <h2>Bookings</h2>
              {bookings &&
                bookings.map((booking, index) => (
                  <div className="booking" key={index}>
                    <h3>{`Service Name: ${services.find((s) => s.id === booking.serviceID)?.name
                      }`}</h3>
                    <p>{`Start Date: ${formatDate(booking.start)}`}</p>
                    <p>{`End Date: ${formatDate(booking.end)}`}</p>
                    <p>{`Proposed Price: ${booking.price}`}</p>
                    <p>{`Status: ${booking.hasBeenConfirmed === false
                      ? "Pending"
                      : booking.status
                        ? "Accepted"
                        : "Rejected"
                      }`}</p>

                    {booking.hasBeenConfirmed == false && (
                      <>
                        <button
                          style={{
                            backgroundColor: "red",
                            borderRadius: "6px",
                            color: "white",
                            padding: "8px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleReject(booking)}
                        >
                          Reject
                        </button>
                        <button
                          style={{
                            backgroundColor: "green",
                            borderRadius: "6px",
                            color: "white",
                            padding: "8px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleAccept(booking)}
                        >
                          Accept
                        </button>
                      </>
                    )}
                  </div>
                ))}

              <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Add New Service</DialogTitle>
                <DialogContent>
                  Add a service image<br></br>
                  <input
                    type="file"
                    accept="image/jpeg, image/png, image/gif"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />
                  <br></br>
                  <TextField
                    label="Service Name"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Description"
                    value={serviceDescription}
                    onChange={(e) => setServiceDescription(e.target.value)}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                  />
                  <TextField
                    label="Minimum Price"
                    value={serviceMinPrice}
                    onChange={(e) => setServiceMinPrice(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Maximum Price"
                    value={serviceMaxPrice}
                    onChange={(e) => setServiceMaxPrice(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Address"
                    value={serviceAddress}
                    onChange={(e) => setServiceAddress(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Type"
                    select
                    value={serviceTypeID}
                    onChange={(e) => setServiceTypeID(e.target.value)}
                    fullWidth
                    margin="normal"
                  >
                    <MenuItem value={1}>Venue</MenuItem>
                    <MenuItem value={2}>Entertainment</MenuItem>
                    <MenuItem value={3}>Catering</MenuItem>
                    <MenuItem value={4}>Production</MenuItem>
                    <MenuItem value={5}>Decoration</MenuItem>
                  </TextField>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog}>Cancel</Button>
                  <Button onClick={handleAddService} color="primary">
                    Add
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}

        </>
      )}
      {!currentUser && <div>Sign up to see your profile info here!</div>}
    </>
  );
}
