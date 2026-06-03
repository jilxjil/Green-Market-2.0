"use client";

import { Bell, CheckCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { NotificationListSkeleton } from "@/components/loading/page-skeletons";

interface Notification {
  id: string;
  title: string;
  body: string;
  metadata: {
    href?: string;
  } | null;
  readAt: string | null;
  createdAt: string;
}

export default function Notifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const [markingReadId, setMarkingReadId] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch("/api/notifications")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Unable to load notifications.");
        }

        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setNotifications(data);
        }
      })
      .catch(() => {
        setError("Unable to load notifications.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!isOpen) return;
      const target = event.target as Node | null;
      if (target && rootRef.current?.contains(target)) return;
      setIsOpen(false);
    }
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  async function markAllRead() {
    setMarkingAllRead(true);
    const res = await fetch("/api/notifications", { method: "PATCH" });
    setMarkingAllRead(false);

    if (!res.ok) {
      toast.error("Unable to mark notifications as read.");
      return;
    }

    setNotifications((prev) =>
      prev.map((n) => ({ ...n, readAt: new Date().toISOString() }))
    );
  }

  async function markRead(id: string) {
    setMarkingReadId(id);
    const res = await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setMarkingReadId(null);

    if (!res.ok) {
      toast.error("Unable to mark notification as read.");
      return false;
    }

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
    );
    return true;
  }

  async function openNotification(notification: Notification) {
    if (!notification.readAt) {
      const marked = await markRead(notification.id);
      if (!marked) return;
    }

    if (notification.metadata?.href?.startsWith("/")) {
      setIsOpen(false);
      router.push(notification.metadata.href);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        onClick={() => setIsOpen((open) => !open)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-lg border bg-popover shadow-md z-50">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                disabled={markingAllRead}
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline disabled:pointer-events-none disabled:opacity-50"
              >
                <CheckCheck className="h-3 w-3" />
                {markingAllRead ? "Saving..." : "Mark all read"}
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto p-2">
            {isLoading ? (
              <NotificationListSkeleton />
            ) : error ? (
              <div className="p-4 text-center text-sm text-destructive">
                {error}
              </div>
            ) : notifications.length === 0 ? (
              <p className="p-4 text-center text-sm text-muted-foreground">
                No notifications
              </p>
            ) : (
              notifications.map((n) => (
                <button
                  type="button"
                  key={n.id}
                  className={`mb-1 w-full cursor-pointer rounded-md p-3 text-left text-sm transition hover:bg-muted ${
                    !n.readAt ? "bg-muted/50 font-medium" : "text-muted-foreground"
                  }`}
                  disabled={markingReadId === n.id}
                  onClick={() => openNotification(n)}
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-semibold text-foreground">{n.title}</span>
                    {!n.readAt && (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    )}
                  </span>
                  <p className="mt-1 line-clamp-2">{n.body}</p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
