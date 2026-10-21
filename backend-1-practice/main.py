# ── Вспомогательные классы (уже существуют в боевом коде) ──────────────────

class Master:
    def __init__(self, master_id: int, name: str):
        self.master_id = master_id
        self.name = name


class Service:
    def __init__(self, service_id: int, title: str):
        self.service_id = service_id
        self.title = title


masters = [
    Master(1, "Анна"),
    Master(2, "Мария"),
]

services = [
    Service(1, "Стрижка"),
    Service(2, "Маникюр"),
]


def get_master(master_id: int) -> Master | None:
    for m in masters:
        if m.master_id == master_id:
            return m
    return None


def get_service(service_id: int) -> Service | None:
    for s in services:
        if s.service_id == service_id:
            return s
    return None


# ── Задание 1. Класс Appointment ────────────────────────────────────────────

class Appointment:
    def __init__(self, id: int, client_name: str, master_id: int, service_id: int, time: str):
        self.id = id
        self.client_name = client_name
        self.master_id = master_id
        self.service_id = service_id
        self.time = time


appointments = []


# ── Задание 2. Функция create_appointment с валидацией времени ──────────────

def create_appointment(
    client_name: str,
    master_id: int,
    service_id: int,
    time: str,
) -> Appointment | None:
    master = get_master(master_id)
    service = get_service(service_id)

    # Мастер или услуга не найдены
    if master is None or service is None:
        return None

    # Задание 1: имя клиента не должно быть пустым
    if not client_name:
        return None

    # Задание 2: салон работает с 08:00 до 20:00
    try:
        h, m = map(int, time.split(":"))
        total_minutes = h * 60 + m
        if total_minutes < 8 * 60 or total_minutes > 20 * 60:
            return None
    except Exception:
        return None

    appointment = Appointment(
        id=len(appointments) + 1,
        client_name=client_name,
        master_id=master.master_id,
        service_id=service.service_id,
        time=time,
    )
    appointments.append(appointment)
    return appointment


# ── Тесты Задание 1 ─────────────────────────────────────────────────────────

print("=== Задание 1 ===")

# Успешная запись
a1 = create_appointment("Иван", 1, 1, "10:00")
print(a1)              # <__main__.Appointment object ...>
print(a1.client_name)  # Иван
print(a1.master_id)    # 1
print(a1.service_id)   # 1
print(a1.time)         # 10:00

# Пустое имя — запись не создаётся
appointments.clear()
a2 = create_appointment("", 1, 1, "10:00")
print(a2)              # None
print(len(appointments))  # 0

print()

# ── Тесты Задание 2 ─────────────────────────────────────────────────────────

print("=== Задание 2 ===")

appointments.clear()

# Запись до открытия салона — None
a3 = create_appointment("Иван", 1, 1, "00:00")
print(a3)  # None

# Запись после закрытия — None
a4 = create_appointment("Иван", 1, 1, "21:00")
print(a4)  # None

# Граничное значение — 08:00 (допустимо)
a5 = create_appointment("Иван", 1, 1, "08:00")
print(a5.time)  # 08:00

# Граничное значение — 20:00 (допустимо)
a6 = create_appointment("Иван", 1, 1, "20:00")
print(a6.time)  # 20:00

print(len(appointments))  # 2
