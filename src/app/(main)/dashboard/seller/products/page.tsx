import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function NewProductPage() {
    const router = useRouter()

    const [ formData, setFormData] = useState({
        name: "",
        description: "",
        category: "vegetables",
        price: "",
        quantity: "",
        imageUrl: "",
    })

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        const res = await fetch("/api/products/create",{
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
            },
            body: JSON.stringify({
                ...formData,
                price: Number(formData.price),
                quantity: Number(formData.quantity)
            }),
    
        })

       if (!res.ok) {
        alert("Failed to create product")
       }

       router.push("/dashboard/seller/products")
         
    }

    return(
        <form onSubmit={handleSubmit}>
            <input
                placeholder="Product Name"
                value = {formData.name}
                onChange = {(e) => setFormData({
                    ...formData,
                    name: e.target.value,})}
            />

            <input onSubmit={handleSubmit}
            placeholder = "Description"
            value = { formData.description}
            onChange = {(e) => setFormData({
                ...formData,
                description: e.target.value,
            })}
            />

            <input onSubmit={handleSubmit}
            placeholder= "Price"
            value = { formData.price}
            onChange = {(e) => setFormData({
                ...formData,
                price: e.target.value,
            })}
            />

            <input onSubmit = {handleSubmit}
            placeholder = "Quantity"
            value = { formData.quantity}
            onChange = {(e)=> setFormData({
                ...formData,
                quantity: e.target.value,
            })}
            />

            <Button type="submit">Create Product</Button>
        </form>
    )
}