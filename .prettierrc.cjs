const naverpayConfig = require('@naverpay/prettier-config')

module.exports = {
    ...naverpayConfig,
    semi: false,
    plugins: ['prettier-plugin-tailwindcss'],
}
