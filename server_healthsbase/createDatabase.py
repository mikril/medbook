from sqlalchemy import create_engine, Column, Integer, String,DateTime, Boolean, Date, ForeignKey, Text, Float, event, Table, MetaData, and_, asc
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, Session

# Настройки базы данных
#DATABASE_URL = "postgresql://postgres:787898@192.168.0.112:5432/healthsbase_database"
DATABASE_URL = "postgresql://healthsbase:787898@healthsbase_database:5432/healthsbase"
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
    dose_type = Column(String, nullable=True)
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