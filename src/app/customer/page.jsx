"use client";
import React, { useState, useEffect } from "react";
import $api from "../../hhtp/index"; // Assuming this is your axios instance

function Customer() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newCustomer, setNewCustomer] = useState({
        name: "",
        address: "",
        phone: ""
    });
    const [editCustomer, setEditCustomer] = useState(null);

    // Fetch customers
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await $api.get("/customers");
                setCustomers(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load customers");
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    // Handle input changes for creating/updating customer
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editCustomer) {
            setEditCustomer({ ...editCustomer, [name]: value });
        } else {
            setNewCustomer({ ...newCustomer, [name]: value });
        }
    };

    // Create a new customer
    const createCustomer = async (e) => {
        e.preventDefault();
        try {
            const response = await $api.post("/customers", newCustomer);
            setCustomers([...customers, response.data]);
            setNewCustomer({
                name: "",
                address: "",
                phone: ""
            });
        } catch (error) {
            console.error("Error creating customer", error);
        }
    };

    // Start editing a customer
    const startEdit = (customer) => {
        setEditCustomer(customer);
    };

    // Update a customer
    const updateCustomer = async (e) => {
        e.preventDefault();
        try {
            const response = await $api.put(`/customers/${editCustomer.id}`, editCustomer);
            setCustomers(
                customers.map((customer) =>
                    customer.id === editCustomer.id ? response.data : customer
                )
            );
            setEditCustomer(null);
        } catch (error) {
            console.error("Error updating customer", error);
        }
    };

    const deleteCustomer = async (id) => {
        try {
            await $api.delete(`/customers/${id}`);
            setCustomers(customers.filter((customer) => customer.id !== id));
        } catch (error) {
            console.error("Error deleting customer", error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Customer Management</h1>

            {/* Form for adding/updating customer */}
            <form
                onSubmit={editCustomer ? updateCustomer : createCustomer}
                className="mb-4 p-4 border border-gray-200 rounded-md"
            >
                <h2 className="text-xl mb-2">{editCustomer ? "Edit Customer" : "Add New Customer"}</h2>
                <div className="mb-2">
                    <label className="block">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={editCustomer ? editCustomer.name : newCustomer.name}
                        onChange={handleInputChange}
                        className="p-2 border w-full"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={editCustomer ? editCustomer.address : newCustomer.address}
                        onChange={handleInputChange}
                        className="p-2 border w-full"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={editCustomer ? editCustomer.phone : newCustomer.phone}
                        onChange={handleInputChange}
                        className="p-2 border w-full"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                    {editCustomer ? "Update Customer" : "Add Customer"}
                </button>
            </form>

            {/* Customer table */}
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Phone</th>
                        <th className="py-2 px-4 border-b">Address</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr key={customer.id}>
                            <td className="py-2 px-4 border-b">{customer.id}</td>
                            <td className="py-2 px-4 border-b">{customer.name}</td>
                            <td className="py-2 px-4 border-b">{customer.phone}</td>
                            <td className="py-2 px-4 border-b">{customer.address}</td>
                            <td className="py-2 px-4 border-b">
                                <button
                                    onClick={() => startEdit(customer)}
                                    className="bg-yellow-500 text-white py-1 px-3 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteCustomer(customer.id)}
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
}

export default Customer;
