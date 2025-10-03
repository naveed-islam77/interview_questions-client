// API functions for category management
// Replace with your actual backend API endpoints

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/category"

export const categoryApi = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/all/categories`)
    console.log("response", response)
    if (!response.ok) throw new Error("Failed to fetch categories")
    return response.json()
  },

  async getById(id: string) {
    const response = await fetch(`${API_BASE_URL}/single/${id}`)
    if (!response.ok) throw new Error("Failed to fetch category")
    return response.json()
  },

  async create(data: { category: string; category_image?: string }) {
    const response = await fetch(`${API_BASE_URL}/create`, {
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
    const response = await fetch(`${API_BASE_URL}/update/${id}`, {
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
    const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete category")
    return response.json()
  },
}
