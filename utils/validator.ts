import { IUserDocument } from '../models/User';

type TValidateRegisterInput = Pick<IUserDocument, 'userName' | 'email' | 'password' | 'confirmPassword'>;

export const validateRegisterInput = ({userName, email, password, confirmPassword}: TValidateRegisterInput) => {
    const errors: Partial<TValidateRegisterInput> = {};

    if (!userName.trim()) {
        errors.userName = 'Username cannot be empty'
    };

    if (!email.trim()) {
        errors.email = 'Username cannot be empty';
    } else {
        const regExp = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

        if (!email.match(regExp)) {
            errors.email = 'Email must be a valid email address';
        };
    };

    if (!password) {
        errors.password = 'Password must not be empty'
    } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters long'
    } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords must match ';
    };

    return {
        errors,
        valid: !Object.keys(errors).length
    };
};

type TValidateLoginInput = Omit<TValidateRegisterInput, 'confirmPassword' | 'email'>

export const validateLoginInput = ({ userName, password }: TValidateLoginInput) => {
    const errors: Partial<TValidateLoginInput> = {};

    if (!userName.trim()) {
        errors.userName = 'Username cannot be empty'
    };

    if (!password.trim()) {
        errors.password = 'Password cannot be empty'
    };

    return {
        errors,
        valid: !Object.keys(errors).length
    };
};
