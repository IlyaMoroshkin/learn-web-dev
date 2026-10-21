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


class Appointment:
    def __init__(self, id: int, client_name: str, master_id: int, service_id: int, time: str):
        self.id = id
        self.client_name = client_name
        self.master_id = master_id
        self.service_id = service_id
        self.time = time


appointments = []


def create_appointment(
    client_name: str,
    master_id: int,
    service_id: int,
    time: str,
) -> Appointment | None:
    master = get_master(master_id)
    service = get_service(service_id)

    if master is None or service is None:
        return None

    if not client_name:
        return None

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


print("=== Задание 1 ===")

a1 = create_appointment("Иван", 1, 1, "10:00")
print(a1)
print(a1.client_name)
print(a1.master_id)
print(a1.service_id)
print(a1.time)

appointments.clear()
a2 = create_appointment("", 1, 1, "10:00")
print(a2)
print(len(appointments))

print()

print("=== Задание 2 ===")

appointments.clear()

a3 = create_appointment("Иван", 1, 1, "00:00")
print(a3)

a4 = create_appointment("Иван", 1, 1, "21:00")
print(a4)

a5 = create_appointment("Иван", 1, 1, "08:00")
print(a5.time)

a6 = create_appointment("Иван", 1, 1, "20:00")
print(a6.time)

print(len(appointments))
