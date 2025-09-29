// Service Worker for Push Notifications
const CACHE_NAME = "gti-pricing-engine-v1"
const urlsToCache = ["/", "/favicon.ico"]

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
})

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request)
    }),
  )
})

// Push event for notifications
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "New notification from GTI Pricing Engine",
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "View Details",
        icon: "/favicon.ico",
      },
      {
        action: "close",
        title: "Close",
        icon: "/favicon.ico",
      },
    ],
  }

  event.waitUntil(self.registration.showNotification("GTI Pricing Engine", options))
})

// Notification click event
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "explore") {
    // Open the app
    event.waitUntil(clients.openWindow("/"))
  }
})
