import {
  ProductsListService,
  SearchProductsService,
  createProductService,
  updateProductService,
  deleteProductService,
  findProductService,
} from "../services/prod_service.js";
import { buildImageUrl, attachImageUrls } from "../utils/urlHelper.js";

export async function getProducts(req, res) {
  try {
    let merchantId = req.user.merchant_id || null;

    if (!req.user.merchant_id && req.query.merchantId) {
      merchantId = parseInt(req.query.merchantId, 10); 
    }

    const data = await ProductsListService(req.query, merchantId);
    res.json({
      products: attachImageUrls(req, data.items),
      total: data.total,
      limit: data.limit,
      offset: data.offset,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
}


export async function searchProducts(req, res) {
  try {
    const merchantId = req.user.merchant_id || null;
    const data = await SearchProductsService(req.query, merchantId);
    res.json({
      products: attachImageUrls(req, data.items),
      total: data.total,
      limit: data.limit,
      offset: data.offset,
      q: data.q,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to search products" });
  }
}

export async function createProduct(req, res) {
  try {
    const { title, price, description, merchantId: bodyMerchantId } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    let merchantId;

    if (req.user.merchant_id) {
      merchantId = req.user.merchant_id;
    } else {
      merchantId = bodyMerchantId ? parseInt(bodyMerchantId, 10) : null;
    }

    let product = await createProductService({
      title,
      price,
      description,
      image_url,
      merchantId,
    });

    product.image_url = buildImageUrl(req, product.image_url);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateProduct(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, price, description, merchantId: bodyMerchantId } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    let merchantId;
    let overrideMerchantId;

    if (req.user.merchant_id) {
      merchantId = req.user.merchant_id;
    } else {
      overrideMerchantId = bodyMerchantId ? parseInt(bodyMerchantId, 10) : null;
    }

    const product = await updateProductService({
      id,
      title,
      price,
      description,
      image_url,
      merchantId,
      overrideMerchantId,
    });

    product.image_url = buildImageUrl(req, product.image_url);
    res.json(product);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}



export async function deleteProduct(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const { merchantId: bodyMerchantId } = req.body;

    let merchantId;

    if (req.user.merchant_id) {
      merchantId = req.user.merchant_id;
    } else {
      merchantId = bodyMerchantId ? parseInt(bodyMerchantId, 10) : null;
    }

    await deleteProductService({ id, merchantId });
    res.json({ success: true, id, merchantId });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}


export async function getProductById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const merchantId = req.user.merchant_id || null;
    let product = await findProductService({ id, merchantId });
    product.image_url = buildImageUrl(req, product.image_url);
    res.json(product);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}
