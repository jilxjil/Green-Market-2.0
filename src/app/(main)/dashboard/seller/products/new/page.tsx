"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function NewProductPage() {
    const router = useRouter()

    const [ formData, setFormData] = useState({
        title: "",
        description: "",
        category: "vegetables",
        price: "",
        stockQuantity: "",
        imageUrl: "",
    })

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        const res = await fetch("/api/products",{
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
            },
            body: JSON.stringify({
                ...formData,
                price: Number(formData.price),
                stockQuantity: Number(formData.stockQuantity)
            }),
        })

       if (!res.ok) {
        alert("Failed to create product")
        return;
       }

       router.push("/dashboard/seller/products")

    }

    return(
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create New Product</h1>
            <input
                placeholder="Product Title"
                className="border p-2 rounded"
                value={formData.title}
                onChange={(e) => setFormData({
                    ...formData,
                    title: e.target.value,
                })}
            />

            <textarea
                placeholder="Description"
                className="border p-2 rounded"
                value={formData.description}
                onChange={(e) => setFormData({
                    ...formData,
                    description: e.target.value,
                })}
            />

            <input
                placeholder="Category"
                className="border p-2 rounded"
                value={formData.category}
                onChange={(e) => setFormData({
                    ...formData,
                    category: e.target.value,
                })}
            />

            <input
                placeholder="Price"
                type="number"
                step="0.01"
                className="border p-2 rounded"
                value={formData.price}
                onChange={(e) => setFormData({
                    ...formData,
                    price: e.target.value,
                })}
            />

            <input
                placeholder="Stock Quantity"
                type="number"
                className="border p-2 rounded"
                value={formData.stockQuantity}
                onChange={(e)=> setFormData({
                    ...formData,
                    stockQuantity: e.target.value,
                })}
            />

            <input
                placeholder="Image URL"
                className="border p-2 rounded"
                value={formData.imageUrl}
                onChange={(e)=> setFormData({
                    ...formData,
                    imageUrl: e.target.value,
                })}
            />

            <Button type="submit">Create Product</Button>
        </form>
    )
}
