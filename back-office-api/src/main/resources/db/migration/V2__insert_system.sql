INSERT INTO roles (key, description, is_active, is_system, created_by, created_at)
VALUES ('SUPER_ADMIN', 'Role de administrador máximo', true, true, 'admin', now());

-- password: b078ee414ad34b6c
INSERT INTO users (email, password, role_id, is_system, created_by, created_at)
VALUES ('admin@admin.es',
        '$2a$10$M2THwg.7vDDwvBBjKPvheu72y.U.IerDQRHCaAEVn8ASk8as0Ru0m',
        (SELECT r.id FROM roles r where r.key = 'SUPER_ADMIN'),
        true,
        'admin',
        now());

INSERT INTO languages (locale, label_key, is_active, is_system, is_default, created_by, created_at)
VALUES ('es', 'LANGUAGE.SPANISH', true, true, true, 'oruiz', now());



