import Logo from '../assets/Logo.png';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateGameSummaryPDF = (game) => {
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.width;
    const margin = 10; // Left and right margin
    const sectionGap = 20; // Gap between sections
    let yPosition = 10; // Initial Y position (going downwards)

    doc.addImage(Logo, 'PNG', margin / 2, 1, 40, 20); // Adjust width and height as needed

    doc.setFontSize(10); // Adjust the size as needed
    doc.setTextColor(128, 128, 128); // RGB values for grey color
    doc.text(`Event Summary for Event ID ${game.id}`, pageWidth - margin, margin, { align: 'right' });
    doc.text(`Event Date: ${new Date(game.date).toLocaleDateString('en-GB')}`, pageWidth - margin, 15, { align: 'right' });
    doc.text(`Manager: ${game.manager.name} ${game.manager.last_name}`, pageWidth - margin, 20, { align: 'right' });

    yPosition += 30;

    doc.setFontSize(18);
    doc.setTextColor('black');
    doc.setFont('helvetica', 'bold');
    doc.text(`${game.name.split('-')[0]}`, pageWidth / 2, yPosition, { align: 'center' });

    yPosition += sectionGap / 2;

    // Filter out duplicate carts by cart_number
    const uniqueCarts = game.carts?.filter((cart, index, self) => {
        return self.findIndex((c) => c.cart_number === cart.cart_number) === index;
    }) || [];

    // AutoTable for carts
    doc.autoTable({
        startY: yPosition,
        head: [
            [
                'Worker',
                'Cart #',
                'Qty Start',
                'Qty +/-',
                'Final Qty',
                'Rtns',
                'Float',
                'Worker Value',
                'Exp Value',
                'Margin',
            ],
        ],
        body: game.carts.map((cart) => {
            const workerValue = (cart.worker_total || 0).toFixed(2);
            const expectedValue =
                ((cart.final_quantity - cart.final_returns) * 4).toFixed(2);
            const margin = (workerValue - expectedValue).toFixed(2);
            const workerNames = cart.workers && cart.workers.length > 0 ? cart.workers.map(worker => worker.name).join(', ') : "No workers assigned"
            const movement = (cart.quantities_added - cart.quantities_minus)

            return [
                workerNames,
                cart.cart_number,
                cart.quantities_start || 0,
                movement || 0,
                cart.final_quantity || 0,
                cart.final_returns || 0,
                `£${cart.float || 0}`,
                `£${workerValue}`,
                `£${expectedValue}`,
                `£${margin}`,
            ];
        }),
        theme: 'striped',
        styles: { fontSize: 10, textColor:'black', cellPadding: 2 },
        headStyles: { fillColor: ['gold'] }, // Greenish header
        didParseCell: (data) => {
            // Check if the cell is in the "Margin" column
            const columnIndex = data.column.index;
            const rowIndex = data.row.index;
            const marginColumnIndex = 9; // Assuming the margin is the 10th column (0-based index)
    
            if (columnIndex === marginColumnIndex && rowIndex !== -1) {
                const marginValue = parseFloat(data.cell.raw.replace('£', '')); // Remove £ and parse as a number
    
                // Apply background color based on the margin value
                if (marginValue > 0) {
                    data.cell.styles.fillColor = [0, 255, 0]; // Green background for positive margin
                    data.cell.styles.textColor = [0, 0, 0];   // Black text for contrast
                } else if (marginValue < 0) {
                    data.cell.styles.fillColor = [255, 0, 0]; // Red background for negative margin
                    data.cell.styles.textColor = [255, 255, 255]; // White text for contrast
                }  else if (marginValue === 0) {
                    data.cell.styles.fillColor = [211, 211, 211]; // Grey background for zero margin
                    data.cell.styles.textColor = [0, 0, 0]; // Black text
                }
            }
        },
    });

    // Get the Y position after the table
    const tableFinalY = doc.lastAutoTable.finalY;

    // Draw the line after the table (one divider)
    doc.setDrawColor('lightgrey'); // Set lightgrey line color
    doc.setLineWidth(0.5); // Set line thickness
    doc.line(margin, tableFinalY + 5, pageWidth - margin, tableFinalY + 5); // Draw line

    // Calculate totals
    const totalEarned = uniqueCarts.reduce((sum, cart) => sum + (cart.worker_total || 0), 0).toFixed(2); // Total money earned
    const totalExpected = uniqueCarts.reduce((sum, cart) => {
        const expectedValue = ((cart.final_quantity - cart.final_returns) * 4) || 0;
        return sum + expectedValue;
    }, 0).toFixed(2); // Total expected value
    const finalMargin = totalEarned - totalExpected

    yPosition = tableFinalY + 10.5; // Move Y position down after the line

    doc.setFontSize(10);
    doc.setTextColor('black');
    doc.text('Summary:', margin, yPosition);
    yPosition += sectionGap / 2;

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value);
    };

    const getWorkersCount = (game) => {
        let workerCount = 0;
      
        // Loop through each cart in the game
        game.carts?.forEach((cart) => {
          if (cart.workers && cart.workers.length > 0) {
            workerCount += cart.workers.length; // Add the number of workers in this cart
          }
        });
      
        return workerCount;
      };

      const getTotalSold = () => {
        return uniqueCarts.reduce((sum, cart) => sum + (cart.sold || 0), 0).toLocaleString() // Total money earned
      }

    doc.setFont('helvetica', 'normal');
    doc.text('Total Workers:', margin, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(`${getWorkersCount(game)}`, pageWidth - margin, yPosition, { align: 'right' });

    yPosition += sectionGap / 2;

    doc.setFont('helvetica', 'normal');
    doc.text('£ per head:', margin, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(`${formatCurrency(totalEarned / 60000)}`, pageWidth - margin, yPosition, { align: 'right' });

    yPosition += sectionGap / 2;

    doc.setFont('helvetica', 'normal');
    doc.text('Total Programmes Sold:', margin, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(`${getTotalSold()}`, pageWidth - margin, yPosition, { align: 'right' });

    yPosition += sectionGap / 2;

    doc.setFont('helvetica', 'normal');
    doc.text('Total Money Earned from Workers:', margin, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(`${formatCurrency(totalEarned)}`, pageWidth - margin, yPosition, { align: 'right' });

    yPosition += sectionGap / 2;

    doc.setFont('helvetica', 'normal');
    doc.text('Total Expected Value:', margin, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(`${formatCurrency(totalExpected)}`, pageWidth - margin, yPosition, { align: 'right' });

    yPosition += sectionGap / 2

    doc.setDrawColor('lightgrey'); // Set lightgrey line color
    doc.setLineWidth(0.5); // Set line thickness
    doc.line(margin, yPosition, pageWidth - margin, yPosition); // Draw line

    yPosition += sectionGap / 2

    doc.setFont('helvetica', 'normal');
    doc.text('Margin:', margin, yPosition);
    doc.setTextColor(finalMargin < 0 ? 'red' : 'green');
    doc.getTextColor(`${finalMargin < 0 ? 'red' : 'green'}`)
    doc.text(`${formatCurrency(finalMargin)}`, pageWidth - margin, yPosition, { align: 'right' });

    doc.setFontSize(8);
    doc.setTextColor('lightgrey');
    doc.text(`Report Generated at ${new Date().toLocaleDateString('en-GB')}`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center'});

    // Generate the PDF and open in a new tab

    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const filename = `${game.name}-summary.pdf`;
    window.open(pdfUrl, '_blank');
    doc.save(filename);

};
