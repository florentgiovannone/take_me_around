import { useLocation } from "react-router-dom"

export const RESTAURANT_SLUGS = ["buddysdeli", "mme-betty"] as const

export type RestaurantSlug = (typeof RESTAURANT_SLUGS)[number]

export function restaurantSlugFromPath(pathname: string): RestaurantSlug {
  const segment = pathname.split("/").filter(Boolean)[0]
  if (segment === "mme-betty") return "mme-betty"
  return "buddysdeli"
}

export function useRestaurantBase(): string {
  const { pathname } = useLocation()
  return `/${restaurantSlugFromPath(pathname)}`
}

export function restaurantHref(base: string, href: string): string {
  if (href.startsWith("#") || href.startsWith("/")) return `${base}${href}`
  return href
}
