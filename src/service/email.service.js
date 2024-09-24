import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Configura tu cuenta de correo electrónico
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

export const sendPurchaseEmail = async (user, ticket) => {
    const { code, totalAmount, products } = ticket;

    // Verifica si products es un array antes de mapear
    if (!Array.isArray(products)) {
        throw new Error('Products is not an array');
    }

    const productList = products.map(p => {
        const productTitle = p.productId ? p.productId.title : 'Producto no encontrado';
        const productPrice = p.productId ? p.productId.price : 0;
        return `- ${productTitle}: ${p.quantity} x ${productPrice} = ${p.quantity * productPrice}`;
    }).join('\n');

    const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: 'Compra realizada con éxito',
        text: `
            ¡Gracias por tu compra, ${user.first_name} ${user.last_name}!

            Código de compra: ${code}
            Productos:
            ${productList}
            Monto total: $${totalAmount}
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo enviado con éxito');
    } catch (error) {
        console.error('Error al enviar correo:', error);
    }
};

export const sendPasswordResetEmail = async (user, resetUrl) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: 'Restablecimiento de contraseña',
        text: `
            Estimado/a ${user.first_name} ${user.last_name},

            Hemos recibido una solicitud para restablecer tu contraseña. Por favor, haz clic en el siguiente enlace para restablecer tu contraseña:

            ${resetUrl}

            Si no solicitaste este cambio, por favor, ignora este correo.

            Saludos,
            Equipo de Soporte
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo de restablecimiento de contraseña enviado con éxito');
    } catch (error) {
        console.error('Error al enviar correo de restablecimiento de contraseña:', error);
    }
};