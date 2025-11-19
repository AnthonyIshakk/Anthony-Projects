import { useState, useEffect } from "react";

const API_BASE = "http://localhost:3000";

export function useApi(endpoint, mode = "GET", dependencies = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function makeRequest(body = null, customEndpoint = null) {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      let options = {
        method: mode,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      };

      if (body) {
        if (body instanceof FormData) {
          options.body = body;
        } else {
          options.headers["Content-Type"] = "application/json";
          options.body = JSON.stringify(body);
        }
      }

      const res = await fetch(`${API_BASE}${customEndpoint || endpoint}`, options);

      if (!res.ok) {
        if (res.status === 401 && token) {
          console.warn("Token expired! Log in again!");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return null;
        }

        let message = "Something went wrong";
        try {
          const errorData = await res.json();
          message = errorData.message || errorData.error || message;
        } catch {
        }

        throw new Error(message);
      }

      const results = await res.json();
      setData(results);
      return results;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (dependencies !== null) {
      makeRequest();
    }
  }, dependencies || []);

  return { data, loading, error, makeRequest };
}
