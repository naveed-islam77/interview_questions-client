// API functions for category management
// Replace with your actual backend API endpoints

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:5000/category"

export const categoryApi = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/category/all/categories`)
    console.log("response", response)
    if (!response.ok) throw new Error("Failed to fetch categories")
    return response.json()
  },

  async getById(id: string) {
    const response = await fetch(`${API_BASE_URL}/category/single/${id}`)
    if (!response.ok) throw new Error("Failed to fetch category")
    return response.json()
  },

  async create(data: { category: string; category_image?: string }) {
    const response = await fetch(`${API_BASE_URL}/category/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to create category")
    return response.json()
  },

  async update(id: string, data: { category: string; category_image?: string }) {
    const response = await fetch(`${API_BASE_URL}/category/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to update category")
    return response.json()
  },

  async delete(id: string) {
    const response = await fetch(`${API_BASE_URL}/category/delete/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete category")
    return response.json()
  },
}
