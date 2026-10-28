from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, Field
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.orm import declarative_base, sessionmaker, Session

DATABASE_URL = "sqlite:///./salon.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Master(Base):
    __tablename__ = "masters"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    specialization = Column(String, nullable=False)


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, nullable=False)
    title = Column(String(100), nullable=False)
    desc = Column(String(100), nullable=False)
    duration = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)


Base.metadata.create_all(bind=engine)

with SessionLocal() as db:
    if db.query(Master).count() == 0:
        db.add_all([
            Master(id=1, name="Анна", specialization="Парикмахер"),
            Master(id=2, name="Мария", specialization="Визажист"),
        ])
        db.commit()


class ServiceCreate(BaseModel):
    categoryId: int
    title: str = Field(min_length=1, max_length=100)
    desc: str = Field(min_length=1, max_length=100)
    duration: int = Field(ge=30, le=180)
    price: float = Field(gt=0)


app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


categories = [
    {"id": 1, "name": "Стрижки и укладки", "servicesCount": 5},
    {"id": 2, "name": "Маникюр и педикюр", "servicesCount": 5},
    {"id": 3, "name": "Брови и ресницы", "servicesCount": 4},
    {"id": 4, "name": "Спа-процедуры", "servicesCount": 4},
]


@app.get("/")
def root():
    return {"message": "Salon API"}


@app.get("/categories")
def get_categories():
    return categories


@app.get("/categories/{category_id}")
def get_category(category_id: int):
    for category in categories:
        if category["id"] == category_id:
            return category
    raise HTTPException(status_code=404, detail="Category not found")


@app.get("/masters")
def get_masters(specialization: str | None = None, db: Session = Depends(get_db)):
    query = db.query(Master)
    if specialization:
        query = query.filter(Master.specialization == specialization)
    masters = query.all()
    return [{"id": m.id, "name": m.name, "specialization": m.specialization} for m in masters]


@app.get("/masters/{master_id}")
def get_master(master_id: int, db: Session = Depends(get_db)):
    master = db.query(Master).filter(Master.id == master_id).first()
    if master is None:
        raise HTTPException(status_code=404, detail="Master not found")
    return {"id": master.id, "name": master.name, "specialization": master.specialization}


@app.post("/services", status_code=201)
def create_service(service: ServiceCreate, db: Session = Depends(get_db)):
    db_service = Service(
        category_id=service.categoryId,
        title=service.title,
        desc=service.desc,
        duration=service.duration,
        price=service.price,
    )
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return {
        "id": db_service.id,
        "categoryId": db_service.category_id,
        "title": db_service.title,
        "desc": db_service.desc,
        "duration": db_service.duration,
        "price": db_service.price,
    }


@app.get("/services")
def get_services(db: Session = Depends(get_db)):
    services = db.query(Service).all()
    return [
        {
            "id": s.id,
            "categoryId": s.category_id,
            "title": s.title,
            "desc": s.desc,
            "duration": s.duration,
            "price": s.price,
        }
        for s in services
    ]


@app.get("/services/{service_id}")
def get_service(service_id: int, db: Session = Depends(get_db)):
    service = db.query(Service).filter(Service.id == service_id).first()
    if service is None:
        raise HTTPException(status_code=404, detail="Service not found")
    return {
        "id": service.id,
        "categoryId": service.category_id,
        "title": service.title,
        "desc": service.desc,
        "duration": service.duration,
        "price": service.price,
    }
