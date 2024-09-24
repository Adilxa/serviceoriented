"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { format, parseISO } from "date-fns";

const formatDateForInput = (date) => {
    if (!date) return "";
    return format(parseISO(date), "yyyy-MM-dd'T'HH:mm");
};

const Tickets = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newEvent, setNewEvent] = useState({
        eventName: "",
        eventDate: "",
        location: "",
        ticketPrice: 0,
        totalTickets: 0,
        availableTickets: 0,
    });
    const [editEvent, setEditEvent] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get("http://192.168.188.132:8082/events");
                setEvents(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load events");
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editEvent) {
                // Update existing event
                const response = await axios.put(`http://192.168.188.132:8082/events/${editEvent.id}`, newEvent);
                setEvents(events.map((event) =>
                    event.id === editEvent.id ? response.data : event
                ));
                setEditEvent(null);
            } else {
                // Create new event
                const response = await axios.post("http://192.168.188.132:8082/events", newEvent);
                setEvents([...events, response.data]);
            }
            setNewEvent({
                eventName: "",
                eventDate: "",
                location: "",
                ticketPrice: 0,
                totalTickets: 0,
                availableTickets: 0,
            });
        } catch (error) {
            console.error("Error submitting event", error);
        }
    };

    const startEdit = (event) => {
        setEditEvent(event);
        setNewEvent({
            eventName: event.eventName,
            eventDate: formatDateForInput(event.eventDate),
            location: event.location,
            ticketPrice: event.ticketPrice,
            totalTickets: event.totalTickets,
            availableTickets: event.availableTickets,
        });
    };

    const deleteEvent = async (id) => {
        try {
            await axios.delete(`http://192.168.188.132:8082/events/${id}`);
            setEvents(events.filter((event) => event.id !== id));
        } catch (error) {
            console.error("Error deleting event", error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Events</h1>

            {/* Form for creating/updating event */}
            <form onSubmit={handleFormSubmit} className="mb-4 p-4 border border-gray-200 rounded-md">
                <h2 className="text-xl mb-2">{editEvent ? "Edit Event" : "Add New Event"}</h2>
                <div className="mb-2">
                    <label className="block">Event Name</label>
                    <input
                        type="text"
                        name="eventName"
                        value={newEvent.eventName}
                        onChange={handleInputChange}
                        className="p-2 border w-full"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block">Event Date</label>
                    <input
                        type="datetime-local"
                        name="eventDate"
                        value={newEvent.eventDate}
                        onChange={handleInputChange}
                        className="p-2 border w-full"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={newEvent.location}
                        onChange={handleInputChange}
                        className="p-2 border w-full"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block">Ticket Price</label>
                    <input
                        type="number"
                        name="ticketPrice"
                        value={newEvent.ticketPrice}
                        onChange={handleInputChange}
                        className="p-2 border w-full"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block">Total Tickets</label>
                    <input
                        type="number"
                        name="totalTickets"
                        value={newEvent.totalTickets}
                        onChange={handleInputChange}
                        className="p-2 border w-full"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block">Available Tickets</label>
                    <input
                        type="number"
                        name="availableTickets"
                        value={newEvent.availableTickets}
                        onChange={handleInputChange}
                        className="p-2 border w-full"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                    {editEvent ? "Update Event" : "Add Event"}
                </button>
            </form>

            {/* Event table */}
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Event Name</th>
                        <th className="py-2 px-4 border-b">Event Date</th>
                        <th className="py-2 px-4 border-b">Location</th>
                        <th className="py-2 px-4 border-b">Ticket Price</th>
                        <th className="py-2 px-4 border-b">Total Tickets</th>
                        <th className="py-2 px-4 border-b">Available Tickets</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event) => (
                        <tr key={event.id}>
                            <td className="py-2 px-4 border-b">{event.id}</td>
                            <td className="py-2 px-4 border-b">{event.eventName}</td>
                            <td className="py-2 px-4 border-b">{new Date(event.eventDate).toLocaleString()}</td>
                            <td className="py-2 px-4 border-b">{event.location}</td>
                            <td className="py-2 px-4 border-b">${event.ticketPrice.toFixed(2)}</td>
                            <td className="py-2 px-4 border-b">{event.totalTickets}</td>
                            <td className="py-2 px-4 border-b">{event.availableTickets}</td>
                            <td className="py-2 px-4 border-b">
                                <button
                                    onClick={() => startEdit(event)}
                                    className="bg-yellow-500 text-white py-1 px-3 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteEvent(event.id)}
                                    className="bg-red-500 text-white py-1 px-3 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Tickets;
