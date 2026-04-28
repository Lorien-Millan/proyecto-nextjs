import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="text-center mt-10">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2">Página no encontrada</p>
      <Link href="/" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded">
        Volver al inicio
      </Link>
    </div>
  )
}