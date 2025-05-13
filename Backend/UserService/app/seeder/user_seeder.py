from datetime import datetime
from faker import Faker

from app.database.database import db
from app.models.user_model import User, UserRole
from app.services.auth_service import hash_password

fake = Faker()


# Проверка: есть ли уже пользователи в базе
def users_already_seeded():
    return db.session.query(User).count() > 0


# Основная функция генерации сидеров пользователей
def seed_users(session):
    if users_already_seeded():
        print("Пользователи уже существуют. Пропуск сидирования.")
        return

    for _ in range(10):  # Создаём 10 пользователей
        username = fake.user_name()
        email = fake.email()
        password = fake.password()
        bio = fake.sentence()
        avatar_url = fake.image_url()

        role = fake.random_element([UserRole.ADMIN, UserRole.USER])

        # Проверяем, существует ли уже пользователь с таким email
        exists = session.query(User).filter_by(email=email).first()
        if not exists:
            user = User(
                username=username,
                email=email,
                password_hash=hash_password(password),
                role=role,
                bio=bio,
                avatar_url=avatar_url,
                created_at=datetime.utcnow(),
                is_active=True
            )
            session.add(user)
            print(f"Добавлен пользователь: {username}")
        else:
            print(f"Пользователь с email {email} уже существует.")

    session.commit()
    print("Пользователи успешно посеяны!")
