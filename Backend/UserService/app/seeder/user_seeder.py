from datetime import datetime
from faker import Faker
from sqlalchemy.orm import Session
from app.models.user_model import User, UserRole
from app.services.auth_service import hash_password

fake = Faker()

def seed_users(db: Session):
    for _ in range(10):  # Создаём 10 пользователей
        username = fake.user_name()
        email = fake.email()
        password = fake.password()
        bio = fake.sentence()
        avatar_url = fake.image_url()

        # Определяем случайную роль
        role = fake.random_element([UserRole.ADMIN, UserRole.USER])

        # Проверяем, существует ли уже пользователь с таким email
        exists = db.query(User).filter_by(email=email).first()
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
            db.add(user)
            print(f"Added user {username}")
        else:
            print(f"User with email {email} already exists.")

    db.commit()
    print("Seeding complete.")
