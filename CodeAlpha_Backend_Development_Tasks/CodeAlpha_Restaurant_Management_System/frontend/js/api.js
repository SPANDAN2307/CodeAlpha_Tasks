const API_BASE = "http://localhost:4000/api";
let ADMIN_KEY = localStorage.getItem("lumina_admin_key") || "";

const request = async (endpoint, options = {}) => {
    const headers = {
        "Content-Type": "application/json",
        ...options.headers
    };

    if (ADMIN_KEY) {
        headers["x-admin-key"] = ADMIN_KEY;
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || data.error || "API Request Failed");
        }
        
        return data;
    } catch (error) {
        throw error;
    }
};

export const setAdminKey = (key) => {
    ADMIN_KEY = key;
    localStorage.setItem("lumina_admin_key", key);
};

export const clearAdminKey = () => {
    ADMIN_KEY = "";
    localStorage.removeItem("lumina_admin_key");
};

export const getMenu = () => request("/menu");

export const checkAvailability = (datetime, partySize) => 
    request(`/tables/availability?datetime=${datetime}&partySize=${partySize}`);

export const createReservation = (data) => 
    request("/reservations", {
        method: "POST",
        body: JSON.stringify(data)
    });

export const createOrder = (data) => 
    request("/orders", {
        method: "POST",
        body: JSON.stringify(data)
    });

// Admin routes
export const getInventory = () => request("/inventory");

export const updateInventory = (id, quantity) => 
    request(`/inventory/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity })
    });

export const getDailySales = (date) => 
    request(`/reports/daily-sales?date=${date}`);

export const getStockAlerts = (threshold = 10) => 
    request(`/reports/stock-alerts?threshold=${threshold}`);

export const addMenuItem = (data) =>
    request("/menu", {
        method: "POST",
        body: JSON.stringify(data)
    });

export const updateMenuItem = (id, data) =>
    request(`/menu/${id}`, {
        method: "PUT",
        body: JSON.stringify(data)
    });

export const deleteMenuItem = (id) =>
    request(`/menu/${id}`, {
        method: "DELETE"
    });
