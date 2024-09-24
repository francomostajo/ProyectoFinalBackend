class UserDTO {
    constructor({ first_name, last_name, email, role }) {
        this.nombre = first_name;
        this.apellido = last_name;
        this.correo = email;
        this.rol = role;
    }
}

export default UserDTO;