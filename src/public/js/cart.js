document.addEventListener('DOMContentLoaded', () => {
    let cartId = document.querySelector('#cart-id').value;
    let totalAmount = parseFloat(document.querySelector('#total-amount').textContent);

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const totalElement = document.querySelector('#total-amount');
    const finalizeButton = document.querySelector('#finalize-purchase');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.productId;
            const productPrice = parseFloat(event.target.dataset.productPrice);
            const quantityElement = event.target.closest('li').querySelector('.quantity');

            fetch(`/api/carts/${cartId}/product/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const newQuantity = parseInt(quantityElement.textContent) + 1;
                    quantityElement.textContent = newQuantity;
                    totalAmount += productPrice;
                    updateTotal();
                } else {
                    alert('Error al agregar el producto al carrito');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al agregar el producto al carrito');
            });
        });
    });

    const updateTotal = () => {
        totalElement.textContent = totalAmount.toFixed(2);
    };

    finalizeButton.addEventListener('click', () => {
        fetch(`/api/carts/${cartId}/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Compra finalizada con éxito!');
                totalAmount = 0;
                updateTotal();
                // Resetear cantidades en el carrito
                document.querySelectorAll('.quantity').forEach(q => q.textContent = '0');
            } else {
                alert('Error al finalizar la compra');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al finalizar la compra');
        });
    });
});