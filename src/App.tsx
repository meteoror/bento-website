import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Gallery from './pages/Gallery'

export default function App() {
  // load shared icons and the support widget once for every route
  useEffect(() => {
    const iconStylesheet = document.createElement('link')
    iconStylesheet.rel = 'stylesheet'
    iconStylesheet.href =
      'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css'
    document.head.appendChild(iconStylesheet)

    // wait for ko fi to load before creating its floating support button
    const widgetScript = document.createElement('script')
    widgetScript.src = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js'
    widgetScript.async = true
    widgetScript.onload = () => {
      const widget = (
        window as Window & {
          kofiWidgetOverlay?: {
            draw: (username: string, options: Record<string, string>) => void
          }
        }
      ).kofiWidgetOverlay

      widget?.draw('91nevolt', {
        type: 'floating-chat',
        'floating-chat.donateButton.text': 'Support me',
        'floating-chat.donateButton.background-color': '#00ff88',
        'floating-chat.donateButton.text-color': '#000',
      })
    }
    document.body.appendChild(widgetScript)

    // remove the stylesheet and script when the app unmounts
    return () => {
      iconStylesheet.remove()
      widgetScript.remove()
    }
  }, [])

  return (
    // match each url to its page component
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/gallery" element={<Gallery />} />
    </Routes>
  )
}
