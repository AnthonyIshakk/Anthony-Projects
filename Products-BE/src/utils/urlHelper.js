export function buildImageUrl(req, relativePath) {
  if (!relativePath) return null;
  return `${req.protocol}://${req.get("host")}${relativePath}`;
}

export function attachImageUrls(req, products) {
  return products.map((p) => ({
    ...p,
    image_url: buildImageUrl(req, p.image_url),
  }));
}
