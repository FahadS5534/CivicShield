import os
import pickle
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score, classification_report

MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "trained_model.pkl")

# BMC (Brihanmumbai Municipal Corporation) Department Mappings
CATEGORY_DEPARTMENTS = {
    "pothole_road_damage": "Roads & Traffic Dept",
    "waterlogging_blocked_drain": "Stormwater Drains (SWD) Dept",
    "no_water_pipeline_leak": "Hydraulic Engineer (Water Supply)",
    "toilet_sanitation_choke": "Public Health & Sanitation Dept",
    "garbage_overflow": "Solid Waste Management (SWM) Dept"
}

# Authentic Mumbai Bambaiya, Marathi, Hinglish & English civic complaint dataset
RAW_TRAINING_DATA = [
    # pothole_road_damage (Roads & Traffic Dept)
    ("Bandra West Linking Road pe bahut bada pothole hai bike gir sakti hai", "pothole_road_damage"),
    ("Huge pothole on Western Express Highway near Goregaon hub flyover", "pothole_road_damage"),
    ("SV Road Andheri West pe road tut gaya hai dangerous crater pothole", "pothole_road_damage"),
    ("Dadar TT circle ke paas road kharab hai deep potholes causing traffic jam", "pothole_road_damage"),
    ("Road cave-in near Kurla station West side dangerous for vehicles", "pothole_road_damage"),
    ("Potholes all over LBS Marg Ghatkopar vehicles getting damaged", "pothole_road_damage"),
    ("Footpath paver blocks broken near Churchgate station walking unsafe", "pothole_road_damage"),
    ("Borivali West Link Road pe road repair needed craters everywhere", "pothole_road_damage"),
    ("Deep pothole near Sion circle causing two-wheeler accidents", "pothole_road_damage"),
    ("Sadak pe khadde pad gaye hain Malad West near Inorbit mall signal", "pothole_road_damage"),
    ("Asphalt washed away road completely broken Chembur Diamond Garden", "pothole_road_damage"),
    ("Pothole problem on Jogeshwari Vikhroli Link Road JVLR near Powai", "pothole_road_damage"),
    ("Mulund West MG Road broken road and big potholes repair urgently", "pothole_road_damage"),
    ("Colaba Causeway pedestrian footpath damaged stones loose", "pothole_road_damage"),
    ("Worli Sea Face service road has huge pothole causing car tyre burst", "pothole_road_damage"),
    ("Khadde pad gaye hain sadak pe Kandivali East Thakur Complex", "pothole_road_damage"),
    ("Tar layer peeled off exposing sharp gravel Lower Parel flyover", "pothole_road_damage"),
    ("Dangerous uneven road surface near BKC MTNL junction pothole", "pothole_road_damage"),
    ("Severe road damage outside Dadar flower market road uneven", "pothole_road_damage"),
    ("Potholes after rain near Dahisar toll naka traffic moving at snail speed", "pothole_road_damage"),
    ("Road broken footpath caved in Santacruz West near station", "pothole_road_damage"),
    ("Manhole cover broken and sunken creating huge hole in road Vile Parle", "pothole_road_damage"),
    ("Sadak pe khadda hai please BMC road team repair karo Prabhadevi", "pothole_road_damage"),
    ("Major pothole cluster on Marol Andheri East road near metro pillar", "pothole_road_damage"),
    ("Broken divider and crater on road near Wadala truck terminal", "pothole_road_damage"),

    # waterlogging_blocked_drain (Stormwater Drains - SWD Dept)
    ("Andheri subway mein paani bhar gaya hai drain blocked hai gaadi band pad gayi", "waterlogging_blocked_drain"),
    ("Hindmata Dadar waterlogging naali choked dirty water on road", "waterlogging_blocked_drain"),
    ("Milan subway Santacruz waterlogged nullah overflowing completely", "waterlogging_blocked_drain"),
    ("Gandhi Market King Circle storm water drain clogged knee-deep water", "waterlogging_blocked_drain"),
    ("Kurla Kamani junction road flooded drain choked with plastic waste", "waterlogging_blocked_drain"),
    ("Nullah cleaning not done in Dharavi drain water entering houses", "waterlogging_blocked_drain"),
    ("Dahisar subway flooded waterlogging traffic diverted SWD action needed", "waterlogging_blocked_drain"),
    ("Open storm drain overflowing with black sewage on Bandra East road", "waterlogging_blocked_drain"),
    ("Ghatkopar station road waterlogged naali jam ho gaya paani nahi nikal raha", "waterlogging_blocked_drain"),
    ("Mankhurd railway bridge underpass waterlogged choked stormwater line", "waterlogging_blocked_drain"),
    ("Rainwater blocked on SV Road Malad due to clogged roadside gutters", "waterlogging_blocked_drain"),
    ("Sewage drain overflowing onto pedestrian walk near Wadala monorail", "waterlogging_blocked_drain"),
    ("Choked roadside storm drain flooding shops in Kalbadevi market", "waterlogging_blocked_drain"),
    ("Heavy water stagnation and choked gutter in Sion Koliwada", "waterlogging_blocked_drain"),
    ("Nullah overflowing near Chunabhatti railway station area", "waterlogging_blocked_drain"),
    ("Drainage line chocked rainwater accumulating in Borivali IC Colony", "waterlogging_blocked_drain"),
    ("Open drain in Powai near Hiranandani choked with debris foul smell", "waterlogging_blocked_drain"),
    ("Waterlogging outside Grant Road station gutter completely blocked", "waterlogging_blocked_drain"),
    ("Naali jaam hai ganda paani sadak pe fail raha hai Chembur Naka", "waterlogging_blocked_drain"),
    ("Stormwater outlet near Worli drain mouth blocked with garbage bags", "waterlogging_blocked_drain"),
    ("Heavy waterlogging in Jogeshwari West subway drainage not working", "waterlogging_blocked_drain"),
    ("Clogged drain flooding society gate in Kandivali Lokhandwala", "waterlogging_blocked_drain"),
    ("Stagnant drain water breeding mosquitoes near Byculla zoo side road", "waterlogging_blocked_drain"),
    ("Road flooded due to blocked drainage outside Mulund station East", "waterlogging_blocked_drain"),
    ("Rain water accumulation choked gutters near Crawford Market", "waterlogging_blocked_drain"),

    # no_water_pipeline_leak (Hydraulic Engineer - Water Supply)
    ("Major drinking water pipeline burst in Ghatkopar water gushing on road", "no_water_pipeline_leak"),
    ("No tap water supply in Bandra West Pali Hill for last 2 days", "no_water_pipeline_leak"),
    ("BMC tap water is dirty and muddy contaminated water coming Dadar", "no_water_pipeline_leak"),
    ("Water supply completely stopped in Andheri East MIDC area", "no_water_pipeline_leak"),
    ("Main pipeline leakage wasting drinking water near Powai lake road", "no_water_pipeline_leak"),
    ("Water pressure very low taps running totally dry in Borivali West", "no_water_pipeline_leak"),
    ("Paani bilkul nahi aa raha subah se Kurla West pipe burst", "no_water_pipeline_leak"),
    ("Colaba market area drinking water line dry send water tanker", "no_water_pipeline_leak"),
    ("Contaminated water smelling like drainage in taps Malabar Hill", "no_water_pipeline_leak"),
    ("Underground water pipe leaking thousands of litres in Goregaon West", "no_water_pipeline_leak"),
    ("Drinking water shortage in Chembur Tilak Nagar low pressure", "no_water_pipeline_leak"),
    ("Pipeline burst near Dahisar check naka clean water flooding road", "no_water_pipeline_leak"),
    ("No water in municipal supply line Santacruz East Prabhat Colony", "no_water_pipeline_leak"),
    ("Water contamination yellow dirty water coming in taps Worli BDD chawl", "no_water_pipeline_leak"),
    ("Drinking water pipe cracked by construction work in Lower Parel", "no_water_pipeline_leak"),
    ("Nal band hai paani nahi mil raha log pareshan hain Dharavi", "no_water_pipeline_leak"),
    ("Municipal water pipeline leak near Mulund toll plaza", "no_water_pipeline_leak"),
    ("Water valve broken continuous wastage of water in Malad Marve road", "no_water_pipeline_leak"),
    ("Zero water supply in Vile Parle East since yesterday morning", "no_water_pipeline_leak"),
    ("Bhandup West water tank pipeline ruptured urgent hydraulic repair", "no_water_pipeline_leak"),
    ("Drinking water smells toxic and muddy in Kandivali Charkop", "no_water_pipeline_leak"),
    ("No water supply in chawl area Grant Road East send municipal tanker", "no_water_pipeline_leak"),
    ("Leakage in underground main water line near Marine Drive crossroad", "no_water_pipeline_leak"),
    ("Water pipeline broken near Sion hospital water supply cutoff", "no_water_pipeline_leak"),
    ("Paani ki tanki khali tap dry in Kalina Santacruz East", "no_water_pipeline_leak"),

    # toilet_sanitation_choke (Public Health & Sanitation Dept)
    ("Public toilet block near Dadar station East choked and overflowing", "toilet_sanitation_choke"),
    ("Foul smell and leaking sewage from community toilet in Dharavi", "toilet_sanitation_choke"),
    ("Bandra West Bandstand public toilet flush broken feces on floor", "toilet_sanitation_choke"),
    ("Urinal overflow dirty smell near Kurla railway platform exit", "toilet_sanitation_choke"),
    ("Public toilet choked human waste spilling onto pavement Andheri West", "toilet_sanitation_choke"),
    ("Shauchalay full ho gaya hai dirty water coming out Ghatkopar East", "toilet_sanitation_choke"),
    ("Toilet complex doors broken flush not working Chembur monorail stop", "toilet_sanitation_choke"),
    ("Open urination and broken toilet block near Marine Lines station", "toilet_sanitation_choke"),
    ("Community toilet choked with cloth and waste in Govandi slum area", "toilet_sanitation_choke"),
    ("Municipal public toilet near Juhu beach completely dirty unusable", "toilet_sanitation_choke"),
    ("Shauchalay me toilet paper and human waste flooding Malad station", "toilet_sanitation_choke"),
    ("Sanitation block choked sewage entering walkway Borivali station West", "toilet_sanitation_choke"),
    ("Public toilet tap broken continuous leakage foul smell Sion Koliwada", "toilet_sanitation_choke"),
    ("Toilet choke ho gaya sewage spill near Worli sea face public booth", "toilet_sanitation_choke"),
    ("Severe sewage overflow from pay and use toilet Lower Parel bridge", "toilet_sanitation_choke"),
    ("Toilet block clogged flush broken dirty water outside Mulund bus depot", "toilet_sanitation_choke"),
    ("Community latrine choked up in Mankhurd people cannot step inside", "toilet_sanitation_choke"),
    ("Dirty public toilet near Colaba market please clean immediately", "toilet_sanitation_choke"),
    ("Shauchalay overflow gandi badboo near Vikhroli station road", "toilet_sanitation_choke"),
    ("Public urinal blocked and overflowing on footpath Grant Road station", "toilet_sanitation_choke"),
    ("Ladies toilet cubicle choked in Goregaon railway station subway", "toilet_sanitation_choke"),
    ("Toilet waste leaking onto road outside Bhandup municipal market", "toilet_sanitation_choke"),
    ("Sanitation facility vandalized taps missing basin broken Dadar TT", "toilet_sanitation_choke"),
    ("Bio toilet full and overflowing in Powai lake promenade", "toilet_sanitation_choke"),
    ("Toilet flush not working sewage accumulated Churchgate sub-way", "toilet_sanitation_choke"),

    # garbage_overflow (Solid Waste Management - SWM Dept)
    ("Huge pile of garbage dumped on road near Dadar vegetable market", "garbage_overflow"),
    ("Municipal trash bin overflowing with plastic waste in Bandra Bandstand", "garbage_overflow"),
    ("Kachre ka dher laga hai dustbin full ho gaya hai Andheri Lokhandwala", "garbage_overflow"),
    ("Garbage container overfilled waste spilled on road Kurla West market", "garbage_overflow"),
    ("Solid waste bin full outside Ghatkopar East food stalls foul smell", "garbage_overflow"),
    ("Kachra uthao bin overflowing in Borivali West near station road", "garbage_overflow"),
    ("Illegal debris and garbage dumping along Chembur Eastern Freeway", "garbage_overflow"),
    ("Trash bin overflow near Colaba Causeway garbage flying in wind", "garbage_overflow"),
    ("Kachra bin full makkhiyan aur badboo fail rahi hai Dharavi 90 feet road", "garbage_overflow"),
    ("Dustbin completely full in Malad West Link Road garbage on footpath", "garbage_overflow"),
    ("Waste collection bin overfilled with food waste rotting in Worli", "garbage_overflow"),
    ("Huge garbage dump not cleared for 3 days in Goregaon East station road", "garbage_overflow"),
    ("Kachredan bhar gaya hai dogs spreading trash in Sion West chawl", "garbage_overflow"),
    ("Solid waste container over capacity near Mulund West market", "garbage_overflow"),
    ("Trash bin choked overflowing with plastic bags near Juhu Tara Road", "garbage_overflow"),
    ("Garbage dumping ground smell unbearable in Govandi Shivaji Nagar", "garbage_overflow"),
    ("Dustbin overfilled waste scattered near Lower Parel commercial hub", "garbage_overflow"),
    ("Kachre ki gaadi nahi aayi dustbins are overflowing in Powai JVLR", "garbage_overflow"),
    ("Debris and garbage dumped on footpath outside Marine Drive hotel", "garbage_overflow"),
    ("Rotting vegetable waste dumped outside Byculla market on road", "garbage_overflow"),
    ("Municipal garbage bin overflowing near Kandivali station East", "garbage_overflow"),
    ("Kachra container overflow ho raha hai smell spreading Santacruz West", "garbage_overflow"),
    ("Dead animals and rotting garbage dumped in open plot Bhandup East", "garbage_overflow"),
    ("Trash bin full near Grant Road diamond market clear it immediately", "garbage_overflow"),
    ("Solid waste collection truck needed dustbins completely full Vile Parle", "garbage_overflow")
]

class TextClassifier:
    def __init__(self):
        self.pipeline = None
        self.metrics = {"accuracy": 0.0, "f1_score": 0.0, "samples_count": 0}
        self.is_trained = False

    def train(self):
        texts, labels = zip(*RAW_TRAINING_DATA)
        X_train, X_test, y_train, y_test = train_test_split(
            texts, labels, test_size=0.2, random_state=42, stratify=labels
        )

        self.pipeline = Pipeline([
            ('tfidf', TfidfVectorizer(ngram_range=(1, 2), min_df=1, sublinear_tf=True)),
            ('clf', LogisticRegression(C=1.5, max_iter=200))
        ])

        self.pipeline.fit(X_train, y_train)

        preds = self.pipeline.predict(X_test)
        acc = float(accuracy_score(y_test, preds))
        f1 = float(f1_score(y_test, preds, average='macro'))

        self.metrics = {
            "accuracy": round(acc, 4),
            "f1_score": round(f1, 4),
            "samples_count": len(RAW_TRAINING_DATA),
            "train_size": len(X_train),
            "test_size": len(X_test)
        }
        self.is_trained = True

        try:
            with open(MODEL_PATH, "wb") as f:
                pickle.dump({"pipeline": self.pipeline, "metrics": self.metrics}, f)
        except Exception as e:
            print(f"Warning: Failed to save model: {e}")

        return self.metrics

    def load_or_train(self):
        if os.path.exists(MODEL_PATH):
            try:
                with open(MODEL_PATH, "rb") as f:
                    data = pickle.load(f)
                    self.pipeline = data["pipeline"]
                    self.metrics = data["metrics"]
                    self.is_trained = True
                    return self.metrics
            except Exception:
                pass
        return self.train()

    def predict(self, text: str):
        if not self.is_trained or self.pipeline is None:
            self.load_or_train()

        probs = self.pipeline.predict_proba([text])[0]
        classes = self.pipeline.classes_
        top_idx = int(np.argmax(probs))
        predicted_category = classes[top_idx]
        confidence = float(probs[top_idx])

        department = CATEGORY_DEPARTMENTS.get(predicted_category, "Solid Waste Management (SWM) Dept")

        return {
            "category": str(predicted_category),
            "department": department,
            "confidence": round(confidence, 3)
        }

classifier_instance = TextClassifier()
