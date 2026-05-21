"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetupClient({ userId }: { userId: string }) {
  const [role, setRole] = useState("buyer");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async () => {
    setLoading(true);

    const res = await fetch("/api/profile/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role }),
    });

    if (res.ok) {
      router.push("/dashboard");
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>Complete Setup</h1>

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="buyer">Buyer</option>
        <option value="seller">Seller</option>
        <option value="expert">Expert</option>
      </select>

      <button onClick={submit} disabled={loading}>
        Continue
      </button>
    </div>
  );
}