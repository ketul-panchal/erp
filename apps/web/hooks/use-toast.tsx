import { useState } from "react"

type ToastProps = {
  title: string
  description?: string
  duration?: number
}

export function toast({ title, description, duration = 3000 }: ToastProps) {
  // Simple implementation - in a real app, you'd use a more robust solution
  console.log(`Toast: ${title}${description ? ` - ${description}` : ''}`)
  
  // Create a DOM element for the toast
  const toastElement = document.createElement('div')
  toastElement.className = 'fixed top-4 right-4 z-50 bg-black text-white p-4 rounded-md shadow-lg max-w-md'
  
  const titleElement = document.createElement('h3')
  titleElement.className = 'font-medium'
  titleElement.textContent = title
  toastElement.appendChild(titleElement)
  
  if (description) {
    const descElement = document.createElement('p')
    descElement.className = 'text-sm text-gray-200 mt-1'
    descElement.textContent = description
    toastElement.appendChild(descElement)
  }
  
  document.body.appendChild(toastElement)
  
  // Remove after duration
  setTimeout(() => {
    toastElement.classList.add('opacity-0', 'transition-opacity')
    setTimeout(() => {
      document.body.removeChild(toastElement)
    }, 300)
  }, duration)
}