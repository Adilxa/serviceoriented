"use client";
import React, { useState, useEffect } from "react";
import axios from "axios"

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newRoom, setNewRoom] = useState({
        address: "",
        city: "",
        type: "",
        pricePerDay: 0,
        isAvailable: false,
    });
    const [editRoom, setEditRoom] = useState(null);

    // Fetch rooms
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get("http://192.168.188.132:8081/rooms");
                setRooms(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load rooms");
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editRoom) {
            setEditRoom({ ...editRoom, [name]: value });
        } else {
            setNewRoom({ ...newRoom, [name]: value });
        }
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target; // checked gives boolean value for the checkbox
        if (editRoom) {
            setEditRoom((prevState) => ({ ...prevState, [name]: checked }));
        } else {
            setNewRoom((prevState) => ({ ...prevState, [name]: checked }));
        }
    };


    // Create a new room
    const createRoom = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://192.168.188.132:8081/rooms", newRoom);
            setRooms([...rooms, response.data]);
            setNewRoom({
                address: "",
                city: "",
                type: "",
                pricePerDay: 0,
                isAvailable: false,
            });
        } catch (error) {
            console.error("Error creating room", error);
        }
    };

    // Start editing a room
    const startEdit = (room) => {
        setEditRoom(room);
    };

    // Update a room
    const updateRoom = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://192.168.188.132:8081/rooms/${editRoom.id}`, editRoom);
            setRooms(
                rooms.map((room) =>
                    room.id === editRoom.id ? response.data : room
                )
            );
            setEditRoom(null);
        } catch (error) {
            console.error("Error updating room", error);
        }
    };

    // Delete a room
    const deleteRoom = async (id) => {
        try {
            await axios.delete(`http://192.168.188.132:8081/rooms/${id}`);
            setRooms(rooms.filter((room) => room.id !== id));
        } catch (error) {
            console.error("Error deleting room", error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Room Management</h1>

            {/* Form for adding/updating room */}
            <form
                onSubmit={editRoom ? updateRoom : createRoom}
                className="mb-4 p-4 border border-gray-200 rounded-md"
            >
                <h2 className="text-xl mb-2">{editRoom ? "Edit Room" : "Add New Room"}</h2>
                <div className="mb-2">
                    <label className="block">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={editRoom ? editRoom.address : newRoom.address}
                        onChange={handleInputChange}
                        className="p-2 border w-full"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block">City</label>
                    <input
                        type="text"
                        name="city"
                        value={editRoom ? editRoom.city : newRoom.city}
                        onChange={handleInputChange}
                        className="p-2 border w-full"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block">Type</label>
                    <input
                        type="text"
                        name="type"
                        value={editRoom ? editRoom.type : newRoom.type}
                        onChange={handleInputChange}
                        className="p-2 border w-full"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block">Price Per Day</label>
                    <input
                        type="number"
                        name="pricePerDay"
                        value={editRoom ? editRoom.pricePerDay : newRoom.pricePerDay}
                        onChange={handleInputChange}
                        className="p-2 border w-full"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block">Available</label>
                    <input
                        type="checkbox"
                        name="isAvailable"
                        checked={editRoom ? editRoom.isAvailable : newRoom.isAvailable}
                        onChange={handleCheckboxChange}
                        className="p-2"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                    {editRoom ? "Update Room" : "Add Room"}
                </button>
            </form>

            {/* Room table */}
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Address</th>
                        <th className="py-2 px-4 border-b">City</th>
                        <th className="py-2 px-4 border-b">Type</th>
                        <th className="py-2 px-4 border-b">Price Per Day</th>
                        {/* <th className="py-2 px-4 border-b">Available</th> */}
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map((room) => (
                        <tr key={room.id}>
                            <td className="py-2 px-4 border-b">{room.id}</td>
                            <td className="py-2 px-4 border-b">{room.address}</td>
                            <td className="py-2 px-4 border-b">{room.city}</td>
                            <td className="py-2 px-4 border-b">{room.type}</td>
                            <td className="py-2 px-4 border-b">{room.pricePerDay}</td>
                            {/* <td className="py-2 px-4 border-b">{room.isAvailable ? "Yes" : "No"}</td> */}
                            <td className="py-2 px-4 border-b">
                                <button
                                    onClick={() => startEdit(room)}
                                    className="bg-yellow-500 text-white py-1 px-3 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteRoom(room.id)}
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

export default Rooms;
