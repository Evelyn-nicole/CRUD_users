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


    useEffect(() => {
        const fetchMipers = async () => {
            try {
                const mipersCollection = collection(db, 'mipers');
                let q;

                if (getUser?.role === 'supervisor' || getUser?.role === 'prevencionista') {
                    // Supervisores y prevencionistas ven todos los registros
                    q = query(mipersCollection);
                } else {
                    // Puedes agregar otras condiciones para otros roles si es necesario
                    q = query(mipersCollection, where('userId', '==', userId)); // Usuarios regulares solo ven sus propios registros
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
        const doc = new jsPDF('landscape', 'mm', 'a2'); // Cambiamos a tamaño A2
        doc.setFontSize(14);
        doc.text('Detalles de las MIPERs', 14, 15);

        // Definir los encabezados de la tabla
        const tableColumn = [
            'Tarea', 'Actividad', 'Peligros',
            'Riesgos', 'Lesiones', 'Prob.',
            'Sever.', 'Riesgo (MR)', 'Clasif.',
            'Req. Legales', 'Controles Op.',
            'Medidas', 'Freq.', 'Resp.', 'Rol Resp.'
        ];

        // Definir las filas de la tabla
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
            miper.responsibleRole || 'N/A',
        ]);

        // Generar la tabla con colores en "Clasificación del Riesgo"
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 30,
            theme: 'grid',
            styles: { fontSize: 12, cellPadding: 2, overflow: 'linebreak' }, // Ajuste de tamaño de fuente
            headStyles: { fillColor: [60, 141, 188], textColor: 255 },
            bodyStyles: { textColor: 20 },
            columnStyles: {
                10: { cellWidth: 50 }, // Ajustamos el ancho de columnas con contenido largo
                11: { cellWidth: 50 },
            },
            margin: { top: 20, bottom: 20, left: 10, right: 10 },
            didParseCell: (data) => {
                if (data.column.index === 8) { // Índice de la columna "Clasificación del Riesgo"
                    const riskClassification = data.cell.raw;

                    // Asignar colores según el valor de clasificación del riesgo
                    if (riskClassification === 'Leve') {
                        data.cell.styles.fillColor = [0, 255, 0]; // Verde
                        data.cell.styles.textColor = 0; // Texto negro
                    } else if (riskClassification === 'Moderado') {
                        data.cell.styles.fillColor = [255, 255, 0]; // Amarillo
                        data.cell.styles.textColor = 0; // Texto negro
                    } else if (riskClassification === 'Alto') {
                        data.cell.styles.fillColor = [255, 165, 0]; // Naranja
                        data.cell.styles.textColor = 0; // Texto negro
                    } else if (riskClassification === 'Crítico') {
                        data.cell.styles.fillColor = [255, 0, 0]; // Rojo
                        data.cell.styles.textColor = 255; // Texto en blanco para contraste
                    }
                }
            },
        });

        // Descargar el PDF
        doc.save('Detalles_MIPERs_A2_Colores.pdf');
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
                                <th>Peligros</th>
                                <th>Riesgos</th>
                                <th>Lesiones o Enfermedades</th>
                                <th>Prob.</th>
                                <th>Sever.</th>
                                <th>Riesgo (MR)</th>
                                <th>Clasificación del Riesgo</th>
                                <th>Req. Legales</th>
                                <th>Controles Operacionales</th>
                                <th>Medidas de Control</th>
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
