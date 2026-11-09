INSERT INTO label_group (key, description)
SELECT t.key, t.description
FROM (VALUES ('LOGIN', 'Traducciones página de login')) t(key, description)
WHERE NOT EXISTS(SELECT 1 FROM label_group lg2 WHERE lg2.key = t.key);

INSERT INTO labels (label_group_id, key)
SELECT (SELECT lg.id FROM label_group lg WHERE key = 'LOGIN'),
       t.key
FROM (VALUES ('TITLE'),
             ('EMAIL'),
             ('PASSWORD'),
             ('BUTTON_LOGIN'),
             ('EMAIL_REQUIRED'),
             ('PASSWORD_REQUIRED'),
             ('EMAIL_INVALID')) t(key)
WHERE NOT EXISTS(SELECT 1 FROM labels l2 WHERE l2.key = t.key);


-- TENEMOS VARIAS TRADUCCIONES QUE HACEMOS
INSERT INTO translations (label_id, language_id, value, created_by, created_at)
SELECT (SELECT l.id
        FROM label_group lg
                 JOIN labels l on lg.id = l.label_group_id
        WHERE lg.key = t.label_group_key
          AND l.key = t.label_key),
       (SELECT l.id
        FROM languages l
        WHERE l.locale = t.locale),
       t.value,
       'admin',
       now()
FROM (VALUES ('LOGIN', 'TITLE', 'es', 'Inicio de sessión'),
             ('LOGIN', 'EMAIL', 'es', 'Email'),
             ('LOGIN', 'PASSWORD', 'es', 'Contraseña'),
             ('LOGIN', 'EMAIL_REQUIRED', 'es', 'El email es requerido'),
             ('LOGIN', 'PASSWORD_REQUIRED', 'es', 'La contraseña es requerida'),
             ('LOGIN', 'EMAIL_INVALID', 'es', 'Inserte un correo válido')) t(label_group_key, label_key, locale, value)