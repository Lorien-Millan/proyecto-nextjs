export default async function PaginaDetalleCategoria({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <div>
      <h1 className="text-2xl font-bold"> Categoría: {slug}</h1>
      <p>Aquí se listarán los juegos de esta categoría.</p>
    </div>
  )
}