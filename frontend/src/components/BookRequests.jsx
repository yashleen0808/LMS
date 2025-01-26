import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";

const BookRequests = () => {
  const { token } = useContext(AppContext);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/book/requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status == 200) {
          setRequests(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
      }
    };
    fetchRequests();
  }, [token]);

  const handleRequest = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5001/api/book/requests/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === id
            ? {
                ...request,
                status,
                dateIssued:
                  status === "granted" ? new Date() : request.dateIssued,
                returnDate:
                  status === "granted"
                    ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    : request.returnDate,
              }
            : request
        )
      );

      toast.success(`Request ${status} successfully`);
    } catch (err) {
      const errorMessage =
        err.response?.data?.msg || "Failed to update request";
      console.error(err);
      toast.error(errorMessage);
    }
  };

  const handleRevoke = async (id) => {
    try {
      await axios.post(
        `http://localhost:5001/api/book/ebooks/${id}/revoke`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.ebook._id === id ? { ...request, status: "revoked" } : request
        )
      );
      toast.success("E-book revoked successfully");
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Failed to revoke E-book";
      console.error(err);
      toast.error(errorMessage);
    }
  };

  const pendingRequests = requests.filter(
    (request) => request.status === "pending"
  );
  const grantedBooks = requests.filter(
    (request) => request.status === "granted"
  );

  return (
    <Container sx={{ paddingTop: 5 }}>
      {pendingRequests.length > 0 ? (
        <>
          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            sx={{
              fontFamily: "Montserrat",
              color: "#d6d925",
              fontWeight: "bold",
            }}
          >
            Pending Requests
          </Typography>
          <TableContainer
            component={Paper}
            sx={{ border: "1px solid #ccc", marginTop: 2, marginBottom: 10 }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Book Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Username</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingRequests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell>
                      {request.ebook?.name || "Unknown E-book"}
                    </TableCell>
                    <TableCell>{request.username}</TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", flexDirection: "row", gap: 1 }}
                      >
                        <Button
                          onClick={() => handleRequest(request._id, "granted")}
                          variant="contained"
                          color="primary"
                        >
                          Grant
                        </Button>
                        <Button
                          onClick={() => handleRequest(request._id, "rejected")}
                          variant="contained"
                          color="secondary"
                        >
                          Reject
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <Typography
          color="textSecondary"
          variant="h6"
          component="p"
          gutterBottom
        >
          No pending requests.
        </Typography>
      )}
      {grantedBooks.length > 0 ? (
        <>
          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            sx={{
              fontFamily: "Montserrat",
              color: "#06781f",
              fontWeight: "bold",
            }}
          >
            Granted Books
          </Typography>
          <TableContainer
            component={Paper}
            sx={{ border: "1px solid #ccc", marginTop: 2, marginBottom: 10 }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Book Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Username</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Return Date</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {grantedBooks.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell>{request.ebook.name}</TableCell>
                    <TableCell>{request.username}</TableCell>
                    <TableCell>
                      {new Date(request.returnDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleRevoke(request.ebook._id)}
                        variant="contained"
                        color="secondary"
                      >
                        Revoke
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <Typography
          color="textSecondary"
          variant="h6"
          component="p"
          gutterBottom
          sx={{ marginBottom: 4 }}
        >
          No active granted requests.
        </Typography>
      )}
    </Container>
  );
};

export default BookRequests;
