import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.database import engine, SessionLocal, Base
from app.models import Zone, Worker, Complaint, ComplaintEvent
from app.classifier import classifier_instance
from app.priority import calculate_priority_score

# 19 BMC (Brihanmumbai Municipal Corporation) Administrative Wards & GPS Coordinates
SECTORS_DATA = [
    {"name": "Ward A (Colaba, Fort & Marine Drive)", "sector_code": "WARD-A", "lat": 18.9220, "lng": 72.8347},
    {"name": "Ward C (Marine Lines, Kalbadevi & Bhuleshwar)", "sector_code": "WARD-C", "lat": 18.9480, "lng": 72.8258},
    {"name": "Ward D (Malabar Hill, Grant Road & Walkeshwar)", "sector_code": "WARD-D", "lat": 18.9600, "lng": 72.8120},
    {"name": "Ward F/North (Matunga, Sion & Wadala)", "sector_code": "WARD-FN", "lat": 19.0300, "lng": 72.8600},
    {"name": "Ward G/South (Worli, Lower Parel & Prabhadevi)", "sector_code": "WARD-GS", "lat": 19.0100, "lng": 72.8180},
    {"name": "Ward G/North (Dadar West, Dharavi & Mahim)", "sector_code": "WARD-GN", "lat": 19.0380, "lng": 72.8420},
    {"name": "Ward H/West (Bandra West, Khar & Santacruz West)", "sector_code": "WARD-HW", "lat": 19.0550, "lng": 72.8300},
    {"name": "Ward H/East (Bandra East, Santacruz East & BKC)", "sector_code": "WARD-HE", "lat": 19.0600, "lng": 72.8550},
    {"name": "Ward K/West (Andheri West, Juhu & Lokhandwala)", "sector_code": "WARD-KW", "lat": 19.1200, "lng": 72.8250},
    {"name": "Ward K/East (Andheri East, Marol & MIDC)", "sector_code": "WARD-KE", "lat": 19.1150, "lng": 72.8690},
    {"name": "Ward P/South (Goregaon West & East)", "sector_code": "WARD-PS", "lat": 19.1650, "lng": 72.8480},
    {"name": "Ward P/North (Malad West & East)", "sector_code": "WARD-PN", "lat": 19.1860, "lng": 72.8485},
    {"name": "Ward R/South (Kandivali West & East)", "sector_code": "WARD-RS", "lat": 19.2060, "lng": 72.8500},
    {"name": "Ward R/Central (Borivali West & East, Gorai)", "sector_code": "WARD-RC", "lat": 19.2300, "lng": 72.8560},
    {"name": "Ward L (Kurla, Sakinaka & Chandivali)", "sector_code": "WARD-L", "lat": 19.0720, "lng": 72.8800},
    {"name": "Ward M/East (Chembur, Govandi & Mankhurd)", "sector_code": "WARD-ME", "lat": 19.0550, "lng": 72.9050},
    {"name": "Ward N (Ghatkopar West & East, Vidyavihar)", "sector_code": "WARD-N", "lat": 19.0860, "lng": 72.9080},
    {"name": "Ward S (Powai, Bhandup & Kanjurmarg)", "sector_code": "WARD-S", "lat": 19.1350, "lng": 72.9250},
    {"name": "Ward T (Mulund West & East)", "sector_code": "WARD-T", "lat": 19.1720, "lng": 72.9560}
]

# Dedicated BMC municipal ward field officers and engineers
WORKERS_NAMES = [
    ("Mahesh Shinde (Sub-Engineer)", "Ward H/West (Bandra West, Khar & Santacruz West)", "+91 98200 45001", "Roads & Traffic Dept"),
    ("Pooja Kadam (Sanitary Inspector)", "Ward G/North (Dadar West, Dharavi & Mahim)", "+91 98200 45002", "Solid Waste Management (SWM) Dept"),
    ("Rajesh Sawant (Assistant Engineer)", "Ward K/West (Andheri West, Juhu & Lokhandwala)", "+91 98200 45003", "Stormwater Drains (SWD) Dept"),
    ("Sunil Chalke (Junior Engineer)", "Ward L (Kurla, Sakinaka & Chandivali)", "+91 98200 45004", "Hydraulic Engineer (Water Supply)"),
    ("Vikram Gaikwad (Overseer)", "Ward N (Ghatkopar West & East, Vidyavihar)", "+91 98200 45005", "Public Health & Sanitation Dept"),
    ("Sanjay Kamble (Mukadam)", "Ward R/Central (Borivali West & East, Gorai)", "+91 98200 45006", "Roads & Traffic Dept"),
    ("Kishore More (Ward Officer)", "Ward A (Colaba, Fort & Marine Drive)", "+91 98200 45007", "Solid Waste Management (SWM) Dept"),
    ("Nitin Parab (Assistant Engineer)", "Ward G/South (Worli, Lower Parel & Prabhadevi)", "+91 98200 45008", "Stormwater Drains (SWD) Dept"),
    ("Ganesh Tawde (Junior Engineer)", "Ward S (Powai, Bhandup & Kanjurmarg)", "+91 98200 45009", "Hydraulic Engineer (Water Supply)"),
    ("Sachin Mhatre (Supervisor)", "Ward P/North (Malad West & East)", "+91 98200 45010", "Public Health & Sanitation Dept"),
    ("Ashok Jadhav (Sub-Engineer)", "Ward K/East (Andheri East, Marol & MIDC)", "+91 98200 45011", "Roads & Traffic Dept"),
    ("Dattatray Pawar (Inspector)", "Ward M/East (Chembur, Govandi & Mankhurd)", "+91 98200 45012", "Solid Waste Management (SWM) Dept"),
    ("Vinod Salvi (Junior Engineer)", "Ward T (Mulund West & East)", "+91 98200 45013", "Stormwater Drains (SWD) Dept"),
    ("Ravindra Rane (Overseer)", "Ward D (Malabar Hill, Grant Road & Walkeshwar)", "+91 98200 45014", "Hydraulic Engineer (Water Supply)"),
    ("Prashant Patil (Supervisor)", "Ward F/North (Matunga, Sion & Wadala)", "+91 98200 45015", "Public Health & Sanitation Dept"),
    ("Deepak Bhoir (Mukadam)", "Ward H/East (Bandra East, Santacruz East & BKC)", "+91 98200 45016", "Roads & Traffic Dept"),
    ("Sandesh Gurav (Sanitary Inspector)", "Ward R/South (Kandivali West & East)", "+91 98200 45017", "Solid Waste Management (SWM) Dept")
]

# 10 realistic Mumbai municipal complaint scenarios
SEED_COMPLAINT_TEMPLATES = [
    {
        "text": "Bandra West Linking Road near KFC signal pe bahut bada pothole hai bike gir sakti hai please repair urgently",
        "zone": "Ward H/West (Bandra West, Khar & Santacruz West)",
        "lat": 19.0560,
        "lng": 72.8310
    },
    {
        "text": "Andheri subway mein paani bhar gaya hai drain blocked hai gaadi band pad gayi heavy waterlogging",
        "zone": "Ward K/West (Andheri West, Juhu & Lokhandwala)",
        "lat": 19.1210,
        "lng": 72.8270
    },
    {
        "text": "Huge garbage pile dumped outside Dadar flower market rotting vegetable waste causing foul smell",
        "zone": "Ward G/North (Dadar West, Dharavi & Mahim)",
        "lat": 19.0390,
        "lng": 72.8430
    },
    {
        "text": "LBS Marg Ghatkopar main drinking water pipeline burst heavy water leakage flooding the road",
        "zone": "Ward N (Ghatkopar West & East, Vidyavihar)",
        "lat": 19.0870,
        "lng": 72.9090
    },
    {
        "text": "Public toilet near Kurla railway platform West choked completely human waste spilling onto footpath",
        "zone": "Ward L (Kurla, Sakinaka & Chandivali)",
        "lat": 19.0730,
        "lng": 72.8810
    },
    {
        "text": "Deep potholes on Western Express Highway near Goregaon Hub flyover traffic moving very slow",
        "zone": "Ward P/South (Goregaon West & East)",
        "lat": 19.1660,
        "lng": 72.8490
    },
    {
        "text": "Hindmata Dadar storm water drain clogged knee-deep water stagnation after rain",
        "zone": "Ward F/North (Matunga, Sion & Wadala)",
        "lat": 19.0310,
        "lng": 72.8610
    },
    {
        "text": "Colaba Causeway municipal garbage bin overfilled plastic waste flying onto road",
        "zone": "Ward A (Colaba, Fort & Marine Drive)",
        "lat": 18.9230,
        "lng": 72.8350
    },
    {
        "text": "Drinking water supply contaminated and muddy in Worli BDD chawl area health risk",
        "zone": "Ward G/South (Worli, Lower Parel & Prabhadevi)",
        "lat": 19.0110,
        "lng": 72.8190
    },
    {
        "text": "Community toilet block in Chembur Govandi choked flush not working foul smell",
        "zone": "Ward M/East (Chembur, Govandi & Mankhurd)",
        "lat": 19.0560,
        "lng": 72.9060
    }
]

def seed_database(db: Session):
    print("Training BMC Mumbai ML classifier pipeline...")
    classifier_metrics = classifier_instance.train()
    print(f"Classifier trained: Accuracy={classifier_metrics['accuracy']}, Macro F1={classifier_metrics['f1_score']}")

    # Drop and recreate tables to ensure schema matches
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    # 1. Seed BMC Administrative Wards
    for s in SECTORS_DATA:
        z = Zone(name=s["name"], sector_code=s["sector_code"], lat=s["lat"], lng=s["lng"])
        db.add(z)
    db.commit()

    # 2. Seed BMC Municipal Workers
    workers_list = []
    for name, z_name, phone, dept in WORKERS_NAMES:
        w = Worker(name=name, zone=z_name, phone=phone, department=dept, status="available", is_synthetic=True)
        db.add(w)
        workers_list.append(w)
    db.commit()

    # 3. Seed EXACTLY 10 Clean Initial Complaints (BMC Mumbai Showcase)
    now = datetime.utcnow()
    statuses_pattern = ["reported", "reported", "reported", "assigned", "assigned", "in_progress", "in_progress", "resolved", "reported", "assigned"]

    for i in range(10):
        item = SEED_COMPLAINT_TEMPLATES[i % len(SEED_COMPLAINT_TEMPLATES)]
        raw_text = item["text"]
        zone_name = item["zone"]
        lat = item["lat"] + random.uniform(-0.001, 0.001)
        lng = item["lng"] + random.uniform(-0.001, 0.001)

        cls_result = classifier_instance.predict(raw_text)
        category = cls_result["category"]
        department = cls_result["department"]

        created_minutes_ago = (10 - i) * 25
        created_at = now - timedelta(minutes=created_minutes_ago)

        status = statuses_pattern[i]
        assigned_at = None
        resolved_at = None
        assigned_worker_id = None

        matching_workers = [w for w in workers_list if w.zone == zone_name]
        worker = matching_workers[0] if matching_workers else random.choice(workers_list)

        if status in ["assigned", "in_progress", "resolved"]:
            assigned_at = created_at + timedelta(minutes=10)
            assigned_worker_id = worker.id

        if status == "resolved":
            resolved_at = assigned_at + timedelta(minutes=45)

        priority_score = calculate_priority_score(category, created_at, zone_name, db)

        complaint = Complaint(
            raw_text=raw_text,
            category=category,
            department=department,
            zone=zone_name,
            priority_score=priority_score,
            status=status,
            photo_url=None,
            is_synthetic=True,
            duplicate_count=1,
            is_duplicate=False,
            created_at=created_at,
            assigned_at=assigned_at,
            resolved_at=resolved_at,
            assigned_worker_id=assigned_worker_id,
            lat=round(lat, 5),
            lng=round(lng, 5)
        )
        db.add(complaint)
        db.flush()

        ev1 = ComplaintEvent(
            complaint_id=complaint.id,
            event_type="CREATED",
            timestamp=created_at,
            details=f"Citizen reported municipal issue via BMC app. Auto-classified as '{category}' ({department})."
        )
        db.add(ev1)

        if assigned_at:
            ev2 = ComplaintEvent(
                complaint_id=complaint.id,
                event_type="ASSIGNED",
                timestamp=assigned_at,
                details=f"Assigned to BMC field staff '{worker.name}' ({worker.phone}, {worker.department})."
            )
            db.add(ev2)

        if status in ["in_progress", "resolved"]:
            ev3 = ComplaintEvent(
                complaint_id=complaint.id,
                event_type="STATUS_CHANGED",
                timestamp=assigned_at + timedelta(minutes=10),
                details=f"Status set to 'in_progress'. BMC maintenance team deployed on-site."
            )
            db.add(ev3)

        if resolved_at:
            ev4 = ComplaintEvent(
                complaint_id=complaint.id,
                event_type="RESOLVED",
                timestamp=resolved_at,
                details=f"Issue resolved and verified by BMC Ward engineering team."
            )
            db.add(ev4)

    db.commit()
    print(f"Successfully seeded {len(SECTORS_DATA)} BMC Wards, {len(workers_list)} workers, and EXACTLY 10 synthetic complaints with events!")
