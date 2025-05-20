"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DebugStorage() {
  const [storageData, setStorageData] = useState<Record<string, string>>({})
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isVisible) {
      const data: Record<string, string> = {}
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) {
          const value = localStorage.getItem(key) || ""
          data[key] = value.length > 100 ? value.substring(0, 100) + "..." : value
        }
      }
      setStorageData(data)
    }
  }, [isVisible])

  const clearStorage = () => {
    if (confirm("Are you sure you want to clear all localStorage data?")) {
      localStorage.clear()
      setStorageData({})
    }
  }

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 bg-gray-800 hover:bg-gray-700 text-xs"
        size="sm"
      >
        Debug Storage
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-96 bg-gray-800 border-gray-700 text-white shadow-xl">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm">LocalStorage Debug</CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={() => setStorageData({})}
              variant="outline"
              size="sm"
              className="h-7 text-xs bg-gray-700 hover:bg-gray-600"
            >
              Refresh
            </Button>
            <Button onClick={clearStorage} variant="destructive" size="sm" className="h-7 text-xs">
              Clear All
            </Button>
            <Button
              onClick={() => setIsVisible(false)}
              variant="outline"
              size="sm"
              className="h-7 text-xs bg-gray-700 hover:bg-gray-600"
            >
              Close
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="max-h-80 overflow-auto">
        {Object.keys(storageData).length === 0 ? (
          <p className="text-gray-400 text-sm">No localStorage data found</p>
        ) : (
          <div className="space-y-2">
            {Object.entries(storageData).map(([key, value]) => (
              <div key={key} className="border border-gray-700 rounded p-2">
                <div className="font-semibold text-xs text-blue-400">{key}</div>
                <div className="text-xs text-gray-300 break-all">{value}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
