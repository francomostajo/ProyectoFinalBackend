const errorDictionary = {
    USER_REGISTER_ERROR: {
        code: 1001,
        message: 'Error registering user',
    },
    USER_LOGIN_ERROR: {
        code: 1002,
        message: 'Error logging in user',
    },
    USER_LOGOUT_ERROR: {
        code: 1003,
        message: 'Error logging out user',
    },
    USER_FETCH_ERROR: {
        code: 1004,
        message: 'Error fetching user data',
    },
    USER_MODIFY_ERROR: {
        code: 1005,
        message: 'Error modifying user',
    },
    USER_REMOVE_ERROR: {
        code: 1006,
        message: 'Error removing user',
    },
    USERS_FETCH_ERROR: {
        code: 1007,
        message: 'Error fetching users',
    },
    CART_CREATION_ERROR: {
        code: 2001,
        message: 'Error creating cart',
    },
    CART_ADDITION_ERROR: {
        code: 2002,
        message: 'Error adding product to cart',
    },
    CART_PURCHASE_ERROR: {
        code: 2003,
        message: 'Error purchasing cart',
    },
    PRODUCT_CREATION_ERROR: {
        code: 3001,
        message: 'Error creating product',
    },
    PRODUCT_UPDATE_ERROR: {
        code: 3002,
        message: 'Error updating product',
    },
    PRODUCT_DELETION_ERROR: {
        code: 3003,
        message: 'Error deleting product',
    },
    PRODUCT_FETCH_ERROR: {
        code: 3004,
        message: 'Error fetching product',
    },
    USER_MANAGEMENT_ERROR: {
        code: 4001,
        message: 'Error managing user',
    },
    // otros errores...
};

export default errorDictionary;