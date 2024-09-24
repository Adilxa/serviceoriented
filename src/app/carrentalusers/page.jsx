"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { format, parseISO } from 'date-fns';

const formatDateForInput = (date) => {
    if (!date) return "";
    return format(parseISO(date), "yyyy-MM-dd'T'HH:mm");
};

const CarRentals = () => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newRental, setNewRental] = useState({
        car: { id: "" },
        customer: { id: "" },
        rentalDate: "",
        returnDate: "",
        status: "Active",
    });
    const [editRental, setEditRental] = useState(null);

    useEffect(() => {
        const fetchRentals = async () => {
            try {
                const response = await axios.get("http://192.168.188.132:8080/carrentals");
                setRentals(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load rentals");
                setLoading(false);
            }
        };
        fetchRentals();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const [key, subKey] = name.split('.');

        if (editRental) {
            setEditRental((prev) => ({
                ...prev,
                [key]: {
                    ...prev[key],
                    [subKey]: value,
                },
            }));
        } else {
            setNewRental((prev) => ({
                ...prev,
                [key]: {
                    ...prev[key],
                    [subKey]: value,
                },
            }));
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editRental) {
                // Update existing rental
                const response = await axios.put(`http://192.168.188.132:8080/carrentals/${editRental.id}`, editRental);
                setRentals(rentals.map((rental) =>
                    rental.id === editRental.id ? response.data : rental
                ));
                setEditRental(null);
            } else {
                // Create new rental
                const response = await axios.post("http://192.168.188.132:8080/carrentals", newRental);
                setRentals([...rentals, response.data]);
                setNewRental({
                    car: { id: "" },
                    customer: { id: "" },
                    rentalDate: "",
                    returnDate: "",
                    status: "Active",
                });
            }
        } catch (error) {
            console.error("Error submitting rental", error);
        }
    };

    const startEdit = (rental) => {
        setEditRental(rental);
    };

    const deleteRental = async (id) => {
        try {
            await axios.delete(`http://192.168.188.132:8080/carrentals/${id}`);
            setRentals(rentals.filter((rental) => rental.id !== id));
        } catch (error) {
            console.error("Error deleting rental", error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Car Rentals</h1>

            {/* Form for creating/updating rental */}
            <form onSubmit={handleFormSubmit} className="mb-4 p-4 border border-gray-200 rounded-md">
                <h2 className="text-xl mb-2">{editRental ? "Edit Rental" : "Add New Rental"}</h2>
                <div className="mb-2">
                    <label className="block">Car ID</label>
                    <input
                        type="text"
                        name="car.id"
                        value={editRental ? editRental.car.id : newRental.car.id}
                        onChange={handleInputChange}
                        className="p-2 border w-full"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block">Customer ID</label>
                    <input
                        type="text"
                        name="customer.id"
                        value={editRental ? editRental.customer.id : newRental.customer.id}
                        onChange={handleInputChange}
                        className="p-2 border w-full"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block">Rental Date</label>
                    <input
                        type="datetime-local"
                        name="rentalDate"
                        value={editRental ? formatDateForInput(editRental.rentalDate) : formatDateForInput(newRental.rentalDate)}
                        onChange={handleInputChange}
                        className="p-2 border w-full"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block">Return Date</label>
                    <input
                        type="datetime-local"
                        name="returnDate"
                        value={editRental ? formatDateForInput(editRental.returnDate) : formatDateForInput(newRental.returnDate)}
                        onChange={handleInputChange}
                        className="p-2 border w-full"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block">Status</label>
                    <select
                        name="status"
                        value={editRental ? editRental.status : newRental.status}
                        onChange={handleInputChange}
                        className="p-2 border w-full"
                        required
                    >
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                    {editRental ? "Update Rental" : "Add Rental"}
                </button>
            </form>

            {/* Rental table */}
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Car Brand</th>
                        <th className="py-2 px-4 border-b">Car Model</th>
                        <th className="py-2 px-4 border-b">License Plate</th>
                        <th className="py-2 px-4 border-b">Customer Name</th>
                        <th className="py-2 px-4 border-b">Rental Date</th>
                        <th className="py-2 px-4 border-b">Return Date</th>
                        <th className="py-2 px-4 border-b">Total Price</th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rentals.map((rental) => (
                        <tr key={rental.id}>
                            <td className="py-2 px-4 border-b">{rental.id}</td>
                            <td className="py-2 px-4 border-b">{rental.car.brand}</td>
                            <td className="py-2 px-4 border-b">{rental.car.model}</td>
                            <td className="py-2 px-4 border-b">{rental.car.licensePlate}</td>
                            <td className="py-2 px-4 border-b">{rental.customer.name}</td>
                            <td className="py-2 px-4 border-b">{new Date(rental.rentalDate).toLocaleString()}</td>
                            <td className="py-2 px-4 border-b">{new Date(rental.returnDate).toLocaleString()}</td>
                            <td className="py-2 px-4 border-b">${rental.totalRentalPrice.toFixed(2)}</td>
                            <td className="py-2 px-4 border-b">{rental.status}</td>
                            <td className="py-2 px-4 border-b">
                                <button
                                    onClick={() => startEdit(rental)}
                                    className="bg-yellow-500 text-white py-1 px-3 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteRental(rental.id)}
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

export default CarRentals;
