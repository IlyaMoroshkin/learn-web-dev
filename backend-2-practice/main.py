from fastapi import FastAPI, HTTPException

app = FastAPI()

masters = [
    {"id": 1, "name": "Анна"},
    {"id": 2, "name": "Мария"},
]

categories = [
    {"id": 1, "name": "Стрижки и укладки", "servicesCount": 5},
    {"id": 2, "name": "Маникюр и педикюр", "servicesCount": 5},
    {"id": 3, "name": "Брови и ресницы", "servicesCount": 4},
    {"id": 4, "name": "Спа-процедуры", "servicesCount": 4},
]


@app.get("/")
def root():
    return {"message": "Salon API"}


@app.get("/masters")
def get_masters():
    return masters


@app.get("/masters/{master_id}")
def get_master(master_id: int):
    for master in masters:
        if master["id"] == master_id:
            return master
    raise HTTPException(status_code=404, detail="Master not found")


@app.get("/categories")
def get_categories():
    return categories


@app.get("/categories/{category_id}")
def get_category(category_id: int):
    for category in categories:
        if category["id"] == category_id:
            return category
    raise HTTPException(status_code=404, detail="Category not found")
