import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Injectable({
  providedIn: 'root'
})

export class ReporteService {

  constructor() {}

  generarPDF(datos: any[],datos2:any[]) {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Reporte de votos', 10, 10);
  
    const columnas = [
      { header: 'Nombre del Candidato', dataKey: 'name' },
      { header: 'Número de Votos', dataKey: 'value' }
    ];
  
    autoTable(doc, {
      head: [columnas.map(col => col.header)], // Extract headers from the columns
      body: datos.map(row => columnas.map(col => row[col.dataKey] || '')), // Map data to match columns
      startY: 30
    },
  );

    doc.save('reporte.pdf');
  }
} 
