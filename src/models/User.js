class User {
    constructor(id, name, email, password, is_active, create_at, department_id, rol_id) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.is_active = is_active;
        this.create_at = create_at;
        this.department_id = department_id;
        this.rol_id = rol_id;
    }

    toPublic() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            is_active: this.is_active,
            create_at: this.create_at
        }
    }
}