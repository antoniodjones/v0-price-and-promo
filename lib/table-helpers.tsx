"use client"

import { useState, useMemo } from "react"

/**
 * Hook for managing table sorting state
 * Single Responsibility: Only handles sorting logic
 */
export function useTableSort<T>(data: T[], initialSortKey?: keyof T, initialSortDirection: "asc" | "desc" = "asc") {
  const [sortKey, setSortKey] = useState<keyof T | undefined>(initialSortKey)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(initialSortDirection)

  const sortedData = useMemo(() => {
    if (!sortKey) return data

    return [...data].sort((a, b) => {
      const aValue = a[sortKey]
      const bValue = b[sortKey]

      if (aValue === bValue) return 0

      const comparison = aValue < bValue ? -1 : 1
      return sortDirection === "asc" ? comparison : -comparison
    })
  }, [data, sortKey, sortDirection])

  const toggleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDirection("asc")
    }
  }

  return {
    sortedData,
    sortKey,
    sortDirection,
    toggleSort,
  }
}

/**
 * Hook for managing table filtering
 * Single Responsibility: Only handles filter logic
 */
export function useTableFilter<T>(data: T[], filterFn: (item: T, query: string) => boolean) {
  const [filterQuery, setFilterQuery] = useState("")

  const filteredData = useMemo(() => {
    if (!filterQuery.trim()) return data
    return data.filter((item) => filterFn(item, filterQuery))
  }, [data, filterQuery, filterFn])

  return {
    filteredData,
    filterQuery,
    setFilterQuery,
  }
}

/**
 * Hook for managing table pagination
 * Single Responsibility: Only handles pagination logic
 */
export function useTablePagination<T>(data: T[], itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(data.length / itemsPerPage)

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return data.slice(startIndex, endIndex)
  }, [data, currentPage, itemsPerPage])

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const nextPage = () => goToPage(currentPage + 1)
  const previousPage = () => goToPage(currentPage - 1)

  return {
    paginatedData,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    previousPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  }
}

/**
 * Hook for managing row selection
 * Single Responsibility: Only handles selection logic
 */
export function useTableSelection<T extends { id: string }>(data: T[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const isSelected = (id: string) => selectedIds.has(id)

  const isAllSelected = data.length > 0 && selectedIds.size === data.length

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setSelectedIds(newSelection)
  }

  const toggleAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(data.map((item) => item.id)))
    }
  }

  const clearSelection = () => setSelectedIds(new Set())

  const selectedItems = data.filter((item) => selectedIds.has(item.id))

  return {
    selectedIds,
    selectedItems,
    isSelected,
    isAllSelected,
    toggleSelection,
    toggleAll,
    clearSelection,
    selectedCount: selectedIds.size,
  }
}

/**
 * Combines all table hooks for complete table management
 * Follows Composition over Inheritance principle
 */
export function useDataTable<T extends { id: string }>(
  data: T[],
  options: {
    initialSortKey?: keyof T
    initialSortDirection?: "asc" | "desc"
    filterFn?: (item: T, query: string) => boolean
    itemsPerPage?: number
  } = {},
) {
  const { initialSortKey, initialSortDirection = "asc", filterFn = () => true, itemsPerPage = 10 } = options

  // Apply filters first
  const { filteredData, filterQuery, setFilterQuery } = useTableFilter(data, filterFn)

  // Then apply sorting
  const { sortedData, sortKey, sortDirection, toggleSort } = useTableSort(
    filteredData,
    initialSortKey,
    initialSortDirection,
  )

  // Then apply pagination
  const { paginatedData, currentPage, totalPages, goToPage, nextPage, previousPage, hasNextPage, hasPreviousPage } =
    useTablePagination(sortedData, itemsPerPage)

  // Selection works on paginated data
  const selection = useTableSelection(paginatedData)

  return {
    // Data
    data: paginatedData,
    totalItems: filteredData.length,

    // Filtering
    filterQuery,
    setFilterQuery,

    // Sorting
    sortKey,
    sortDirection,
    toggleSort,

    // Pagination
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    previousPage,
    hasNextPage,
    hasPreviousPage,

    // Selection
    ...selection,
  }
}
