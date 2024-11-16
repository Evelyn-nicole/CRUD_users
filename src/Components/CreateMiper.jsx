import React, { useState, useEffect } from 'react';
import { db } from '../FireBaseConfig/FireBase';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import '../Styles/CreateMiper.css';

const CreateMiper = () => {
    const { id: userId } = useParams();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [miperDetails, setMiperDetails] = useState({
        hazardDescription: '',
        specificArea: '',
        probability: '',
        severity: '',
        riskValue: '',
        riskClassification: '',
        riskColor: '',
        existingControls: '',
        recommendedControls: '',
        task: '',
        activityType: '',
        hazardSource: '',
        associatedRisks: '',
        possibleInjuries: '',
        legalRequirements: '',
        operationalControl: '',
        controlMeasures: '',
        frequency: '',
        responsiblePerson: '',
        responsibleRole: '',

    });

    // obtencion de datos del usuario
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userDoc = doc(db, `users/${userId}`);
                const userSnapshot = await getDoc(userDoc);
                if (userSnapshot.exists()) {
                    setUser(userSnapshot.data());
                } else {
                    console.error('¡El documento no existe!');
                }
            } catch (error) {
                console.error('Error al obtener los datos del usuario:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) {
            fetchUser();
        } else {
            console.error('No se encontró el ID del usuario en la URL');
            setIsLoading(false);
        }
    }, [userId]);

    // manejo de cambios
    const handleChange = (e) => {
        const { name, value } = e.target;
        setMiperDetails({
            ...miperDetails,
            [name]: value,
        });

        if (name === 'probability' || name === 'severity') {
            calculateRiskLevel(name === 'probability' ? value : miperDetails.probability, name === 'severity' ? value : miperDetails.severity);
        }
    };

    //calculo del nivel de riesgo
    const calculateRiskLevel = (probability, severity) => {
        const prob = parseInt(probability) || 0;
        const sev = parseInt(severity) || 0;
        if (prob && sev) {
            const riskValue = prob * sev;
            let riskClassification = '';
            let riskColor = '';

            if (riskValue <= 5) {
                riskClassification = 'Leve';
                riskColor = 'green';
            } else if (riskValue <= 12) {
                riskClassification = 'Moderado';
                riskColor = 'yellow';
            } else if (riskValue <= 20) {
                riskClassification = 'Alto';
                riskColor = 'orange';
            } else {
                riskClassification = 'Crítico';
                riskColor = 'red';
            }

            // actualizacion del estado
            setMiperDetails((prevDetails) => ({
                ...prevDetails,
                riskValue,
                riskClassification,
                riskColor,
            }));
        }
    };

    // envio del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'mipers'), {
                ...miperDetails,
                userId,
                createdAt: new Date(),
            });

            Swal.fire({
                icon: 'success',
                title: '¡MIPER creada con éxito!',
                text: 'La matriz de riesgos ha sido registrada.',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                navigate(`/training/${userId}`);
            });

            setMiperDetails({
                hazardDescription: '',
                specificArea: '',
                probability: '',
                severity: '',
                riskValue: '',
                riskClassification: '',
                riskColor: '',
                existingControls: '',
                recommendedControls: '',
                task: '',
                activityType: '',
                hazardSource: '',
                associatedRisks: '',
                possibleInjuries: '',
                legalRequirements: '',
                operationalControl: '',
                controlMeasures: '',
                frequency: '',
                responsiblePerson: '',
                responsibleRole: '',
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al registrar la MIPER',
                text: 'Hubo un problema al guardar los datos. Por favor, intenta nuevamente.',
                confirmButtonText: 'Cerrar'
            });
            console.error('Error registrando la MIPER:', error);
        }
    };

    if (isLoading) {
        return <div className="text-center mt-5">Cargando datos...</div>;
    }

    if (!user) {
        return <div className="alert alert-warning mt-5">No se encontraron datos para este usuario.</div>;
    }

    return (
        <div className="create-miper container mt-5">
            <h2 className="text-center mb-4">Creación Matriz de Identificación de Peligros y Riesgos. MIPER</h2>

            {/* Instrucciones */}
            <div className="instructions-box mb-5 p-4 bg-light border rounded">
                <h4>Instrucciones para completar el formulario:</h4>
                <ol>
                    <li><strong>Descripción del peligro:</strong> Indica el peligro o situación que estás evaluando.</li>
                    <li><strong>Área o actividad específica:</strong> Describe el área o actividad donde ocurre el peligro.</li>
                    <li><strong>Probabilidad:</strong> Selecciona un valor del 1 al 5 para indicar la probabilidad del riesgo.</li>
                    <li><strong>Severidad:</strong> Selecciona un valor del 1 al 5 para indicar la severidad de las consecuencias.</li>
                    <li><strong>Nivel de riesgo:</strong> Calculado automáticamente según la probabilidad y severidad seleccionadas.</li>
                    <li><strong>Medidas de control existentes:</strong> Describe las medidas de control que ya se han implementado.</li>
                    <li><strong>Medidas de control recomendadas:</strong> Proporciona recomendaciones adicionales para reducir el riesgo.</li>
                </ol>
            </div>

            {/* Ejemplo de Cálculo del Nivel de Riesgo */}
            <div className="risk-level-table mb-5 p-4 bg-light border rounded">
                <h4 className="text-center">Ejemplo de Cálculo del Nivel de Riesgo</h4>
                <p className="text-center text-muted">A continuación, se muestra cómo se calcula el nivel de riesgo según la probabilidad y la severidad:</p>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Probabilidad \ Severidad</th>
                            <th>1</th>
                            <th>2</th>
                            <th>3</th>
                            <th>4</th>
                            <th>5</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3, 4, 5].map((prob, index) => (
                            <tr key={index}>
                                <th>{prob}</th>
                                {[1, 2, 3, 4, 5].map((sev) => {
                                    const riskValue = prob * sev;
                                    let riskColor = '';
                                    let riskText = '';

                                    if (riskValue <= 5) {
                                        riskColor = 'green';
                                        riskText = 'Leve';
                                    } else if (riskValue <= 12) {
                                        riskColor = 'yellow';
                                        riskText = 'Moderado';
                                    } else if (riskValue <= 20) {
                                        riskColor = 'orange';
                                        riskText = 'Alto';
                                    } else {
                                        riskColor = 'red';
                                        riskText = 'Crítico';
                                    }

                                    return (
                                        <td key={`${prob}-${sev}`} style={{ backgroundColor: riskColor, color: 'white' }}>
                                            <strong>{riskValue}</strong><br />{riskText}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="row g-4">
                <h2>1. Detalles MIPER</h2>
                <div className="col-md-4">
                    <label className="form-label">Tarea:</label>
                    <p>Ej: Corte con esmeril, traslado de equipos pesados, pruebas eléctricas, etc.</p>
                    <input type="text" name="task" className="form-control" value={miperDetails.task} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                    <label className="form-label">Tipo de Actividad:</label>
                    <p>Ej: Tareas de Rutina, tareas No Rutinarias , Tareas realizadas de Emergencia.</p>
                    <select name="activityType" className="form-control" value={miperDetails.activityType} onChange={handleChange} required>
                        <option value="">Selecciona una opción</option>
                        <option value="Rutina">Rutina</option>
                        <option value="No Rutina">No Rutina</option>
                        <option value="Emergencia">Emergencia</option>
                    </select>
                </div>
                <div className="col-md-4">
                    <label className="form-label">Peligros (Fuente, Acto o Situación):</label>
                    <p>Ej: Máquinas en movimiento, conducir a exceso de vel., exposición a ruido, etc.</p>
                    <select name="hazardSource" className="form-control" value={miperDetails.hazardSource} onChange={handleChange} required>
                        <option value="">Selecciona una opción</option>
                        <option value="Fuente">Fuente</option>
                        <option value="Acto">Acto</option>
                        <option value="Situación">Situación</option>
                    </select>
                </div>
                <div className="col-md-4">
                    <label className="form-label">Riesgos e Incidentes Asociados:</label>
                    <p>Ej: Caídas, golpes, atrapamiento, atropello, choque, etc.</p>
                    <textarea name="associatedRisks" className="form-control" value={miperDetails.associatedRisks} onChange={handleChange} required />
                </div>

                <div className="col-md-4">
                    <label className="form-label">Requisitos Legales:</label>
                    <p>Ej: Ley 16.744, Ds. 40, Ds. 594, Reglamento Interno, etc.</p>
                    <textarea name="legalRequirements" className="form-control" value={miperDetails.legalRequirements} onChange={handleChange} required />
                </div>
                <div className="col-md-4 mb-3">
                    <label className="form-label">Posibles Lesiones o Enfermedades:</label>
                    <p>Lesiones superficiales, contusiones, fracturas, luxación.</p>
                    <textarea name="possibleInjuries" className="form-control" value={miperDetails.possibleInjuries} onChange={handleChange} required />
                </div>


                <h2>2. Evaluación del Riesgo</h2>
                <div className="col-md-3">
                    <label className="form-label">Probabilidad (P):</label>
                    <input type="number" name="probability" className="form-control" value={miperDetails.probability} onChange={handleChange} min="1" max="5" required />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Severidad (S):</label>
                    <input type="number" name="severity" className="form-control" value={miperDetails.severity} onChange={handleChange} min="1" max="5" required />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Evaluación del Riesgo (MR):</label>
                    <input type="text" name="riskValue" className="form-control" value={miperDetails.riskValue} readOnly />
                </div>
                <div className="col-md-3 mb-3">
                    <label className="form-label">Clasificación del Riesgo:</label>
                    <input type="text" name="riskClassification" className="form-control" value={miperDetails.riskClassification} readOnly style={{ backgroundColor: miperDetails.riskColor, color: 'white' }} />
                </div>

                {/* Sección de Control Operacional */}
                <h2>3. Medidas de Control a Implementar</h2>
                <div className="col-md-6">
                    <label className="form-label">Control Operacional (Ejemplos):</label>
                    <ul>
                        <li>A. Eliminación</li>
                        <li>B. Sustitución</li>
                        <li>C. Control de ingeniería</li>
                        <li>D. Controles administrativos, señalización, advertencias</li>
                        <li>E. Equipos de protección personal</li>
                    </ul>
                    <textarea
                        name="operationalControl"
                        className="form-control"
                        value={miperDetails.operationalControl}
                        onChange={handleChange}
                        placeholder="Escriba aquí las medidas de control operacional sugeridas"
                        required
                    />
                </div>

                {/* Sección de Medidas de Control a Implementar */}
                <div className="col-md-6">
                    <label className="form-label">Medidas de Control a Implementar (Ejemplos):</label>
                    <ul>
                        <li>A. Normativa Estandarización ISO</li>
                        <li>B. Procedimiento de trabajo</li>
                        <li>C. Instructivo de trabajo</li>
                        <li>D. Normativa interna</li>
                        <li>E. Normativa legal</li>
        
                    </ul>
                    <textarea
                        name="controlMeasures"
                        className="form-control"
                        value={miperDetails.controlMeasures}
                        onChange={handleChange}
                        placeholder="Escriba aquí las medidas de control a implementar"
                        required
                    />
                </div>

                <h2>4. Seguimiento y Responsable</h2>
                <div className="col-md-4">
                    <label className="form-label">Frecuencia:</label>
                    <input type="text" name="frequency" className="form-control" value={miperDetails.frequency} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                    <label className="form-label">Nombre Responsable:</label>
                    <input type="text" name="responsiblePerson" className="form-control" value={miperDetails.responsiblePerson} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                    <label className="form-label">Rol del Responsable:</label>
                    <input type="text" name="responsibleRole" className="form-control" value={miperDetails.responsibleRole} onChange={handleChange} required />
                </div>


                <div className="col-12 text-center mt-4">
                    <button type="submit" className="btn btn-primary btn-sm mx-2">Crear MIPER</button>
                    <Link to={`/training/${userId}`} className="btn btn-danger btn-sm mx-2">Volver</Link>
                </div>
            </form>
        </div>
    );
};

export default CreateMiper;
