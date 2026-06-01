"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ExpertService {
  id: string;
  title: string;
  description: string | null;
  price: number;
  durationMinutes: number;
  archivedAt: string | null;
  createdAt: string;
}

const emptyForm = {
  title: "",
  description: "",
  price: "",
  durationMinutes: "60",
};

export default function ExpertServicesManager() {
  const [services, setServices] = useState<ExpertService[]>([]);
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadServices() {
    const res = await fetch("/api/expert-services");
    const data = await res.json().catch(() => []);

    if (!res.ok) {
      setError(data.error || "Unable to load services.");
      setLoading(false);
      return;
    }

    setServices(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    loadServices();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch("/api/expert-services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        price: Number(formData.price),
        durationMinutes: Number(formData.durationMinutes),
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "Unable to create service.");
      setSaving(false);
      return;
    }

    setFormData(emptyForm);
    await loadServices();
    setSaving(false);
  }

  async function archiveService(serviceId: string) {
    setError("");

    const res = await fetch(`/api/expert-services/${serviceId}`, {
      method: "DELETE",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "Unable to archive service.");
      return;
    }

    await loadServices();
  }

  const activeServices = services.filter((service) => !service.archivedAt);

  if (loading) {
    return <p className="text-muted-foreground">Loading services...</p>;
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleCreate}
        className="grid gap-4 rounded-lg border bg-card p-6 md:grid-cols-2"
      >
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Service title</Label>
          <Input
            id="title"
            placeholder="e.g. Soil health consultation"
            value={formData.title}
            onChange={(e) =>
              setFormData((current) => ({ ...current, title: e.target.value }))
            }
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="What buyers can expect from this service"
            value={formData.description}
            onChange={(e) =>
              setFormData((current) => ({
                ...current,
                description: e.target.value,
              }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (GH₵)</Label>
          <Input
            id="price"
            type="number"
            min={1}
            value={formData.price}
            onChange={(e) =>
              setFormData((current) => ({ ...current, price: e.target.value }))
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="durationMinutes">Duration (minutes)</Label>
          <Input
            id="durationMinutes"
            type="number"
            min={15}
            step={15}
            value={formData.durationMinutes}
            onChange={(e) =>
              setFormData((current) => ({
                ...current,
                durationMinutes: e.target.value,
              }))
            }
            required
          />
        </div>

        {error && (
          <p className="text-sm text-destructive md:col-span-2">{error}</p>
        )}

        <div className="md:col-span-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Creating..." : "Add service"}
          </Button>
        </div>
      </form>

      {activeServices.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
          No active services yet. Add your first consultation offering above.
        </div>
      ) : (
        <div className="space-y-4">
          {activeServices.map((service) => (
            <article
              key={service.id}
              className="flex flex-col gap-4 rounded-lg border bg-card p-5 sm:flex-row sm:items-start sm:justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold">{service.title}</h2>
                {service.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {service.description}
                  </p>
                )}
                <p className="mt-3 text-sm text-muted-foreground">
                  GH₵ {service.price} · {service.durationMinutes} minutes
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => archiveService(service.id)}
              >
                <Trash2 className="h-4 w-4" />
                Archive
              </Button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
