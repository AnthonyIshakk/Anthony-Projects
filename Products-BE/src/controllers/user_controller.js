import { RegisterUser, LoginUser, GetUserProfile } from "../services/user_service.js";

export async function register(req, res) {
  try {
    const { name, email, password, merchantName } = req.body;
    const { user, token } = await RegisterUser({ name, email, password, merchantName });
    res.status(201).json({ user, token });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(400).json({ error: err.message || "Registration failed" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const { user, token } = await LoginUser({ email, password });
    res.json({ user, token });
  } catch (err) {
    res.status(401).json({ error: "Invalid email or password." });
    console.error(err);
  }
}

export async function getProfile(req, res) {
  try {
    const id = req.user.sub; 
    const user = await GetUserProfile({ id });
   res.json({ user });

  } catch (err) {
    console.error("PROFILE ERROR:", err);
    res.status(500).json({ error: err.message || "Failed to fetch profile" });
  }
}
