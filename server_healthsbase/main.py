from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from fastapi.middleware.cors import CORSMiddleware

# Настройки базы данных
DATABASE_URL = "postgresql://postgres:787898@localhost/healthsbase_database"

# Инициализация SQLAlchemy
Base = declarative_base()
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Модель пользователя
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String, unique=True)
    password = Column(String)
    fio = Column(String, nullable=True)
    sex = Column(String, nullable=True)
    role = Column(String, nullable=True)
    birth_date = Column(String, nullable=True)
    comment = Column(String, nullable=True)

# Создание таблиц в базе данных
Base.metadata.create_all(bind=engine)

# Создание приложения FastAPI
app = FastAPI()
#CORS
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Модель данных для запроса регистрации
class UserCreate(BaseModel):
    email: EmailStr
    phone: str
    password: str
    fio: str = None
    sex: str = None
    role: str = None
    birth_date: str = None
    comment: str = None

# Функция для создания пользователя
def create_user(db_session, user_data: UserCreate):
    db_user = User(
        email=user_data.email,
        phone=user_data.phone,
        password=user_data.password,
        fio=user_data.fio,
        sex=user_data.sex,
        role=user_data.role,
        birth_date=user_data.birth_date,
        comment=user_data.comment
    )
    db_session.add(db_user)
    db_session.commit()
    db_session.refresh(db_user)
    return db_user

# Регистрация пользователя
@app.post("/register")
async def register_user(user_data: UserCreate):
    db_session = SessionLocal()
    try:
        # Проверка на существующего пользователя
        db_user = db_session.query(User).filter(User.email == user_data.email).first()
        if db_user:
            raise HTTPException(status_code=400, detail="Пользователь с таким email уже существует")
        
        # Создание нового пользователя
        new_user = create_user(db_session, user_data)
        return {"message": "Пользователь зарегистрирован", "user_id": new_user.id}
    finally:
        db_session.close()

# Запуск приложения:
# uvicorn main:app --reload
