const { faker } = require('@faker-js/faker')

faker.locale = 'es'

const generator = function createRandom() {
    const products = {
        name: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        code: faker.random.numeric(),
        price: faker.commerce.price(),
        thumbnail: faker.image.imageUrl()
    }
    return products
}

module.exports = generator