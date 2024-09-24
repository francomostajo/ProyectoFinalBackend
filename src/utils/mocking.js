import { faker } from '@faker-js/faker';

export function generateMockProducts() {
    const products = [];
    for (let i = 0; i < 100; i++) {
        const product = {
            name: faker.commerce.productName(),
            price: faker.commerce.price(),
            description: faker.commerce.productDescription(),
            category: faker.commerce.department(),
            image: faker.image.url(),
            stock: faker.number.int({ min: 10, max: 100 }),
        };
        products.push(product);
    }
    return products;
}