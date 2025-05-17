import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import ARequest from "../ARequest";
import "./AdminRequest.css";

export default function AdminRequest() {
  const [allRequests, setAllRequests] = useState([]);

  const getAllRequests = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8002/events/all", {
        withCredentials: true,
      });
      setAllRequests(response.data.events);
    } catch (error) {
      console.error(
        "Error fetching all requests:",
        error.response?.data || error.message
      );
    }
  }, []);

  useEffect(() => {
    getAllRequests();
  }, [getAllRequests]);

  function handleRequestClick(id) {
    console.log(id);
  }

  return (
    <section className="admin-list">
      {allRequests.map((event) => (
        <div
          key={event.title}
          onClick={() => handleRequestClick(event.title)}
          style={{ cursor: "pointer" }}
          className="arequest-admin"
        >
          <ARequest event={event} />
        </div>
      ))}
    </section>
  );
}
