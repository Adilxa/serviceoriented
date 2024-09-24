"use client";
import React, { useEffect, useState } from 'react';
import $api from '../../hhtp/index';

function Cars() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newCar, setNewCar] = useState({
        brand: '',
        model: '',
        pricePerDay: 0,
        licensePlate: '',
        isAvailable: true,
    });
    const [editCar, setEditCar] = useState(null);

    // Fetch car data
    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await $api.get("/cars");
                setCars(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load cars");
                setLoading(false);
            }
        };
        fetchCars();
    }, []);

    // Handle input changes for the new car form
    const handleInputChange = (e) => {
        setNewCar({ ...newCar, [e.target.name]: e.target.value });
    };

    const createCar = async (e) => {
        e.preventDefault();
        try {
            const response = await $api.post("/cars", newCar);
            setCars([...cars, response.data]); // Add the new car to the state
            setNewCar({
                brand: '',
                model: '',
                pricePerDay: 0,
                licensePlate: '',
                isAvailable: true,
            });
        } catch (error) {
            console.error("Error creating car", error);
        }
    };

    const startEdit = (car) => {
        setEditCar(car);
    };

    const updateCar = async (e) => {
        e.preventDefault();
        try {
            const response = await $api.put(`/cars/${editCar.id}`, editCar);
            setCars(cars.map((car) => (car.id === editCar.id ? response.data : car)));
            setEditCar(null);
        } catch (error) {
            console.error("Error updating car", error);
        }
    };

    // Delete a car
    const deleteCar = async (id) => {
        try {
            await $api.delete(`/cars/${id}`);
            setCars(cars.filter((car) => car.id !== id)); // Remove the car from the state
        } catch (error) {
            console.error("Error deleting car", error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Car Management</h1>

            {/* Form to create a new car */}
            <form onSubmit={createCar} className="mb-4 p-4 border">
                <h2 className="text-xl mb-2">Add New Car</h2>
                <div className="mb-2">
                    <label className="block">Brand</label>
                    <input
                        type="text"
                        name="brand"
                        value={newCar.brand}
                        onChange={handleInputChange}
                        className="p-2 border w-full"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block">Model</label>
                    <input
                        type="text"
                        name="model"
                        value={newCar.model}
                        onChange={handleInputChange}
                        className="p-2 border w-full"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block">Price/Day</label>
                    <input
                        type="number"
                        name="pricePerDay"
                        value={newCar.pricePerDay}
                        onChange={handleInputChange}
                        className="p-2 border w-full"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block">License Plate</label>
                    <input
                        type="text"
                        name="licensePlate"
                        value={newCar.licensePlate}
                        onChange={handleInputChange}
                        className="p-2 border w-full"
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2">Add Car</button>
            </form>

            {/* Display car data */}
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Brand</th>
                        <th className="py-2 px-4 border-b">Model</th>
                        <th className="py-2 px-4 border-b">Price/Day</th>
                        <th className="py-2 px-4 border-b">License Plate</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cars.map((car) => (
                        <tr key={car.id}>
                            <td className="py-2 px-4 border-b">{car.id}</td>
                            <td className="py-2 px-4 border-b">{car.brand}</td>
                            <td className="py-2 px-4 border-b">{car.model}</td>
                            <td className="py-2 px-4 border-b">${car.pricePerDay}</td>
                            <td className="py-2 px-4 border-b">{car.licensePlate}</td>

                            <td className="py-2 px-4 border-b">
                                <button
                                    className="bg-yellow-500 text-white px-2 py-1 mr-2"
                                    onClick={() => startEdit(car)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 text-white px-2 py-1"
                                    onClick={() => deleteCar(car.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Form to edit a car */}
            {editCar && (
                <form onSubmit={updateCar} className="mt-4 p-4 border">
                    <h2 className="text-xl mb-2">Edit Car</h2>
                    <div className="mb-2">
                        <label className="block">Brand</label>
                        <input
                            type="text"
                            name="brand"
                            value={editCar.brand}
                            onChange={(e) => setEditCar({ ...editCar, brand: e.target.value })}
                            className="p-2 border w-full"
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block">Model</label>
                        <input
                            type="text"
                            name="model"
                            value={editCar.model}
                            onChange={(e) => setEditCar({ ...editCar, model: e.target.value })}
                            className="p-2 border w-full"
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block">Price/Day</label>
                        <input
                            type="number"
                            name="pricePerDay"
                            value={editCar.pricePerDay}
                            onChange={(e) => setEditCar({ ...editCar, pricePerDay: e.target.value })}
                            className="p-2 border w-full"
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block">License Plate</label>
                        <input
                            type="text"
                            name="licensePlate"
                            value={editCar.licensePlate}
                            onChange={(e) => setEditCar({ ...editCar, licensePlate: e.target.value })}
                            className="p-2 border w-full"
                            required
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white p-2">Update Car</button>
                </form>
            )}
        </div>
    );
}

export default Cars;
