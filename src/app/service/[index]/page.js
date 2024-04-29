"use client";

import { useEffect, useState } from "react";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { getSession } from "next-auth/react";
import Divider from '@mui/material/Divider';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { IconButton } from '@mui/material';


export default function Service({ params }) {
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState(null);
  const [user, SetUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingInfo, setBookingInfo] = useState({
    date: "",
    startTime: "",
    endTime: "",
    email: "",
    price: 0,
    startDate: null,
    endDate: null,
  });
  const [isStartTimeValid, setIsStartTimeValid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [review, setReview] = useState({ stars: 0, description: "" });
  const [reviews, setReviews] = useState([]);
  const [characterCount, setCharacterCount] = useState(0);
  const [exceedLimit, setExceedLimit] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  



  useEffect(() => {
    const fetchCurrentUser = async () => {
      const session = await getSession();
      if (!session) return;

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
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/review");
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        const modifiedReviews = data.reviews.map(review => {
          const dateObject = new Date(review.date);
          const month = dateObject.toLocaleString('default', { month: 'short' });
          const day = dateObject.getDate();
          const hours = dateObject.getHours();
          const minutes = dateObject.getMinutes();
          const ampm = hours >= 12 ? 'PM' : 'AM';
          const formattedHours = hours % 12 || 12; // Convert hours to 12-hour format
          const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Add leading zero if minutes < 10

          return {
            ...review,
            date: `${month} ${day}`,
            time: `${formattedHours}:${formattedMinutes} ${ampm}`
          };
        });

        setReviews(modifiedReviews);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReviews();
  }, []);

  const StarRating = ({ rating, onRatingChange }) => {
    const [hoverRating, setHoverRating] = useState(0);

    const handleMouseEnter = (index) => {
      setHoverRating(index);
    };

    const handleMouseLeave = () => {
      setHoverRating(0);
    };

    const handleClick = (index) => {
      onRatingChange(index);
    };

    return (
      <div>
        {[1, 2, 3, 4, 5].map((index) => (
          <span
            key={index}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
          >
            {index <= (hoverRating || rating) ? <StarIcon /> : <StarBorderIcon />}
          </span>
        ))}
      </div>
    );
  };

  const toggleFavorite = async (userId, service) => {
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

  const handleMakeBookingClick = () => {
    // Open the modal
    setIsModalOpen(true);
  };

  const closeModal = () => {
    // Close the modal
    setIsModalOpen(false);
    // Reset booking information
    setBookingInfo({
      date: "",
      startTime: "",
      endTime: "",
      price: 0,
      startDate: null, // New state for start date
      endDate: null, // New state for end date
    });
    setIsStartTimeValid(true);
    // Reset submission status
    setIsSubmitting(false);
  };


  const handleStartTimeChange = (event) => {
    const startTime = event.target.value;
    if (bookingInfo.date == "") {
      window.alert("Select Date.");
      return;
    }
    // Check if the start time is not later than the end time
    const isStartTimeValid = startTime <= bookingInfo.endTime;
    setIsStartTimeValid(isStartTimeValid);
    const startDate = new Date(`${bookingInfo.date}T${startTime}`);
    setBookingInfo((prevInfo) => ({ ...prevInfo, startTime, startDate }));
  };

  const handleEndTimeChange = (event) => {
    const endTime = event.target.value;
    if (bookingInfo.date == "") {
      window.alert("Select Date.");
      return;
    }
    // Check if the end time is not earlier than the start time
    const isStartTimeValid = bookingInfo.startTime <= endTime;
    setIsStartTimeValid(isStartTimeValid);
    const endDate = new Date(`${bookingInfo.date}T${endTime}`);
    setBookingInfo((prevInfo) => ({ ...prevInfo, endTime, endDate }));
  };

  const handleSubmitBooking = async () => {
    let newBooking;
    let newNotif;
    const { date, startTime, endTime, price } = bookingInfo;
    if (!/^\d{1,999999}$/.test(price) || Number(price) > 999999 || Number(price) < 1) {
      window.alert("Invalid Price.");
      return;
    }
    try {
      if (bookingInfo.startTime > bookingInfo.endTime) {
        setIsStartTimeValid(false);
        return;
      }
      setCurrentTime(new Date());
      if (currentTime > bookingInfo.startDate) {
        window.alert("Invalid Time");
        return;
      }

      try {
        if (currentUser == null || currentUser.role == "VENDOR") {
          return;
        }
        newBooking = {
          status: false,
          hasBeenConfirmed: false,
          start: bookingInfo.startDate,
          end: bookingInfo.endDate,
          price: Number(bookingInfo.price),
          custID: currentUser.id,
          serviceID: service.id,
        };
      } catch (error) {
        console.error(error);
      }
      try {
        const response = await fetch("/api/bookings", {
          method: "POST",
          body: JSON.stringify(newBooking),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to add booking");
        }
        const responseData = await response.json();
        newNotif = {
          title: "New Booking",
          description: "A New Booking has been requested",
          dismissed: false,
          start: new Date().toISOString(),
          bookingID: responseData.booking.id,
          userID: service.vendorID
        }

        const responsenotif = await fetch("/api/Notifs", {
          method: "POST",
          body: JSON.stringify(newNotif),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!responsenotif.ok) {
          throw new Error("Failed to add notification");
        }
        const responseDataNotif = await responsenotif.json();

      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      window.alert("Error submitting BOOKING:", error);
      return;
    } finally {
      if (!isStartTimeValid) {
        window.alert("Invalid start & end time");
        return;
      } else if (bookingInfo.date == "") {
        window.alert("Need to input a date.");
        return;
      } else if (currentUser == null) {
        window.alert("Invalid customer email.");
        return;
      } else if (currentUser.role == "VENDOR"){
        window.alert("You may not request a booking if you are a vendor.");
      }
      setIsSubmitting(true);
      // Update UI as needed
      setIsSubmitting(false);
      // Close the modal after a delay
      setTimeout(() => closeModal(), 500);
    }
  };

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch("/api/servicesProfile");
        if (response.ok) {
          const data = await response.json();
          const services = data.services;
          const selectedService = services.find(
            (service) => service.id === parseInt(params.index)
          );
          if (selectedService) {
            setService(selectedService);
          } else {
            console.error("Service not found");
          }
        } else {
          console.error("Failed to fetch services");
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [params.index]);

  const handleReviewChange = (event) => {
    const { name, value } = event.target;
    const count = value.length;
    setCharacterCount(count);
    setExceedLimit(count > 3000);
    setReview(prevReview => ({
      ...prevReview,
      [name]: value
    }));
  };

  const handleSubmitReview = async () => {
    const descriptionLength = review.description.trim().length;

    if (descriptionLength > 3000) {
      console.error("Review exceeds the character limit of 3000");
      return;
    }

    const currentDate = new Date().toISOString();
    const newReview = {
      stars: Number(review.stars),
      description: review.description,
      date: currentDate,
      author: currentUser,
      authorID: Number(currentUser.id),
      serviceID: Number(service.id),
    };
    try {
      const response = await fetch("/api/review", {
        method: "PUT",
        body: JSON.stringify(newReview),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to add review");
      }
      const dateObject = new Date(newReview.date);
      const month = dateObject.toLocaleString("default", { month: "short" });
      const day = dateObject.getDate();
      const hours = dateObject.getHours();
      const minutes = dateObject.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12; // Convert hours to 12-hour format
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Add leading zero if minutes < 10
      newReview.date = `${month} ${day}`;
      newReview.time = `${formattedHours}:${formattedMinutes} ${ampm}`;
      setReviews([...reviews, newReview]);

      setReview({
        stars: 0,
        description: ""
      });
    } catch (error) {
      console.error(error);
    }
  };

  const calculateOverallRating = () => {
    const serviceReviews = reviews.filter(review => review.serviceID === service.id);

    if (serviceReviews.length === 0) return 0;

    const totalStars = serviceReviews.reduce((acc, curr) => acc + curr.stars, 0);

    return totalStars / serviceReviews.length;
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!service) {
    return <p>Service not found</p>;
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <div style={{ flex: "1", marginRight: "20px" }}>
          <h1 style={{ fontFamily: 'Verdana, sans-serif'}}>{service.name} {currentUser && (
            <IconButton
              aria-label={`favorite ${service.name}`}
              onClick={() => toggleFavorite(currentUser.id, service)}
              sx={{ color: currentUser.favorites.some(fav => fav.id === service.id) ? 'red' : 'black' }}
            >
              {currentUser.favorites.some(fav => fav.id === service.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          )}</h1>
          {/* Display service image */}
          <div style={{ maxWidth: "400px" }}>
            {service.image ? (
              <img
                src={`/images/vendor/${service.id}.png`}
                alt={service.name}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  objectPosition: "left",
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
                  height: "auto",
                  objectFit: "contain",
                  objectPosition: "left",
                  marginBottom: "8px",
                  borderRadius: '10px'
                }}
              />
            )}
          </div>
          <br />
        </div>
        <div style={{ flex: "1", border: "1px solid #ccc", marginTop: "90px", borderRadius: "5px", padding: "1px", marginLeft: "20px", display: "flex" }}>
          <div style={{ flex: "1", marginRight: "10px" }}>
            <div style={{ marginBottom: "10px", marginLeft: "10px" }}>
              <h2 style={{ fontFamily: 'Verdana, sans-serif'}}>About This Service</h2>
              <p style={{ fontFamily: 'Verdana, sans-serif', wordWrap: 'break-word' }}>{service.description}</p>
            </div>
            <div>
              <Divider orientation="horizontal" flexItem style={{ marginLeft: "10px" }} />
              <h2 style={{ fontFamily: 'Verdana, sans-serif', marginLeft: "10px" }}>Service Information</h2>
              <p style={{ fontFamily: 'Verdana, sans-serif', marginLeft: "10px", wordWrap: 'break-word' }}>
                Type: {service.type.name}<br />
                Price: ${service.minPrice} - ${service.maxPrice}<br />
                Location: {service.address}
              </p>
            </div>
          </div>
          <Divider orientation="vertical" flexItem />
          <div style={{ flex: "1" }}>
            <div style={{ marginBottom: "10px", marginLeft: "10px" }}>
              <h2 style={{ fontFamily: 'Verdana, sans-serif'}}>Vendor Information</h2>
              <p style={{ fontFamily: 'Verdana, sans-serif', wordWrap: 'break-word' }}>
                Vendor: {service.vendor.displayName}<br />
                Phone: {service.vendor.phone}<br />
                Email: {service.vendor.email}
              </p>
            </div>
          </div>
        </div>
      </div>
      <button onClick={handleMakeBookingClick}>Request Booking</button>

      {/* Modal */}
      {isModalOpen && (
        <div>
          <div className="modal-content">
            <p>Date:</p>
            <input
              type="date"
              name="date"
              value={bookingInfo.date}
              onChange={(e) => setBookingInfo({ ...bookingInfo, date: e.target.value })}
            />

            <p>Start Time:</p>
            <input
              type="time"
              name="startTime"
              value={bookingInfo.startTime}
              onChange={handleStartTimeChange}
            />

            <p>End Time:</p>
            <input
              type="time"
              name="endTime"
              value={bookingInfo.endTime}
              onChange={handleEndTimeChange}
            />

            <p>Proposed Price:</p>
            <input
              type="number"
              name="price"
              value={bookingInfo.price}
              onChange={(e) => setBookingInfo({ ...bookingInfo, price: e.target.value })}
            />

            {!isStartTimeValid && (
              <p style={{ color: "red" }}>
                Start time cannot be later than end time.
              </p>
            )}

            {isSubmitting ? (
              <p>Submitting booking...</p>
            ) : (
              <button onClick={handleSubmitBooking}>Submit Booking</button>
            )}
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      {/* Area for Reviews */}
      <div style={{ marginTop: "20px" }}>
        <h2 style={{ marginBottom: "10px" }}>Reviews: {calculateOverallRating().toFixed(1)} <StarIcon style={{ verticalAlign: "-3.5px" }} /></h2>
        <div style={{ border: "1px solid #ccc", borderRadius: "5px", padding: "10px" }}>
          {currentUser && (
            <div>
              <h2>Add Review</h2>
              <p>Rating:</p>
              <StarRating
                rating={review.stars}
                onRatingChange={stars => setReview(prevReview => ({ ...prevReview, stars }))}
              />
              <p>Review:</p>
              <textarea
                style={{ width: "100%", height: "200px" }}
                name="description"
                value={review.description}
                onChange={handleReviewChange}
              />
              {isSubmitting ? (
                <p>Submitting review...</p>
              ) : (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <button onClick={handleSubmitReview} style={{ marginRight: "10px" }}>Submit Review</button>
                  <p style={{ fontSize: "10px" }}>{characterCount} / 3000 characters left</p>
                  {exceedLimit && <p style={{ color: "red", marginLeft: "10px", fontSize: "10px" }}>Character limit exceeded!</p>}
                </div>
              )}
              <Divider sx={{ marginTop: '20px' }} />
              <Divider sx={{ marginTop: '10px' }} />
            </div>
          )}

          {reviews && reviews
            .filter(review => review.serviceID === service.id)
            .map((review, index) => (
              <div key={index}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <p><strong>User:</strong> {review.author.displayName}</p>
                    <p></p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p><strong>{review.stars} <StarIcon style={{ verticalAlign: "-5.5px" }} /> - </strong> {review.date}, {review.time}</p>
                  </div>
                </div>
                <p style={{ wordWrap: 'break-word' }}><strong>Review:</strong> {review.description}</p>
                <Divider sx={{ marginTop: '10px' }} />
              </div>
            ))}
          {reviews && reviews.filter(review => review.serviceID === service.id).length === 0 && (
            <p>This service has no reviews so far.</p>
          )}
        </div>
      </div>
    </div>
  );
}
