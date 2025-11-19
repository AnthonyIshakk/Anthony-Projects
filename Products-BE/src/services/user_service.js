import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser, findUserById } from "../repositories/user_repo.js";
import { createMerchant, findMerchantByName } from "../repositories/merchant_repo.js";

const ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || "12", 10);
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

export async function RegisterUser({ name, email, password, merchantName }) {
  const existing = await findUserByEmail({ email });
  if (existing) throw new Error("Email already registered!");

  //to check eza l merchant exist aw lae w to create eza lae
  let merchant = await findMerchantByName(merchantName);
  if (!merchant) {
    merchant = await createMerchant({ merchantName });
  }

  const passwordHash = await bcrypt.hash(password, ROUNDS);

  //creates the user w bta3ti merchant_id taba3 l merchant taba3o
  const user = await createUser({
    name,
    email,
    passwordHash,
    merchantId: merchant.id,
  });

  //added merchant id to the token to use it with req.id
  const token = jwt.sign(
    { sub: user.id, email: user.email, merchant_id: user.merchant_id },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
  return { user, token };
}

export async function LoginUser({ email, password }) {
  const user = await findUserByEmail({ email });
  if (!user) throw new Error("Invalid credentials");

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { sub: user.id, email: user.email, merchant_id: user.merchant_id },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return { user: { id: user.id, name: user.name, email: user.email, merchant_id: user.merchant_id }, token };
}

export async function GetUserProfile({ id }) {
  const user = await findUserById({ id });
  if (!user) throw new Error("User not found");
  return user;
}
