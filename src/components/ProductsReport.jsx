/**
 * Declaracion de dependencias
 */
import jsPDF from "jspdf";
import "jspdf-autotable";

/**
 * Componente para generar el reporte de produtos en PDF
 */
class ProductsReport {

    async generarReporte(data) {
        const doc = new jsPDF();

        const tableColumn = ["Nit", "Nombre", "Dureccion", "Telefono", "Producto"];
        const tableRows = [];

        data.forEach(datum => {
            const tableRow = [
                datum.nit,
                datum.nombre,
                datum.direccion,
                datum.telefono,
                datum.product_nombre
            ];        
            tableRows.push(tableRow);
        });

        doc.autoTable(tableColumn, tableRows, { startY: 20 });
        doc.text("Empresas y Productos del inventario.", 14, 15);

        return doc.output();
    }
};

export default new ProductsReport();