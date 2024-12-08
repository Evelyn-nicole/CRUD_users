import React, { useState, useEffect } from 'react';
import { db } from '../FireBaseConfig/FireBase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useParams, Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../Styles/ViewMiper.css';

const ViewMiper = ({ user, getUser }) => {
    const { id: userId } = useParams();
    const [mipers, setMipers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // useEffect(() => {
    //     const fetchMipers = async () => {
    //         try {
    //             const mipersCollection = collection(db, 'mipers');
    //             const q = query(mipersCollection, where('userId', '==', userId));
    //             const mipersSnapshot = await getDocs(q);
    //             const mipersList = mipersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    //             setMipers(mipersList);
    //         } catch (error) {
    //             console.error('Error fetching MIPERs:', error);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };

    //     fetchMipers();
    // }, [userId]);

    useEffect(() => {
        const fetchMipers = async () => {
            try {
                const mipersCollection = collection(db, 'mipers');
                let q;

                if (getUser?.role === 'supervisor') {
                    // Supervisores ven todos los registros
                    q = query(mipersCollection);
                } else if (getUser?.role === 'prevencionista') {
                    // Prevencionistas ven solo sus propios registros
                    q = query(mipersCollection, where('userId', '==', userId));
                }

                const mipersSnapshot = await getDocs(q);
                const mipersList = mipersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setMipers(mipersList);
            } catch (error) {
                console.error('Error fetching MIPERs:', error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMipers();
    }, [userId, getUser]);


    const generatePDF = () => {
        const doc = new jsPDF('landscape'); // Configuramos en modo paisaje
        doc.setFontSize(14);
        doc.text('Detalles de las MIPERs', 14, 15);

        // Definir los encabezados y el cuerpo de la tabla consolidada
        const tableColumn = [
            'Tarea', 'Actividad', 'Peligros (Fuente, Acto o Situación)',
            'Riesgos e Incidentes Asociados', 'Posibles Lesiones o Enfermedades',
            'Probabilidad', 'Severidad', 'Evaluación del Riesgo (MR)',
            'Clasificación del Riesgo', 'Requisitos Legales',
            'Controles Operacionales', 'Medidas de Control a Implementar',
            'Frecuencia', 'Responsable', 'Rol del Responsable'
        ];

        const tableRows = mipers.map((miper) => [
            miper.task || 'N/A',
            miper.activityType || 'N/A',
            miper.hazardSource || 'N/A',
            miper.associatedRisks || 'N/A',
            miper.possibleInjuries || 'N/A',
            miper.probability || 'N/A',
            miper.severity || 'N/A',
            miper.riskValue || 'N/A',
            miper.riskClassification || 'N/A',
            miper.legalRequirements || 'N/A',
            miper.operationalControl || 'N/A',
            miper.controlMeasures || 'N/A',
            miper.frequency || 'N/A',
            miper.responsiblePerson || 'N/A',
            miper.responsibleRole || 'N/A'
        ]);

        // Generar la tabla consolidada con color en la columna de "Clasificación del Riesgo"
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 30,
            theme: 'grid',
            styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' },
            headStyles: { fillColor: [60, 141, 188], textColor: 255 },
            bodyStyles: { textColor: 20 },
            columnStyles: { valign: 'middle', halign: 'center' },
            didParseCell: (data) => {
                // Aplicar color a la celda de "Clasificación del Riesgo" basado en el valor
                if (data.column.index === 8) { // Índice de la columna de "Clasificación del Riesgo"
                    const riskClassification = data.cell.raw;
                    if (riskClassification === 'Leve') {
                        data.cell.styles.fillColor = [0, 255, 0]; // Verde para "Leve"
                    } else if (riskClassification === 'Moderado') {
                        data.cell.styles.fillColor = [255, 255, 0]; // Amarillo para "Moderado"
                    } else if (riskClassification === 'Alto') {
                        data.cell.styles.fillColor = [255, 165, 0]; // Naranja para "Alto"
                    } else if (riskClassification === 'Crítico') {
                        data.cell.styles.fillColor = [255, 0, 0]; // Rojo para "Crítico"
                    }
                    data.cell.styles.textColor = 255; // Texto en blanco para contraste
                }
            },
        });

        doc.save('Detalles_MIPERs.pdf');
    };




    if (isLoading) return <div className="loading">Cargando MIPERs...</div>;
    if (!mipers.length) return <div className="no-data">No se encontraron MIPERs registradas.</div>;

    return (
        <div className="view-miper container mt-5">
            <h2 className="text-center mb-4">Detalles de las MIPERs</h2>
            <button className="btn btn-primary mb-4" onClick={generatePDF}>Descargar en PDF</button>
            <div className="table-responsive">
                <div className="miper-table-wrapper mb-5">
                    <table className="table table-bordered miper-table">
                        <thead>
                            <tr>
                                <th>Tarea</th>
                                <th>Actividad</th>
                                <th>Peligros (Fuente, Acto o Situación)</th>
                                <th>Riesgos e Incidentes Asociados</th>
                                <th>Posibles Lesiones o Enfermedades</th>
                                <th>Probabilidad</th>
                                <th>Severidad</th>
                                <th>Evaluación del Riesgo (MR)</th>
                                <th>Clasificación del Riesgo</th>
                                <th>Requisitos Legales</th>
                                <th>Controles Operacionales</th>
                                <th>Medidas de Control a Implementar</th>
                                <th>Frecuencia</th>
                                <th>Responsable</th>
                                <th>Rol del Responsable</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mipers.map((miper) => (
                                <tr key={miper.id}>
                                    <td>{miper.task || 'N/A'}</td>
                                    <td>{miper.activityType || 'N/A'}</td>
                                    <td>{miper.hazardSource || 'N/A'}</td>
                                    <td>{miper.associatedRisks || 'N/A'}</td>
                                    <td>{miper.possibleInjuries || 'N/A'}</td>
                                    <td>{miper.probability || 'N/A'}</td>
                                    <td>{miper.severity || 'N/A'}</td>
                                    <td>{miper.riskValue || 'N/A'}</td>
                                    <td style={{ backgroundColor: miper.riskColor, color: 'white' }}>{miper.riskClassification || 'N/A'}</td>
                                    <td>{miper.legalRequirements || 'N/A'}</td>
                                    <td>{miper.operationalControl || 'N/A'}</td>
                                    <td>{miper.controlMeasures || 'N/A'}</td>
                                    <td>{miper.frequency || 'N/A'}</td>
                                    <td>{miper.responsiblePerson || 'N/A'}</td>
                                    <td>{miper.responsibleRole || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Link className="btn btn-danger btn-md mt-3" to={`/training/${userId}`}>Volver</Link>
        </div>
    );
};

export default ViewMiper;
