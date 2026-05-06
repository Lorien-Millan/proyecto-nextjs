export default async function PaginaDetallesJuego({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div>
      <h1 className="text-2xl font-bold">🎮 Detalle del Juego #{id}</h1>
      <footer>
        <p>Portada, descripción, precio y botón de compra irán aquí.</p>
      </footer>
    </div>
  )
}