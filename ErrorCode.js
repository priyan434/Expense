
const Codes = {
    USER_REGISTER: {
        message: 'The user successfully registered.',
        code: "s-001"
    },
    USER_REGISTERATION_ERROR: {
        message: 'failed to register a user',
        code: "E-001"
    },

    USER_LOGIN: {
        message: 'user successfully logged In',
        code: "s-002"
    },

    USER_LOGIN_ERROR: {
        message: "login error",
        code: "E-002"
    },
    USER_FOUND:{
            message:"user  found",
            code:"s-003"
    },
    USER_DETAILS_NOT_FOUND:{
            message:"user details not found",
            code:"E-010"
    },
    USER_DETAILS_FOUND:{
        message:"user details  found",
        code:"s-010"
},
    USER_NOT_FOUND: {
        message: 'The user was not found.',
        code: "E-003"
    },
    ADD_EXPENSE: {
        message: "successfully added expense",
        code: "s-004",
    },
    ADD_EXPENSE_ERROR: {
        message: "error while adding   expense",
        code: "E-004",
    },
    GET_ALL_EXPENSE: {
        message: "expenses fetched successfully",
        code: "s-005"
    },
    GET_ALL_EXPENSE_ERROR: {
        message: "error fetching expense data",
        code: "E-005"
    },
    DELETE_EXPENSE:{
        message:"successfully deleted  expense",
        code:"s-006"
    },
    DELETE_EXPENSE_ERROR:{
        message:"error while deleting",
        code:"E-006",
    },
    UPDATE_EXPENSE:{
        message:"successfully updated expense",
        code:"s-007",
    },
    UPDATE_EXPENSE_ERROR:{
        message:"error while updating expense",
        code:"E-007"
    },
    EXPENSE_FOUND:{
        message:"expense  found",
        code:"S-011"
},
    EXPENSE_NOT_FOUND:{
        message:"expense not found",
        code:"E-011"
},
    INVALID_INPUT: {

        message: 'The input provided is invalid.',
        code: " E-008"
    },
    USER_ID_INVALID:{
        message:'user id invalid',
        code:"E-009"
    }

};

module.exports = Codes;
