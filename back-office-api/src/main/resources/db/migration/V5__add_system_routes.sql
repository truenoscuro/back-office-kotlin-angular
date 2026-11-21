alter table menus
    add description text not null;

alter table screens
    add description text not null;

alter table menus
    add constraint menus_pk_2
        unique (title);

alter table routes
    alter column father_id drop not null;

alter table routes
    alter column screen_id drop not null;

alter table routes
    alter column menu_id drop not null;


insert into screens (key, tab_bar_title, title, description, created_by, created_at)
values ('dashboard', 'DASBHOARD.TAB_BAR_TITLE', 'DASHBOARD.SCREEN_TITLE', 'Página de dashboard', 'admin', now()),
       ('routes', 'ROUTES.TAB_BAR_TITLE', 'ROUTES.SCREEN_TITLE', 'Página de creación de rutas', 'admin', now()),
       ('roles', 'ROLES.TAB_BAR_TITLE', 'ROLES.SCREEN_TITLE', 'Página de administación de los roles', 'admin', now()),
       ('users', 'USERS.TAB_BAR_TITLE', 'USERS.SCREEN_TITLE', 'Página de administración de usuarios', 'admin', now());


insert into menus (title, icon, description, is_principal, created_by, created_at)
values ('DASHBOARD.MENU_TITLE', 'dashboard', 'Dashboard', true, 'admin', now()),
       ('ROUTES.MENU_TITLE', 'routes', 'Rutas', true, 'admin', now()),
       ('ROLES.MENU_TITLE', 'roles', 'Rol admin menú', true, 'admin', now()),
       ('USERS.MENU_TITLE', 'person', 'User admin menú', true, 'admin', now());

-- insertamos dashboard
insert into routes (description, role_id, breadcrumb_title, screen_id, menu_id, path)
values ('Ruta dashboard',
        (SELECT r.id FROM roles r where r.key = 'SUPER_ADMIN'),
        'DASHBOARD.BREADCRUMB_TITLE',
        (SELECT s.id FROM screens s where s.key = 'dashboard'),
        (SELECT m.id FROM menus m WHERE m.title = 'DASHBOARD.MENU_TITLE'),
        '');

insert into routes (description, role_id, breadcrumb_title, screen_id, menu_id, path, father_id)
SELECT t.description,
       (SELECT r.id FROM roles r where r.key = 'SUPER_ADMIN'),
       t.breadcrumb_title,
       (SELECT s.id FROM screens s where s.key = t.screenKey),
       (SELECT m.id FROM menus m WHERE m.title = t.menuTitle),
       t.path,
       (SELECT r.id FROM routes r where description = 'Ruta dashboard')
FROM (VALUES ('Ruta de rutas', 'ROUTES.BREADCRUMB_TITLE', 'routes', 'ROUTES.MENU_TITLE', 'routes'),
             ('Ruta de roles', 'ROLES.BREADCRUMB_TITLE', 'roles', 'ROLES.MENU_TITLE', 'roles'),
             ('Ruta de usuarios', 'USERS.BREADCRUMB_TITLE', 'users', 'USERS.MENU_TITLE',
              'users')) t(description, breadcrumb_title, screenKey, menuTitle, path)





