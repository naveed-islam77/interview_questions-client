// API functions for question management
// Replace with your actual backend API endpoints

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:5000"

interface QuestionData {
  question: string
  answer: {
    definition: string
    code_example?: string
    output?: string
  }
  category: string
}

export const questionApi = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/category/686002aa87a86a4a9fda0466`)
    if (!response.ok) throw new Error("Failed to fetch questions")
    return response.json()
  },

  async getById(id: string) {
    const response = await fetch(`${API_BASE_URL}/${id}`)
    if (!response.ok) throw new Error("Failed to fetch question")
    return response.json()
  },

  async getByCategory(categoryId: string) {
    const response = await fetch(`${API_BASE_URL}/category/${categoryId}`)
    if (!response.ok) throw new Error("Failed to fetch questions")
    return response.json()
  },

  async create(data: QuestionData) {
    const response = await fetch(`${API_BASE_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to create question")
    return response.json()
  },

  async update(id: string, data: QuestionData) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to update question")
    return response.json()
  },

  async delete(id: string) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete question")
    return response.json()
  },
}
