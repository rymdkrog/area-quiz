import './tailwind.css'
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import { SoundContext } from './sound-context'
import { useState } from 'react'
import { useSound } from './use-sound'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full min-h-screen">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔳</text></svg>"
        />
        <script src="https://cdn.usefathom.com/script.js" data-spa="auto" data-site="KZYLEKFH" defer></script>
      </head>
      <body className="h-full flex flex-col">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  const [playToggleOn] = useSound('/sounds/toggle_on.wav')
  const [playToggleOff] = useSound('/sounds/toggle_off.wav')
  const [soundEnabled, setSoundEnabled] = useState(true)

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev)
    if (soundEnabled) {
      playToggleOff()
    } else {
      playToggleOn()
    }
  }

  return (
    <SoundContext.Provider value={{ enabled: soundEnabled }}>
      <main className="flex flex-col">
        <div className="mx-auto mt-10 flex flex-col w-[300px] text-center">
          <h1 className="text-4xl font-bold">Guess the area</h1>
          <Outlet />
        </div>
      </main>
      <footer className="w-full bg-contain mt-auto pt-24 flex flex-col items-center">
        <div className="flex gap-3 items-center mb-4">
          <a href="https://github.com">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-6 w-6 fill-slate-600 hover:fill-slate-900"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0 1 12 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2Z"
              ></path>
            </svg>
          </a>
          <button className="text-slate-500 hover:text-slate-900" onClick={toggleSound}>
            {soundEnabled ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                />
              </svg>
            )}
          </button>
        </div>

        <a href="https://rymdkrog.world" target="_blank" rel="noreferrer" className="w-full h-6 block">
          <svg
            height="100%"
            width="100%"
            preserveAspectRatio="none"
            viewBox="0 0 322 92"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="322" height="23" fill="#F0AE42" />
            <rect y="23" width="322" height="23" fill="#F07B0F" />
            <rect y="69" width="322" height="23" fill="#6E2673" />
            <rect y="46" width="322" height="23" fill="#B43331" />
          </svg>
          <span className="sr-only">Made by RYMDKROG</span>
        </a>
      </footer>
    </SoundContext.Provider>
  )
}

export function HydrateFallback() {
  return <p>Loading...</p>
}
