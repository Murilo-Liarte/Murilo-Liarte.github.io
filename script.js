function generateDocument() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const solicitante = document.getElementById('solicitante').value;
    const contato = document.getElementById('contato').value;
    const produto = document.getElementById('produto').value;
    const espec = document.getElementById('espec').value;
    const valorarte = document.getElementById('valorarte').value;
    const quantidade = document.getElementById('quantidade').value;
    const varejo = document.getElementById('varejo').value;
    const atacado = document.getElementById('atacado').value;
    const pagamento = document.getElementById('pagamento').value;
    const prazo = document.getElementById('prazo').value;
    const imagemCliente = document.getElementById('imagemCliente').files[0];
    const imagemProjeto = document.getElementById('imagemProjeto').files[0];
    const titulo = 'Pedido de Orçamento';
    const texto = `
        Solicitante: ${solicitante}
        Contato: ${contato}
        Produto(s): ${produto}
        Especificações: ${espec}
        Quantidade: ${quantidade}
        Valor da Arte: ${valorarte}
        Valor de Varejo: ${varejo}
        Valor de Atacado: ${atacado}
        Forma de Pagamento: ${pagamento}
        Prazo de Entrega: ${prazo}
    `;

    function addImageToPDF(doc, imageFile, x, y, maxWidth, maxHeight, callback) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const img = new Image();
            img.onload = function () {
                const imgWidth = img.width;
                const imgHeight = img.height;
                const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
                const newWidth = imgWidth * ratio;
                const newHeight = imgHeight * ratio;
                doc.addImage(event.target.result, 'JPEG', x, y, newWidth, newHeight);
                if (callback) callback();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(imageFile);
    }

    function addImagesToPDF() {
        if (imagemCliente) {
            addImageToPDF(doc, imagemCliente, 20, 150, 50, 50, function () {
                doc.text('Imagem enviada pelo cliente:', 20, 140);
                if (imagemProjeto) {
                    addImageToPDF(doc, imagemProjeto, 20,220, 50, 50, function () {
                        doc.text('Pré Projeto/Mockup:', 20, 210);
                        finalizePDF();
                    });
                } else {
                    finalizePDF();
                }
            });
        } else {
            if (imagemProjeto) {
                addImageToPDF(doc, imagemProjeto, 20, 220, 50, 50, function () {
                    doc.text('Pré Projeto/Mockup:', 20, 200);
                    finalizePDF();
                });
            } else {
                finalizePDF();
            }
        }
    }

    function finalizePDF() {
        doc.setFontSize(24);
        const pageWidth = doc.internal.pageSize.getWidth();
        const textWidth = doc.getStringUnitWidth(titulo) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        const xOffset = (pageWidth - textWidth) / 2;
        doc.setFont('helvetica', 'normal');
        doc.text(titulo, xOffset, 50);

        doc.setFontSize(12);
        doc.text(texto, 20, 60);

        // Adiciona a logo
        const imagem = new Image();
        imagem.src = "logo.jpeg";
        imagem.onload = function () {
            doc.addImage(imagem, 'JPEG', xOffset, 1, 96, 28);
            doc.save('documento_venda.pdf');
        };
    }

    addImagesToPDF();
}
