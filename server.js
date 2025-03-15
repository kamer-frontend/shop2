const express = require("express")
const fs = require("fs")
const path = require("path")
const bodyParser = require("body-parser")
const cors = require("cors")

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(express.static("public"))

// Data file path - use /tmp for Vercel serverless functions
const isVercel = process.env.VERCEL === "1"
const dataDir = isVercel ? "/tmp" : path.join(__dirname, "data")
const productsFilePath = path.join(dataDir, "products.json")

// Helper functions for product operations
async function ensureDataDirectory() {
  if (!isVercel) {
    try {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
      }
    } catch (error) {
      console.error("Error creating data directory:", error)
    }
  }
}

async function getProducts() {
  await ensureDataDirectory()

  try {
    if (!fs.existsSync(productsFilePath)) {
      await fs.promises.writeFile(productsFilePath, JSON.stringify([]), "utf8")
      return []
    }

    const data = await fs.promises.readFile(productsFilePath, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading products:", error)
    return []
  }
}

async function saveProducts(products) {
  await ensureDataDirectory()

  try {
    await fs.promises.writeFile(productsFilePath, JSON.stringify(products, null, 2), "utf8")
    return true
  } catch (error) {
    console.error("Error saving products:", error)
    return false
  }
}

// API Routes
// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await getProducts()
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" })
  }
})

// Get a single product
app.get("/api/products/:id", async (req, res) => {
  try {
    const products = await getProducts()
    const product = products.find((p) => p.id === req.params.id)

    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    res.json(product)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" })
  }
})

// Create a new product
app.post("/api/products", async (req, res) => {
  try {
    const products = await getProducts()

    const newProduct = {
      id: Date.now().toString(),
      name: req.body.name,
      price: Number.parseFloat(req.body.price),
      description: req.body.description || "",
      category: req.body.category || "",
      image: req.body.image || "",
      createdAt: new Date().toISOString(),
    }

    // Validate required fields
    if (!newProduct.name || isNaN(newProduct.price)) {
      return res.status(400).json({ error: "Name and valid price are required" })
    }

    products.push(newProduct)

    if (await saveProducts(products)) {
      res.status(201).json(newProduct)
    } else {
      res.status(500).json({ error: "Failed to save product" })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" })
  }
})

// Update a product
app.put("/api/products/:id", async (req, res) => {
  try {
    const products = await getProducts()
    const index = products.findIndex((p) => p.id === req.params.id)

    if (index === -1) {
      return res.status(404).json({ error: "Product not found" })
    }

    // Update product fields
    products[index] = {
      ...products[index],
      name: req.body.name || products[index].name,
      price: req.body.price ? Number.parseFloat(req.body.price) : products[index].price,
      description: req.body.description !== undefined ? req.body.description : products[index].description,
      category: req.body.category !== undefined ? req.body.category : products[index].category,
      image: req.body.image !== undefined ? req.body.image : products[index].image,
    }

    if (await saveProducts(products)) {
      res.json(products[index])
    } else {
      res.status(500).json({ error: "Failed to update product" })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" })
  }
})

// Delete a product
app.delete("/api/products/:id", async (req, res) => {
  try {
    const products = await getProducts()
    const filteredProducts = products.filter((p) => p.id !== req.params.id)

    if (filteredProducts.length === products.length) {
      return res.status(404).json({ error: "Product not found" })
    }

    if (await saveProducts(filteredProducts)) {
      res.json({ success: true })
    } else {
      res.status(500).json({ error: "Failed to delete product" })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" })
  }
})

// Serve HTML pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"))
})

// For Vercel serverless deployment
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

// Export for Vercel
module.exports = app

