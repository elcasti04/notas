import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

type Nota = {
	id: number;
	titulo: string;
	texto: string;
	fecha: string;
	userId: number;
};

export const Home = () => {
	const [texto, setTexto] = useState('');
	const [titulo, setTitulo] = useState('');
	const [notas, setNotas] = useState<Nota[]>([]);
	const [verNotas, setVerNotas] = useState(false);
	const [loading, setLoading] = useState(false);

	const colores = [
		'#FFE5B4',
		'#E5F2FF',
		'#E5FFE5',
		'#FFFFE5',
		'#FFE5F2',
		'#E5FFFF',
		'#F0E5FF',
	];

	const navigate = useNavigate();
	const location = useLocation();
	const nombre = location.state?.nombre;
	const user = location.state?.user;

	const guardarNota = async () => {
		if (texto.trim() === '') return;

		try {
			const res = await axios.post(`${import.meta.env.VITE_API_URL}/notas`, {
				titulo: titulo.trim(),
				texto: texto.trim(),
				fecha: new Date(),
				userId: user.id,
			});

			setNotas([...notas, res.data]);
			alert('Nota guardada');

			setLoading(true);
			setTimeout(() => {
				setLoading(false);
				getNotas();
			}, 2000);

			setTexto('');
			setTitulo('');
		} catch (error) {
			console.error(error);
		}
	};

	const getNotas = async () => {
		setLoading(true);
		try {
			const res = await axios.get(
				`${import.meta.env.VITE_API_URL}/notas/user/${user.id}`,
			);
			setNotas(res.data);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const eliminarNota = async (id: number) => {
		try {
			await axios.delete(`${import.meta.env.VITE_API_URL}/notas/${id}`);
			setLoading(true);

			setNotas(notas.filter((nota) => nota.id !== id));

			setTimeout(() => {
				setLoading(false);
				getNotas();
			}, 2000);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<main className="container py-5">
			{/* HEADER */}
			<header className="d-flex justify-content-between align-items-center mb-4">
				<h2 className="fw-bold">Hola, {nombre} 😉</h2>

				<button
					className="btn btn-outline-primary"
					onClick={() => navigate('/perfil', { state: { user } })}
				>
					Perfil
				</button>
			</header>

			<div className="row g-4">
				{/* CREAR NOTA */}
				<section className="col-12 col-md-6">
					<div className="card shadow-sm border-0 h-100">
						<div className="card-body">
							<h4 className="mb-3 text-primary">Crear Nota</h4>

							<input
								value={titulo}
								onChange={(e) => setTitulo(e.target.value)}
								className="form-control mb-3"
								placeholder="Título"
							/>

							<textarea
								value={texto}
								onChange={(e) => setTexto(e.target.value)}
								className="form-control mb-3"
								rows={4}
								placeholder="Escribe tu nota..."
							/>

							<button
								className="btn btn-primary w-100 fw-semibold"
								onClick={guardarNota}
							>
								Guardar nota
							</button>
						</div>
					</div>
				</section>

				{/* LISTAR NOTAS */}
				<section className="col-12 col-md-6">
					<div className="card shadow-sm border-0 h-100">
						<div className="card-body">
							<h4 className="text-center mb-3">Notas</h4>

							<button
								className="btn btn-outline-primary w-100 mb-3"
								onClick={() => {
									if (verNotas) {
										setVerNotas(false);
										setNotas([]);
									} else {
										setVerNotas(true);
										getNotas();
									}
								}}
							>
								{verNotas ? 'Ocultar notas' : 'Ver notas'}
							</button>

							{/* LOADING */}
							{loading && (
								<div className="text-center">
									<div className="spinner-border text-primary"></div>
								</div>
							)}

							{/* SIN NOTAS */}
							{!loading && verNotas && notas.length === 0 && (
								<p className="text-center text-muted">No hay notas</p>
							)}

							<div style={{ maxHeight: '250px', overflowY: 'auto' }}>
								{!loading &&
									verNotas &&
									notas.map((nota, index) => (
										<div
											key={nota.id}
											className="d-flex justify-content-between align-items-center mb-2 p-3 rounded-3 shadow-sm"
											style={{
												backgroundColor:
													colores[index % colores.length],
											}}
										>
											<p className="mb-0">
												<strong>{index + 1}) </strong>
												<strong>{nota.titulo}:</strong> {nota.texto}
											</p>

											<button
												className="btn btn-sm btn-danger"
												onClick={() => eliminarNota(nota.id)}
											>
												✕
											</button>
										</div>
									))}
							</div>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
};