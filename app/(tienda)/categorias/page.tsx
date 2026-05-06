export default function PaginaGeneros() {
  return (
    <div>
      <h1 className="text-2xl font-bold">📂 Todas las Categorías</h1>
      <ul className="mt-4 space-y-2">
        <li><a href="/categorias/accion" className="text-blue-600 underline">Acción</a></li>
        <li><a href="/categorias/rpg" className="text-blue-600 underline">RPG</a></li>
        <li><a href="/categorias/deportes" className="text-blue-600 underline">Deportes</a></li>
      </ul>
    </div>
  )
}