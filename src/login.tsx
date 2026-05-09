import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

type User = {
	id: number;
	username: string;
	age: number;
	birthday: string;
	country: string;
	password: string;
};

export const Login = () => {
	const navigate = useNavigate();
	const [name, setName] = useState('');
	const [age, setAge] = useState('');
	const [birthday, setBirthday] = useState('');
	const [country, setCountry] = useState('');
	const [password, setPassword] = useState('');
	const [loginName, setLoginName] = useState('');
	const [loginPassword, setLoginPassword] = useState('');
	const [loading, setLoading] = useState(false);

	const register = async () => {
		if (!name.trim() || !age || !birthday || !country.trim() || !password) {
			alert('Completa todos los campos para registrarte');
			return;
		}

		const users = await axios.get<User[]>(`${import.meta.env.VITE_API_URL}/user`);
		console.log(users.data);
		if (users.data.some((user) => user.username === name.trim())) {
			alert(`Nombre de usuario no disponible intenta otra vez`);
			return;
		}

		try {
			setLoading(true);
			const res = await axios.post(`${import.meta.env.VITE_API_URL}/user`, {
				username: name.trim(),
				age: parseInt(age, 10),
				birthday,
				country: country.trim(),
				password,
			});

			console.log('usuario creado:', res.data);
			alert('usuario registrado exitosamente');
			navigate('/home', {
				state: { nombre: res.data.user.username, user: res.data.user },
			});
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error(error.response?.data || error.message);
				alert('Error al registrar usuario');
			}
		} finally {
			setLoading(false);
		}
	};

	const login = async () => {
		if (!loginName.trim() || !loginPassword) {
			alert('Ingresa usuario y contraseña');
			return;
		}

		try {
			setLoading(true);
			const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/login`, {
				username: loginName.trim(),
				password: loginPassword,
			});
			console.log(res.data);
			navigate('/home', {
				state: { nombre: res.data.user.username, user: res.data.user },
			});
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error(error.response?.data || error.message);
				alert(error.response?.data?.message || 'Error al iniciar sesión');
                
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<main className="container py-5">
				<header className="text-center mb-5">
					<h1 className="fw-bold">Bienvenido</h1>
				</header>

				<div className="row g-4 justify-content-center">
					{/* Registro */}
					<section className="col-12 col-md-5">
						<div className="card shadow-sm p-4 h-100">
							<h3 className="text-center mb-4">Registrate</h3>

							<label htmlFor="name">Nombre:</label>
							<input
								type="text"
								className="name form-control mb-3"
								placeholder="nombre"
								onChange={(e) => setName(e.target.value)}
							/>

							<label htmlFor="edad">Edad:</label>
							<input
								type="number"
								className="edad form-control mb-3"
								placeholder="edad"
								onChange={(e) => setAge(e.target.value)}
							/>

							<label htmlFor="birthday">fecha de nacimiento:</label>
							<input
								type="date"
								className="birthday form-control mb-3"
								placeholder="fecha de nacimiento"
								onChange={(e) => setBirthday(e.target.value)}
							/>

							<label htmlFor="pais">Pais:</label>
							<input
								type="text"
								className="pais form-control mb-3"
								placeholder="pais"
								onChange={(e) => setCountry(e.target.value)}
							/>

							<label htmlFor="password">Contraseña</label>
							<input
								type="password"
								className="password form-control mb-4"
								placeholder="contraseña"
								onChange={(e) => setPassword(e.target.value)}
							/>

							<button
								className="btn btn-primary w-100 fw-semibold"
								onClick={register}
								disabled={loading}
							>
								{loading ? (
									<>
										<span
											className="spinner-border spinner-border-sm me-2"
											role="status"
										></span>
										Registrando...
									</>
								) : (
									'Registrar'
								)}
							</button>
						</div>
					</section>

					{/* Login */}
					<section className="col-12 col-md-5">
						<div className="card shadow-sm p-4 h-100">
							<h3 className="text-center mb-4">Iniciar Sesión</h3>

							<input
								type="text"
								className="form-control mb-3"
								placeholder="nombre de usuario"
								value={loginName}
								onChange={(e) => setLoginName(e.target.value)}
							/>
							<input
								type="password"
								className="form-control mb-4"
								placeholder="contraseña"
								value={loginPassword}
								onChange={(e) => setLoginPassword(e.target.value)}
							/>

							<button
								className="btn btn-success w-100 fw-semibold"
								onClick={login}
								disabled={loading}
							>
								{loading ? (
									<>
										<span
											className="spinner-border spinner-border-sm me-2"
											role="status"
										></span>
										Ingresando...
									</>
								) : (
									'Iniciar Sesión'
								)}
							</button>
						</div>
					</section>
				</div>
			</main>
		</>
	);
};