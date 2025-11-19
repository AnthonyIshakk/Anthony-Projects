import { getAllMerchants } from "../repositories/merchant_repo.js";

export async function listMerchants(req, res) {
  try {
    const merchants = await getAllMerchants();
    res.json(merchants);
  } catch (err) {
    console.error("Error fetching merchants:", err);
    res.status(500).json({ error: "Failed to fetch merchants" });
  }
}
