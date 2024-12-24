from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy import create_engine, Column, Integer, String,DateTime, Boolean, Date, ForeignKey, Text, Float, event, Table, MetaData, and_, asc
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, Session
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta, time, date
from fastapi.responses import JSONResponse
from typing import List, Dict
import ast
from typing import Optional

# Настройки базы данных
DATABASE_URL = "postgresql://postgres:787898@192.168.0.112:5432/healthsbase_database"

# Инициализация SQLAlchemy
Base = declarative_base()
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Модель пользователя
class Auth(Base):
    __tablename__ = "auth"
    id = Column(Integer, primary_key=True, index=True)
    password = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)
    phone = Column(String, unique=True, nullable=False)
    

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    avatar = Column(String, nullable=True)
    name = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    role = Column(String, nullable=True)
    birthday = Column(Date, nullable=True)
    comment = Column(String, nullable=True)
    id_account = Column(Integer, ForeignKey("auth.id"), nullable=False)
    account = relationship("Auth")

class AnalysesList(Base):
    __tablename__ = "analyses_list"
    id = Column(Integer, primary_key=True, index=True)
    file = Column(Text, nullable=True)  #Ссылка на файл или бинарные данные
    date = Column(Date, nullable=True) 
    id_user = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User")

class Analyzes(Base):
    __tablename__ = "analyzes"
    id = Column(Integer, primary_key=True, index=True)
    units = Column(String, nullable=False)
    value = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    id_list = Column(Integer, ForeignKey("analyses_list.id"), nullable=False)
    date = Column(Date, nullable=True)
    user = relationship("AnalysesList")

# Событие для автоматической установки даты перед добавлением записи
@event.listens_for(Analyzes, "before_insert")
def set_date_before_insert(mapper, connection, target):
    session = Session.object_session(target)  # Получаем текущую сессию
    if session is None:
        return  # Без активной сессии мы не можем получить значение date
    # Ищем запись в таблице AnalysesList с подходящим id_list
    analyses_list = session.query(AnalysesList).filter_by(id=target.id_list).first()
    if analyses_list:
        target.date = analyses_list.date

class Pressure(Base):
    __tablename__ = "pressure"
    id = Column(Integer, primary_key=True, index=True)
    upper = Column(Integer, nullable=False)
    lower = Column(Integer, nullable=False)
    pulse = Column(Integer, nullable=False)
    date = Column(Date, nullable=False)
    id_user = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User")

class ReminderMedicine(Base):
    __tablename__ = "reminders_medicine"
    id = Column(Integer, primary_key=True, index=True)
    id_author = Column(Integer, ForeignKey("users.id"), nullable=False)
    name_medicine = Column(String, nullable=False)
    dose = Column(Float, nullable=True)
    reception_time = Column(String, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    number_times = Column(Integer, nullable=False)
    author = relationship("User")

class ReminderAppointment(Base):
    __tablename__ = "reminders_appointment"
    id = Column(Integer, primary_key=True, index=True)
    id_author = Column(Integer, ForeignKey("users.id"), nullable=False)
    specialization_doctor = Column(String, nullable=False)
    name_clinic = Column(String, nullable=True)
    time_appointment = Column(DateTime, nullable=False)
    author = relationship("User")

class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(Integer, primary_key=True, index=True)
    id_author = Column(Integer, ForeignKey("users.id"), nullable=False)
    specialization_doctor = Column(String, nullable=False)
    date_appointment = Column(Date, nullable=False)
    name_clinic = Column(String, nullable=True)
    doctor_name = Column(String, nullable=True)
    diagnosis = Column(String, nullable=False)
    doctor_prescription = Column(String, nullable=True)
    date_next_appointment = Column(Date, nullable=True)
    photo_appointment = Column(Text, nullable=True)
    author = relationship("User")

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

class AuthLogin(BaseModel):
    phone: str
    password: str

@app.post("/authorizate")
async def login_account(auth: AuthLogin):
    db_session = SessionLocal()
    try:
        # Ищем запись в таблице Auth по номеру телефона
        db_auth = db_session.query(Auth).filter(Auth.phone == auth.phone).first()

        # Если запись не найдена, возвращаем ошибку
        if not db_auth:
            raise HTTPException(status_code=404, detail="Аккаунт с таким номером телефона не найден")

        # Проверяем пароль
        if db_auth.password != auth.password:
            raise HTTPException(status_code=401, detail="Неверный пароль")

        # Ищем пользователя, связанного с этим аккаунтом
        db_user = db_session.query(User).filter(User.id_account == db_auth.id).first()

        # Возвращаем id_account и id_user
        return {
            "id_account": db_auth.id,
            "user_id": db_user.id,
            "message": "Авторизация успешна"
        }

    except Exception as e:
        raise e
    finally:
        db_session.close()

# Модель данных для запроса регистрации
class UserCreate(BaseModel):
    email: EmailStr
    phone: str
    password: str


# Функция для создания пользователя
def create_user_with_auth(db_session, user_data: UserCreate):
    db_user = Auth(
        email=user_data.email,
        phone=user_data.phone,
        password=user_data.password,
    )
    db_session.add(db_user)
    db_session.commit()
    db_session.refresh(db_user)
    user_entry = User(
        # Связь с записью Auth
        avatar="https://m.media-amazon.com/images/M/MV5BMTM1OTczMzYxM15BMl5BanBnXkFtZTcwNTE2MzQ1MQ@@._V1_FMjpg_UX1000_.jpg",
        name="Аноним",
        gender="",
        birthday=None,
        comment="",
        role="",
        id_account=db_user.id
         
    )
    db_session.add(user_entry)
    db_session.commit()
    db_session.refresh(user_entry)
    return db_user

@app.get("/account/{account_id}/users")
async def get_users_by_account(account_id: int):
    db_session = SessionLocal()
    try:
        # Получаем всех пользователей, связанных с данным аккаунтом
        users = db_session.query(User).filter(User.id_account == account_id).all()

        if not users:
            raise HTTPException(status_code=404, detail="Пользователи не найдены для данного аккаунта")

        # Преобразование данных в нужный формат
        users_list = [
            {
                "avatar": user.avatar or "",
                "name": user.name or "",
                "gender": user.gender or "",
                "role": user.role or "",
                "birthDate": user.birthday.strftime("%d.%m.%Y") if user.birthday else None,
                "comment": user.comment or "",
                "id": user.id,
            }
            for user in users
        ]
        return users_list
    finally:
        db_session.close()

# Модель данных для добавления нового пользователя
class NewUserCreate(BaseModel):
    id_account: int

# Добавление нового пользователя в аккаунт
@app.post("/account/{account_id}/add_user")
async def add_user_to_account(account_id: int):
    db_session = SessionLocal()
    try:
        # Проверяем, существует ли аккаунт
        account = db_session.query(Auth).filter(Auth.id == account_id).first()
        if not account:
            raise HTTPException(status_code=404, detail="Аккаунт не найден")

        # Создаём нового пользователя
        new_user = User(
            name="Новый пользователь",
            avatar="https://m.media-amazon.com/images/M/MV5BMTM1OTczMzYxM15BMl5BanBnXkFtZTcwNTE2MzQ1MQ@@._V1_FMjpg_UX1000_.jpg",
            gender="",
            role="",
            birthday=None,
            comment="",
            id_account=account_id
        )

        # Добавляем пользователя в базу данных
        db_session.add(new_user)
        db_session.commit()
        db_session.refresh(new_user)

        return {
            "message": "Новый пользователь успешно добавлен в аккаунт",
            "user": {
                "id": new_user.id,
                "name": new_user.name,
                "avatar": new_user.avatar,
                "gender": new_user.gender,
                "role": new_user.role,
                "birthDate": None,
                "comment": new_user.comment,
            },
        }
    except Exception as e:
        db_session.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db_session.close()


# Регистрация пользователя
@app.post("/register")
async def register_user(user_data: UserCreate):
    #Base.metadata.drop_all(bind=engine)
    #Base.metadata.create_all(bind=engine)
    db_session = SessionLocal()
    try:
        # Проверка на существующего пользователя
        db_user = db_session.query(Auth).filter(Auth.email == user_data.email).first()
        if db_user:
            raise HTTPException(status_code=400, detail="Пользователь с таким email уже существует")
        
        db_user = db_session.query(Auth).filter(Auth.phone == user_data.phone).first()
        if db_user:
            raise HTTPException(status_code=400, detail="Пользователь с таким мобайл фоне уже существует")
        
        # Создание нового пользователя и записи Auth
        new_user = create_user_with_auth(db_session, user_data)

        # Получаем связанные данные пользователя
        db_user = db_session.query(User).filter(User.id_account == new_user.id).first()

        return {
            "message": "Пользователь зарегистрирован",
            "user_id": db_user.id,
            "id_account": db_user.id_account  # Это поле теперь доступно через новый объект User
        }
    except Exception as e:
        db_session.rollback()  # Откат транзакции в случае ошибки
        raise e
    finally:
        db_session.close()

        
# Модель данных для обновления пользователя
class UserUpdate(BaseModel):
    avatar: Optional[str] = None
    name: Optional[str] = None
    gender: Optional[str] = None
    role: Optional[str] = None
    birthday: Optional[date] = None
    comment: Optional[str] = None

# Обновление данных пользователя по ID
@app.patch("/user/{user_id}")
async def update_user(user_id: int, user_data: UserUpdate):
    db_session = SessionLocal()
    try:
        # Поиск пользователя по ID
        user = db_session.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="Пользователь не найден")
        
        # Обновление данных пользователя
        if user_data.avatar is not None:
            user.avatar = user_data.avatar
        if user_data.name is not None:
            user.name = user_data.name
        if user_data.gender is not None:
            user.gender = user_data.gender
        if user_data.role is not None:
            user.role = user_data.role
        if user_data.birthday is not None:
            user.birthday = user_data.birthday
        if user_data.comment is not None:
            user.comment = user_data.comment
        

        # Сохранение изменений
        db_session.commit()
        db_session.refresh(user)

        return {"message": "Данные пользователя обновлены", "user_id": user.id}
    finally:
        db_session.close()
        
        
 # Модель данных для добавления нового напоминания
class ReminderAppointmentCreate(BaseModel):
    specialization_doctor: str
    name_clinic: str
    date_appointment: date  # Только дата
    time_appointment: time  # Только время

# Функция для добавления нового напоминания о приёме
@app.post("/user/{user_id}/reminder_appointment")
async def add_reminder_appointment(user_id: int, reminder_data: ReminderAppointmentCreate):
    db_session = SessionLocal()
    try:
        # Проверяем, существует ли пользователь с данным id_author
        db_user = db_session.query(User).filter(User.id == user_id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="Пользователь не найден")

        # Объединяем дату и время в один объект datetime
        combined_datetime = datetime.combine(reminder_data.date_appointment, reminder_data.time_appointment)

        # Создание новой записи в таблице ReminderAppointment
        new_reminder = ReminderAppointment(
            id_author=user_id,
            specialization_doctor=reminder_data.specialization_doctor,
            name_clinic=reminder_data.name_clinic,
            time_appointment=combined_datetime
        )

        # Добавление записи в базу данных
        db_session.add(new_reminder)
        db_session.commit()
        db_session.refresh(new_reminder)

        return {"message": "Напоминание о приёме успешно добавлено", "reminder_id": new_reminder.id}
    except Exception as e:
        db_session.rollback()  # Откат транзакции в случае ошибки
        raise e
    finally:
        db_session.close()

@app.get("/user/{user_id}/reminders")
async def get_user_reminders(user_id: int):
    db_session = SessionLocal()
    try:
        # Проверяем, существует ли пользователь
        db_user = db_session.query(User).filter(User.id == user_id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="Пользователь не найден")

        # Получаем текущую дату и время
        today = datetime.now()

        # Фильтрация записей по дате и сортировка по дате и времени
        reminders = (
            db_session.query(ReminderAppointment)
            .filter(
                and_(
                    ReminderAppointment.id_author == user_id,
                    ReminderAppointment.time_appointment >= today,
                )
            )
            .order_by(ReminderAppointment.time_appointment.asc())
            .all()
        )

        # Форматируем данные в нужный формат
        reminders_list = [
            {
                "clinic": reminder.name_clinic or "",
                "doctorType": reminder.specialization_doctor,
                "date": reminder.time_appointment.strftime("%d.%m.%Y"),
                "time": reminder.time_appointment.strftime("%H:%M"),
            }
            for reminder in reminders
        ]

        return reminders_list

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db_session.close()        
        
# Получение имени пользователя по ID
@app.get("/user/{user_id}")
async def get_user(user_id: int):
    db_session = SessionLocal()
    try:
        # Получение пользователя из базы данных
        user = db_session.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="Пользователь не найден")
        
        return {"id": user.id, "clientName": user.name, 'avatar': user.avatar}
    finally:
        db_session.close()


# Модель данных для добавления приёма врача
class AppointmentCreate(BaseModel):
    specialization_doctor: str
    date_appointment: date
    name_clinic: str
    doctor_name: str
    diagnosis: str
    doctor_prescription: str = ""
    date_next_appointment: Optional[str] = None
    photo_appointment: str = ""

# Функция для добавления приёма врача
@app.post("/user/{user_id}/appointment")
async def add_appointment(user_id: int, appointment_data: AppointmentCreate):
    db_session = SessionLocal()
    try:
        # Проверяем, существует ли пользователь с данным ID
        db_user = db_session.query(User).filter(User.id == user_id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="Пользователь не найден")

        # Создание новой записи в таблице Appointment
        new_appointment = Appointment(
            id_author=user_id,
            specialization_doctor=appointment_data.specialization_doctor,
            date_appointment=appointment_data.date_appointment,
            name_clinic=appointment_data.name_clinic,
            doctor_name=appointment_data.doctor_name,
            diagnosis=appointment_data.diagnosis,
            doctor_prescription=appointment_data.doctor_prescription,
            date_next_appointment=appointment_data.date_next_appointment,
            photo_appointment=appointment_data.photo_appointment,
        )

        # Добавление записи в базу данных
        db_session.add(new_appointment)
        db_session.commit()
        db_session.refresh(new_appointment)
        return {"message": "Приём врача успешно добавлен", "appointment_id": new_appointment.id}
    except Exception as e:
        db_session.rollback()  # Откат транзакции в случае ошибки
        raise e
    finally:
        db_session.close()

class AppointmentResponse(BaseModel):
    id: int
    specialization_doctor: str
    date_appointment: date
    name_clinic: str
    doctor_name: str
    diagnosis: str
    doctor_prescription: str = None
    date_next_appointment: date = None
    photo_appointment: str = None

    class Config:
        orm_mode = True

@app.get("/user/{user_id}/appointments")
async def get_user_appointments(user_id: int, amount: int = None, specialization: str = None):
    db_session = SessionLocal()
    try:
        # Проверяем, существует ли пользователь
        db_user = db_session.query(User).filter(User.id == user_id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="Пользователь не найден")

        # Получаем все приёмы пользователя
        query = db_session.query(Appointment).filter(Appointment.id_author == user_id).order_by(Appointment.date_appointment.desc())

        # Фильтрация по специализации
        if specialization:
            query = query.filter(Appointment.specialization_doctor == specialization)

        # Получение данных
        appointments_data = query.all()

        if not appointments_data:
            raise HTTPException(status_code=404, detail="Приёмы не найдены")

        # Преобразуем данные в нужный формат
        appointments_list = [
            {
                "id": appointment.id,
                "doctorType": appointment.specialization_doctor,
                "appointmentData": appointment.date_appointment.strftime("%d.%m.%Y"),
                "clinic": appointment.name_clinic,
                "doctorFio": appointment.doctor_name,
                "diagnosis": appointment.diagnosis,
                "doctorComment": appointment.doctor_prescription or "",
                "dateNextAppointment": appointment.date_next_appointment.strftime("%d.%m.%Y") if appointment.date_next_appointment else None,
                "photo": appointment.photo_appointment or "",
            }
            for appointment in appointments_data
        ]

        # Ограничение по количеству записей
        if amount:
            appointments_list = appointments_list[:amount]

        return appointments_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db_session.close()

        
# Модель данных для одного анализа
class Analysis(BaseModel):
    name: str
    value: float
    unit: str

# Модель данных для списка анализов
class AnalyzesCreate(BaseModel):
    date: date
    file: str = None  # Дополнительное поле для файла
    analyzes: list[Analysis]



# Add analyzes
@app.post("/user/{user_id}/analyzes")
async def add_analyzes(user_id: int, analyzes_data: AnalyzesCreate):
    db = SessionLocal()
    try:
        # Check if user exists
        db_user = db.query(User).filter(User.id == user_id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")

        # Create a new entry in the AnalysesList table
        new_analysis_list = AnalysesList(
            date=analyzes_data.date,
            file=analyzes_data.file,
            id_user=user_id
        )
        db.add(new_analysis_list)
        db.commit()
        db.refresh(new_analysis_list)

        # Add data to the Analyzes table
        for analysis in analyzes_data.analyzes:
            if not analysis.name or not analysis.value:
                raise HTTPException(status_code=400, detail="Invalid analysis data")
            new_analysis = Analyzes(
                units=analysis.unit,
                title=analysis.name,
                value=analysis.value,
                id_list=new_analysis_list.id
            )
            db.add(new_analysis)

        db.commit()

        return {"message": "Analyses successfully added", "analysis_list_id": new_analysis_list.id}
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")
    finally:
        db.close()


@app.get("/user/{user_id}/analyzes")
async def get_all_analyzes(user_id: int, amount: int = None, title: str = None):
    db_session = SessionLocal()
    try:
        # Проверяем, существует ли пользователь
        db_user = db_session.query(User).filter(User.id == user_id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="Пользователь не найден")

        # Получаем все анализы пользователя
        query = (
            db_session.query(AnalysesList, Analyzes)
            .join(Analyzes, Analyzes.id_list == AnalysesList.id)
            .filter(AnalysesList.id_user == user_id)
            .order_by(AnalysesList.date.desc(), Analyzes.id.desc())
        )

        # Фильтрация по названию анализа
        if title:
            query = query.filter(Analyzes.title == title)

        # Получение данных
        analyses_data = query.all()

        # Сбор данных в нужном формате
        analyses_dict = {}
        for analysis_list, analysis in analyses_data:
            if analysis.title not in analyses_dict:
                analyses_dict[analysis.title] = {
                    "title": analysis.title,
                    
                    "descriptions": [],
                }
            analyses_dict[analysis.title]["descriptions"].append(
                {
                    "id": analysis.id,
                    "value": float(analysis.value),
                    "text": f"{analysis.value} {analysis.units}",
                    "date": analysis_list.date.strftime("%d.%m.%Y"),
                }
            )

        # Преобразование в список и сортировка по времени добавления
        all_measurements = [
            {
                "title": key,
                "descriptions": sorted(value["descriptions"], key=lambda x: x["date"], reverse=True),
            }
            for key, value in analyses_dict.items()
        ]

        # Ограничение по количеству записей
        if amount:
            for measurement in all_measurements:
                measurement["descriptions"] = measurement["descriptions"][:amount]

        return {"allMeasurements": all_measurements}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db_session.close()


@app.get("/user/{user_id}/last_analyzes")
async def get_last_analyzes(user_id: int):
    db_session = SessionLocal()
    try:
        # Проверяем, существует ли пользователь
        db_user = db_session.query(User).filter(User.id == user_id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="Пользователь не найден")

        # Получаем последние 4 анализа пользователя
        query = (
            db_session.query(AnalysesList, Analyzes)
            .join(Analyzes, Analyzes.id_list == AnalysesList.id)
            .filter(AnalysesList.id_user == user_id)
            .order_by(AnalysesList.date.desc(), Analyzes.id.desc())
            .limit(4)
        )

        # Получение данных
        analyses_data = query.all()

        if not analyses_data:
            return {"lastAnalyzes": []}

        # Форматирование данных
        last_analyzes = [
            {
                "title": analysis.title,
                "value": analysis.value,
                "units": analysis.units,
                "description": f"{analysis.value} {analysis.units}",
                "date": analysis_list.date.strftime("%d.%m.%Y"),
            }
            for analysis_list, analysis in analyses_data
        ]

        return {"lastAnalyzes": last_analyzes}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db_session.close()




# Модель данных для измерения давления
class PressureCreate(BaseModel):
    upper: int
    lower: int
    pulse: int
    date: date

# Модель данных для передачи массива измерений
class PressureCreateBatch(BaseModel):
    measurements: list[PressureCreate]

# Функция для добавления измерений давления массивом
@app.post("/user/{user_id}/pressure")
async def add_pressure_measurements(user_id: int, pressure_data: PressureCreateBatch):
    db_session = SessionLocal()
    print(pressure_data)
    try:
        # Проверяем, существует ли пользователь с данным ID
        db_user = db_session.query(User).filter(User.id == user_id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="Пользователь не найден")
        
        # Обработка массива измерений
        new_pressures = []
        for measurement in pressure_data.measurements:
            new_pressure = Pressure(
                id_user=user_id,
                upper=measurement.upper,
                lower=measurement.lower,
                pulse=measurement.pulse,
                date=measurement.date,
            )
            new_pressures.append(new_pressure)

        # Добавление всех записей в базу данных
        db_session.add_all(new_pressures)
        db_session.commit()

        return {"message": "Измерения давления успешно добавлены", "count": len(new_pressures)}
    except Exception as e:
        db_session.rollback()  # Откат транзакции в случае ошибки
        raise e
    finally:
        db_session.close()

@app.get("/user/{user_id}/pressure")
async def get_pressure_measurements(user_id: int):
    db_session = SessionLocal()
    try:
        # Проверяем, существует ли пользователь с данным ID
        db_user = db_session.query(User).filter(User.id == user_id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="Пользователь не найден")
        
        # Получение записей давления пользователя
        pressure_data = db_session.query(Pressure).filter(Pressure.id_user == user_id).order_by(asc(Pressure.date)).all()

        # Преобразование данных в требуемый формат
        response_data = [
            {
                "date": pressure.date.strftime("%d.%m.%Y"),
                "lower": pressure.lower,
                "upper": pressure.upper,
                "pulse": pressure.pulse,
            }
            for pressure in pressure_data
        ]

        return JSONResponse(content=response_data)
    finally:
        db_session.close()

class ReminderMedicineCreate(BaseModel):
    name_medicine: str
    dose: str
    reception_time: list[str]
    start_date: date
    end_date: date
    number_times: int

@app.post("/user/{user_id}/reminder_medicine")
async def add_reminder_medicine(user_id: int, reminder_data: ReminderMedicineCreate):
    db_session = SessionLocal()
    print()
    try:
        # Проверяем, существует ли пользователь с данным id_author
        db_user = db_session.query(User).filter(User.id == user_id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="Пользователь не найден")

        # Создание новой записи в таблице ReminderMedicine
        for time in reminder_data.reception_time:
            new_reminder = ReminderMedicine(
                id_author=user_id,
                name_medicine=reminder_data.name_medicine,
                dose=int(reminder_data.dose.split(" ")[0]),    
                reception_time=time,  # Каждое время поочередно
                start_date=reminder_data.start_date,
                end_date=reminder_data.end_date,
                number_times=reminder_data.number_times
            )

            # Добавление записи в базу данных
            db_session.add(new_reminder)
            
        db_session.commit()
        db_session.refresh(new_reminder)

        return {"message": "Напоминание о приёме лекарств успешно добавлено", "reminder_id": new_reminder.id}
    except Exception as e:
        db_session.rollback()  # Откат транзакции в случае ошибки
        raise e
    finally:
        db_session.close()

@app.get("/user/{user_id}/reminders_before_date")
async def get_reminders_before_date(user_id: int):
    db_session = SessionLocal()
    current_datetime = datetime.now()  # Текущее время и дата
    
    print(current_datetime.strftime('%H:%M'))
    print(user_id)
    try:
        # Получаем все напоминания для пользователя, которые еще не наступили
        reminders = db_session.query(ReminderMedicine).filter(
            ReminderMedicine.id_author == user_id,
            
            ReminderMedicine.end_date >= current_datetime.date(),
        ).all()
        print(reminders)
        if not reminders:
            raise HTTPException(status_code=404, detail="Напоминания не найдены")

        # Группируем напоминания по датам
        grouped_reminders = {}
        for reminder in reminders:
            
            start_date = reminder.start_date
            number_times = reminder.number_times
            end_date = reminder.end_date
            while start_date < end_date:
                
                reminder_date = start_date.strftime('%d.%m.%Y')
                if datetime.combine(start_date, datetime.strptime(reminder.reception_time, "%H:%M").time()) >= current_datetime:
                    if reminder_date not in grouped_reminders:
                        grouped_reminders[reminder_date] = []

                    # Формируем список лекарств для данной даты кокстсияка 
                    grouped_reminders[reminder_date].append({
                        "name": reminder.name_medicine,
                        "time": reminder.reception_time,
                        "dose": f"{reminder.dose} мг" 
                    })
                
                start_date += timedelta(days=number_times)
        
        # Формируем итоговый список, сортируя по дате
        result = []
        for date, drugs in sorted(grouped_reminders.items()):
            result.append({
                "data": date,
                "drug": sorted(drugs, key=lambda x: x["time"])  # Сортируем по времени
            })

        return {"medicines": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Произошла ошибка: {str(e)}")


@app.get("/user/{user_id}/reminders/nearest")
async def get_nearest_reminders(user_id: int):
    db_session = SessionLocal()
    try:
        # Получение текущей даты
        today = datetime.now().date()

        # Поиск ближайшего напоминания о приеме лекарств
        nearest_medicine = (
            db_session.query(ReminderMedicine)
            .join(User, ReminderMedicine.id_author == User.id)
            .filter(User.id == user_id, ReminderMedicine.end_date >= today)
            .order_by(ReminderMedicine.start_date, ReminderMedicine.reception_time)
            .first()
        )

        # Формирование данных для напоминания о приеме лекарств
        medicine_reminder = None
        if nearest_medicine:
            medicine_date = nearest_medicine.start_date if nearest_medicine.start_date > today else today
            medicine_time = nearest_medicine.reception_time
            description = (
                f"{medicine_date.strftime('%d.%m')} в {medicine_time}"
                if medicine_date > today
                else f"{medicine_time}"
            )
            medicine_reminder = {
                "type": "Прием лекарств",
                "title": nearest_medicine.name_medicine,
                "description": description,
            }

        # Поиск ближайшего напоминания о посещении врача
        nearest_appointment = (
            db_session.query(ReminderAppointment)
            .join(User, ReminderAppointment.id_author == User.id)
            .filter(User.id == user_id, ReminderAppointment.time_appointment >= datetime.now())
            .order_by(ReminderAppointment.time_appointment)
            .first()
        )

        # Формирование данных для напоминания о посещении врача
        appointment_reminder = None
        if nearest_appointment:
            appointment_date = nearest_appointment.time_appointment.date()
            appointment_time = nearest_appointment.time_appointment.strftime("%H:%M")
            description = (
                f"{appointment_date.strftime('%d.%m')} в {appointment_time}"
                if appointment_date > today
                else f"{appointment_time}"
            )
            appointment_reminder = {
                "type": "Посещение врача",
                "title": nearest_appointment.specialization_doctor,
                "description": description,
            }

        # Возвращаем результаты в формате списка
        reminders = []
        if medicine_reminder:
            reminders.append(medicine_reminder)
        if appointment_reminder:
            reminders.append(appointment_reminder)

        return reminders

    finally:
        db_session.close()


@app.delete("/delete/analysis/{analysis_id}")
async def delete_analysis(analysis_id: int):
    db_session = SessionLocal()
    try:
        analysis = db_session.query(Analyzes).filter(Analyzes.id == analysis_id).first()
        if not analysis:
            raise HTTPException(status_code=404, detail="Анализ не найден")

        db_session.delete(analysis)
        db_session.commit()
        return {"message": "Анализ успешно удален"}

    finally:
        db_session.close()


@app.delete("/delete/appointment/{appointment_id}")
async def delete_appointment(appointment_id: int):
    db_session = SessionLocal()
    try:
        appointment = db_session.query(Appointment).filter(Appointment.id == appointment_id).first()
        if not appointment:
            raise HTTPException(status_code=404, detail="Прием не найден")

        db_session.delete(appointment)
        db_session.commit()
        return {"message": "Прием успешно удален"}

    finally:
        db_session.close()

def delete_user_and_dependencies(user_id: int, db: Session):
    try:
        # Получаем все записи из AnalysesList, связанные с пользователем
        analyses_list_ids = db.query(AnalysesList.id).filter(AnalysesList.id_user == user_id).all()

        # Удаляем записи из Analyzes, связанные с AnalysesList
        if analyses_list_ids:
            db.query(Analyzes).filter(Analyzes.id_list.in_([id[0] for id in analyses_list_ids])).delete(synchronize_session=False)

        # Удаляем записи из AnalysesList
        db.query(AnalysesList).filter(AnalysesList.id_user == user_id).delete(synchronize_session=False)

        # Удаляем записи из других зависимых таблиц
        db.query(Pressure).filter(Pressure.id_user == user_id).delete(synchronize_session=False)
        db.query(ReminderMedicine).filter(ReminderMedicine.id_author == user_id).delete(synchronize_session=False)
        db.query(ReminderAppointment).filter(ReminderAppointment.id_author == user_id).delete(synchronize_session=False)
        db.query(Appointment).filter(Appointment.id_author == user_id).delete(synchronize_session=False)

        # Удаляем пользователя
        db.query(User).filter(User.id == user_id).delete(synchronize_session=False)

        db.commit()
    except Exception as e:
        db.rollback()
        raise ValueError(f"Ошибка при удалении: {e}")


@app.delete("/user/delete/{user_id}")
def delete_user(user_id: int):
    db_session = SessionLocal()
    try:
        delete_user_and_dependencies(user_id, db_session)
        return {"message": "Пользователь и все связанные данные успешно удалены"}
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db_session.close()

# Запуск приложения:
# uvicorn main:app --reload
