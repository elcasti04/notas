import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

export const Perfil = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const user = location.state?.user;

	type User = {
		id: number;
		username: string;
		age: number;
		birthday: string;
		country: string;
		password: string;
	};

	const [infoUser, setInfoUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(false);

	// 🔒 PROTECCIÓN CLAVE
	if (!user) {
		return (
			<div className="container vh-100 d-flex flex-column justify-content-center align-items-center">
				<div className="alert alert-warning text-center shadow-sm">
					<h4>No hay usuario</h4>
					<button
						className="btn btn-primary mt-3"
						onClick={() => navigate('/')}
					>
						Volver al inicio
					</button>
				</div>
			</div>
		);
	}

	const info = async () => {
		try {
			setLoading(true);

			const res = await axios.get(
				`${import.meta.env.VITE_API_URL}/user/${user.id}`
			);

			setInfoUser(res.data);
		} catch (error) {
			console.error(error);
			alert('Error al cargar usuario');
		} finally {
			setLoading(false);
		}
	};

    const deleteUser =  async () => {
        try {
            setLoading(true);
            const res = await axios.delete(`${import.meta.env.VITE_API_URL}/user/${user.id}`)
            console.log(res.data)
            alert('usuario eliminado')
            navigate('/')
        } catch (error) {
            console.error(error)
        }
    }

	return (
		<div className="container py-5 d-flex justify-content-center">
			<div className="w-100" style={{ maxWidth: '600px' }}>

				{/* Header */}
				<div className="d-flex justify-content-between align-items-center mb-4">
					<button
						className="btn btn-outline-secondary"
						onClick={() => navigate('/')}
					>
						⬅ Volver
					</button>

					<h4 className="fw-bold m-0">Perfil</h4>

					<div style={{ width: '90px' }}></div>
				</div>

				{/* Botón */}
				<div className="d-grid mb-4">
					<button
						className="btn btn-primary py-2 fw-semibold"
						onClick={info}
						disabled={loading}
					>
						{loading ? (
							<>
								<span className="spinner-border spinner-border-sm me-2"></span>
								Cargando...
							</>
						) : (
							'Ver información'
						)}
					</button>
				</div>

				{/* Card */}
				{infoUser && (
					<div className="card shadow border-0">
						<div className="card-body">

							<h3 className="text-center mb-4 fw-bold text-primary">
								{infoUser.username.toUpperCase()}
							</h3>

							<ul className="list-group list-group-flush">

								<li className="list-group-item d-flex justify-content-between">
									<strong>Usuario</strong>
									<span className="text-muted">{infoUser.username}</span>
								</li>

								<li className="list-group-item d-flex justify-content-between">
									<strong>Edad</strong>
									<span className="text-muted">{infoUser.age}</span>
								</li>

								<li className="list-group-item d-flex justify-content-between">
									<strong>Nacimiento</strong>
									<span className="text-muted">
										{new Date(infoUser.birthday).toLocaleDateString('es-CO', {
											day: 'numeric',
											month: 'long',
											year: 'numeric',
										})}
									</span>
								</li>

								<li className="list-group-item d-flex justify-content-between">
									<strong>País</strong>
									<span className="text-muted">{infoUser.country}</span>
								</li>

								<li className="list-group-item d-flex justify-content-between">
									<strong>Contraseña</strong>
									<span className="text-muted">{infoUser.password}</span>
								</li>

							</ul>


                            <button className="text-center mb-4 fw-bold text-primary" onClick={deleteUser}>eliminar usuario</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};