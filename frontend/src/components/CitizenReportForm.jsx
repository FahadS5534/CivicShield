import React, { useState, useEffect, useMemo } from 'react';
import { Send, MapPin, Camera, Sparkles, CheckCircle2, AlertTriangle, RefreshCw, Layers, ChevronDown, Compass, Check } from 'lucide-react';
import axios from 'axios';

export const ALL_BMC_WARDS = [
  { id: "ward-a", name: "Ward A (Colaba, Fort & Marine Drive)", sector_code: "WARD-A", region: "South Mumbai", lat: 18.9220, lng: 72.8347 },
  { id: "ward-c", name: "Ward C (Marine Lines, Kalbadevi & Bhuleshwar)", sector_code: "WARD-C", region: "South Mumbai", lat: 18.9480, lng: 72.8258 },
  { id: "ward-d", name: "Ward D (Malabar Hill, Grant Road & Walkeshwar)", sector_code: "WARD-D", region: "South Mumbai", lat: 18.9600, lng: 72.8120 },
  { id: "ward-fn", name: "Ward F/North (Matunga, Sion & Wadala)", sector_code: "WARD-FN", region: "South Central", lat: 19.0300, lng: 72.8600 },
  { id: "ward-gs", name: "Ward G/South (Worli, Lower Parel & Prabhadevi)", sector_code: "WARD-GS", region: "South Central", lat: 19.0100, lng: 72.8180 },
  { id: "ward-gn", name: "Ward G/North (Dadar West, Dharavi & Mahim)", sector_code: "WARD-GN", region: "Central Mumbai", lat: 19.0380, lng: 72.8420 },
  { id: "ward-hw", name: "Ward H/West (Bandra West, Khar & Santacruz West)", sector_code: "WARD-HW", region: "Western Suburbs", lat: 19.0550, lng: 72.8300 },
  { id: "ward-he", name: "Ward H/East (Bandra East, Santacruz East & BKC)", sector_code: "WARD-HE", region: "Western Suburbs", lat: 19.0600, lng: 72.8550 },
  { id: "ward-kw", name: "Ward K/West (Andheri West, Juhu & Lokhandwala)", sector_code: "WARD-KW", region: "Western Suburbs", lat: 19.1200, lng: 72.8250 },
  { id: "ward-ke", name: "Ward K/East (Andheri East, Marol & MIDC)", sector_code: "WARD-KE", region: "Western Suburbs", lat: 19.1150, lng: 72.8690 },
  { id: "ward-ps", name: "Ward P/South (Goregaon West & East)", sector_code: "WARD-PS", region: "Western Suburbs", lat: 19.1650, lng: 72.8480 },
  { id: "ward-pn", name: "Ward P/North (Malad West & East)", sector_code: "WARD-PN", region: "Western Suburbs", lat: 19.1860, lng: 72.8485 },
  { id: "ward-rs", name: "Ward R/South (Kandivali West & East)", sector_code: "WARD-RS", region: "Western Suburbs", lat: 19.2060, lng: 72.8500 },
  { id: "ward-rc", name: "Ward R/Central (Borivali West & East, Gorai)", sector_code: "WARD-RC", region: "Western Suburbs", lat: 19.2300, lng: 72.8560 },
  { id: "ward-l", name: "Ward L (Kurla, Sakinaka & Chandivali)", sector_code: "WARD-L", region: "Eastern Suburbs", lat: 19.0720, lng: 72.8800 },
  { id: "ward-me", name: "Ward M/East (Chembur, Govandi & Mankhurd)", sector_code: "WARD-ME", region: "Eastern Suburbs", lat: 19.0550, lng: 72.9050 },
  { id: "ward-n", name: "Ward N (Ghatkopar West & East, Vidyavihar)", sector_code: "WARD-N", region: "Eastern Suburbs", lat: 19.0860, lng: 72.9080 },
  { id: "ward-s", name: "Ward S (Powai, Bhandup & Kanjurmarg)", sector_code: "WARD-S", region: "Eastern Suburbs", lat: 19.1350, lng: 72.9250 },
  { id: "ward-t", name: "Ward T (Mulund West & East)", sector_code: "WARD-T", region: "Eastern Suburbs", lat: 19.1720, lng: 72.9560 }
];

const WARD_KEYWORDS = [
  { keywords: ["dadar", "hindmata", "dharavi", "mahim", "shivaji park", "tt circle", "shindewadi"], ward: "Ward G/North (Dadar West, Dharavi & Mahim)" },
  { keywords: ["colaba", "causeway", "fort", "marine drive", "cuffe parade", "churchgate", "csmt", "cst"], ward: "Ward A (Colaba, Fort & Marine Drive)" },
  { keywords: ["marine lines", "kalbadevi", "bhuleshwar", "zaveri bazaar", "crawford"], ward: "Ward C (Marine Lines, Kalbadevi & Bhuleshwar)" },
  { keywords: ["malabar hill", "grant road", "walkeshwar", "girgaon", "chowpatty", "tardeo"], ward: "Ward D (Malabar Hill, Grant Road & Walkeshwar)" },
  { keywords: ["matunga", "sion", "wadala", "gtb nagar", "antop hill"], ward: "Ward F/North (Matunga, Sion & Wadala)" },
  { keywords: ["worli", "lower parel", "prabhadevi", "currey road", "sea face"], ward: "Ward G/South (Worli, Lower Parel & Prabhadevi)" },
  { keywords: ["bandra west", "bandra bandstand", "bandstand", "carter road", "linking road", "khar west", "pali hill"], ward: "Ward H/West (Bandra West, Khar & Santacruz West)" },
  { keywords: ["bandra east", "bkc", "kurla complex", "santacruz east", "vakola", "kalanagar"], ward: "Ward H/East (Bandra East, Santacruz East & BKC)" },
  { keywords: ["andheri west", "juhu", "lokhandwala", "versova", "oshiwara"], ward: "Ward K/West (Andheri West, Juhu & Lokhandwala)" },
  { keywords: ["andheri east", "saki naka", "sakinaka", "marol", "midc", "seepz", "chakala"], ward: "Ward K/East (Andheri East, Marol & MIDC)" },
  { keywords: ["goregaon", "aarey", "hub flyover", "oberoi mall"], ward: "Ward P/South (Goregaon West & East)" },
  { keywords: ["malad", "inorbit", "mindspace", "marve"], ward: "Ward P/North (Malad West & East)" },
  { keywords: ["kandivali", "thakur complex", "charkop", "mahavir nagar"], ward: "Ward R/South (Kandivali West & East)" },
  { keywords: ["borivali", "gorai", "ic colony", "national park"], ward: "Ward R/Central (Borivali West & East, Gorai)" },
  { keywords: ["kurla", "kamani", "chandivali", "bail bazaar"], ward: "Ward L (Kurla, Sakinaka & Chandivali)" },
  { keywords: ["chembur", "govandi", "mankhurd", "diamond garden"], ward: "Ward M/East (Chembur, Govandi & Mankhurd)" },
  { keywords: ["ghatkopar", "vidyavihar", "pant nagar", "lbs marg"], ward: "Ward N (Ghatkopar West & East, Vidyavihar)" },
  { keywords: ["powai", "bhandup", "kanjurmarg", "hiranandani", "jvlr"], ward: "Ward S (Powai, Bhandup & Kanjurmarg)" },
  { keywords: ["mulund", "nahur"], ward: "Ward T (Mulund West & East)" }
];

const POPULAR_WARDS = [
  { shortName: "Dadar (G/N)", fullName: "Ward G/North (Dadar West, Dharavi & Mahim)" },
  { shortName: "Bandra (H/W)", fullName: "Ward H/West (Bandra West, Khar & Santacruz West)" },
  { shortName: "Andheri (K/E)", fullName: "Ward K/East (Andheri East, Marol & MIDC)" },
  { shortName: "Colaba (A)", fullName: "Ward A (Colaba, Fort & Marine Drive)" },
  { shortName: "Kurla (L)", fullName: "Ward L (Kurla, Sakinaka & Chandivali)" },
  { shortName: "Worli (G/S)", fullName: "Ward G/South (Worli, Lower Parel & Prabhadevi)" },
  { shortName: "Borivali (R/C)", fullName: "Ward R/Central (Borivali West & East, Gorai)" }
];

export default function CitizenReportForm({ zones, onComplaintSubmitted }) {
  // Always fallback to ALL_BMC_WARDS if zones from server is empty or loading
  const activeZones = useMemo(() => {
    return (zones && zones.length > 0) ? zones : ALL_BMC_WARDS;
  }, [zones]);

  const [rawText, setRawText] = useState("");
  const [selectedZone, setSelectedZone] = useState("Ward A (Colaba, Fort & Marine Drive)");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classification, setClassification] = useState(null);
  const [submittedResult, setSubmittedResult] = useState(null);
  const [locationCoords, setLocationCoords] = useState({ lat: 18.9220, lng: 72.8347 });
  const [isClassifying, setIsClassifying] = useState(false);
  const [autoDetectedWard, setAutoDetectedWard] = useState(null);

  // Synchronize coordinates whenever selectedZone or activeZones changes
  useEffect(() => {
    const matched = activeZones.find(z => z.name === selectedZone);
    if (matched) {
      setLocationCoords({ lat: matched.lat, lng: matched.lng });
    }
  }, [selectedZone, activeZones]);

  const QUICK_TEMPLATES = [
    {
      label: "Hindmata Dadar Underpass",
      ward: "Ward G/North (Dadar West, Dharavi & Mahim)",
      text: "Hindmata Dadar TT circle underpass is heavily waterlogged road blocked in rain"
    },
    {
      label: "Colaba Causeway Pothole",
      ward: "Ward A (Colaba, Fort & Marine Drive)",
      text: "Colaba Causeway ke paas bada pothole hai bikes gir rahe hain please repair immediately"
    },
    {
      label: "Mahim Station Toilet Choke",
      ward: "Ward G/North (Dadar West, Dharavi & Mahim)",
      text: "Mahim West near station public toilet choked overflow ho raha hai smell aa rahi hai"
    },
    {
      label: "Bandra Bandstand Garbage",
      ward: "Ward H/West (Bandra West, Khar & Santacruz West)",
      text: "Bandra Bandstand dump yard dustbin overflowing dogs and crows spreading garbage everywhere"
    },
    {
      label: "Andheri Saki Naka Pipe Burst",
      ward: "Ward K/East (Andheri East, Marol & MIDC)",
      text: "Andheri East Saki Naka main pipeline burst tap water completely stopped"
    }
  ];

  // Auto-classify issue and auto-detect ward when user types
  useEffect(() => {
    const textLower = rawText.toLowerCase().trim();

    // 1. Check for ward location keywords
    let foundWard = null;
    for (const item of WARD_KEYWORDS) {
      if (item.keywords.some(kw => textLower.includes(kw))) {
        foundWard = item.ward;
        break;
      }
    }

    if (foundWard) {
      setAutoDetectedWard(foundWard);
      setSelectedZone(foundWard);
      const zObj = activeZones.find(z => z.name === foundWard);
      if (zObj) {
        setLocationCoords({ lat: zObj.lat, lng: zObj.lng });
      }
    } else {
      setAutoDetectedWard(null);
    }

    // 2. Trigger NLP text classifier
    if (rawText.trim().length >= 8) {
      const timer = setTimeout(() => {
        handleClassifyText(rawText);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setClassification(null);
    }
  }, [rawText, activeZones]);

  const handleClassifyText = async (text) => {
    setIsClassifying(true);
    try {
      const res = await axios.post('/api/classify', { raw_text: text });
      setClassification(res.data);
    } catch (err) {
      console.error("Classification error:", err);
    } finally {
      setIsClassifying(false);
    }
  };

  const handleZoneChange = (zoneName) => {
    setSelectedZone(zoneName);
    const z = activeZones.find(item => item.name === zoneName);
    if (z) {
      setLocationCoords({ lat: z.lat, lng: z.lng });
    }
  };

  const handleApplyTemplate = (tmpl) => {
    setRawText(tmpl.text);
    handleZoneChange(tmpl.ward);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rawText.trim() || rawText.length < 3) return;

    setIsSubmitting(true);
    try {
      const payload = {
        raw_text: rawText,
        zone: selectedZone,
        photo_url: photoPreview,
        lat: locationCoords.lat,
        lng: locationCoords.lng
      };

      const res = await axios.post('/api/complaints', payload);
      setSubmittedResult(res.data);
      if (onComplaintSubmitted) onComplaintSubmitted(res.data);
    } catch (err) {
      console.error("Error submitting complaint:", err);
      alert("Failed to submit report. Please check connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setRawText("");
    setPhotoPreview(null);
    setClassification(null);
    setSubmittedResult(null);
    setAutoDetectedWard(null);
  };

  // Find currently selected ward metadata
  const currentWardObj = activeZones.find(z => z.name === selectedZone) || activeZones[0];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 bg-brand-terracotta/10 text-brand-terracotta px-3 py-1 rounded-full text-xs font-bold border border-brand-terracotta/20 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Rapid Mumbaikar Civic Grievance Reporting (&lt; 30 Seconds)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">
          Report a Mumbai Civic Grievance
        </h1>
        <p className="text-xs sm:text-sm text-brand-stone mt-2 max-w-lg mx-auto">
          Potholes, monsoon waterlogging, dry taps / pipe bursts, choked toilets, or uncollected garbage across Mumbai? Type in Bambaiya Hindi, Marathi, Hinglish, or English.
        </p>
      </div>

      {submittedResult ? (
        submittedResult.already_reported ? (
          /* Already Reported Duplicate Alert Card */
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-amber/40 shadow-lg text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-brand-amber-light rounded-full flex items-center justify-center mx-auto border border-brand-amber/30 text-brand-amber">
              <Layers className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold text-brand-amber uppercase tracking-wider bg-brand-amber-light px-2.5 py-1 rounded-full border border-brand-amber/30">
                Already Reported Issue Flagged
              </span>
              <h3 className="text-xl font-bold text-brand-dark mt-2">This Civic Issue Was Already Reported!</h3>
              <p className="text-xs text-brand-stone mt-1">
                An active ticket <span className="font-mono font-semibold text-brand-dark">#{submittedResult.id.substring(0, 10)}</span> already exists for <strong className="capitalize">{submittedResult.category.replace('_', ' ')}</strong> in {submittedResult.zone}.
              </p>
            </div>

            <div className="bg-brand-amber-light/40 rounded-xl p-4 border border-brand-amber/30 text-left space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-brand-amber/20 pb-2">
                <span className="text-brand-stone">Current Status:</span>
                <span className="font-bold text-brand-emerald bg-brand-emerald-light px-2 py-0.5 rounded uppercase text-[10px]">
                  {submittedResult.status}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-brand-amber/20 pb-2">
                <span className="text-brand-stone">Total Citizen Reports:</span>
                <span className="font-bold text-brand-dark text-sm">{submittedResult.duplicate_count || 2} Citizen Reports</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-stone">Escalated Priority Score:</span>
                <span className="font-bold text-brand-terracotta text-sm">{submittedResult.priority_score} / 100 🔥</span>
              </div>
            </div>

            <p className="text-xs text-brand-dark bg-brand-linen p-3 rounded-xl border border-brand-border italic">
              ✨ Your report has been merged into the existing ticket and its priority score was automatically boosted to ensure faster BMC field action!
            </p>

            <button
              onClick={handleResetForm}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-brand-dark text-white hover:bg-black transition-all flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Report Another Issue</span>
            </button>
          </div>
        ) : (
          /* Normal Submission Success Card */
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-emerald/30 shadow-lg text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-brand-emerald-light rounded-full flex items-center justify-center mx-auto border border-brand-emerald/20 text-brand-emerald">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-brand-dark">Civic Grievance Registered!</h3>
              <p className="text-xs text-brand-stone mt-1">Ticket ID: <span className="font-mono font-semibold text-brand-dark">{submittedResult.id}</span></p>
            </div>

            <div className="bg-brand-linen rounded-xl p-4 border border-brand-border text-left grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-brand-stone block">Assigned Dept</span>
                <span className="font-bold text-brand-dark">{submittedResult.department}</span>
              </div>
              <div>
                <span className="text-brand-stone block">Detected Category</span>
                <span className="font-bold text-brand-terracotta capitalize">{submittedResult.category.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-brand-stone block">Priority Score</span>
                <span className="font-bold text-brand-amber text-sm">{submittedResult.priority_score} / 100</span>
              </div>
              <div>
                <span className="text-brand-stone block">Status</span>
                <span className="font-bold text-brand-emerald bg-brand-emerald-light px-2 py-0.5 rounded-md border border-brand-emerald/20 inline-block mt-0.5 uppercase tracking-wider text-[10px]">
                  {submittedResult.status}
                </span>
              </div>
            </div>

            <p className="text-xs text-brand-stone italic">
              This issue has been placed directly into the BMC Ward Staff Queue and assigned a priority score based on severity, traffic density, and monsoon hazard.
            </p>

            <button
              onClick={handleResetForm}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-brand-dark text-white hover:bg-black transition-all flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Report Another Issue</span>
            </button>
          </div>
        )
      ) : (
        /* Active Form */
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-border shadow-xs space-y-6">
          
          {/* Quick Preset Buttons (Text + Auto-Ward Setting) */}
          <div>
            <label className="block text-xs font-semibold text-brand-stone mb-2">
              Quick One-Tap Examples (Auto-selects Ward & Text):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl)}
                  className="text-[11px] bg-brand-muted hover:bg-brand-terracotta/10 hover:text-brand-terracotta text-brand-dark px-2.5 py-1.5 rounded-lg border border-brand-border transition-all text-left flex items-center space-x-1 cursor-pointer"
                  title={`Select ${tmpl.ward}`}
                >
                  <MapPin className="w-3 h-3 text-brand-terracotta flex-shrink-0" />
                  <span className="font-medium">{tmpl.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Raw Text Input */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="complaintText" className="text-xs font-bold text-brand-dark">Describe the Issue *</label>
              {isClassifying && (
                <span className="text-[11px] text-brand-amber font-medium flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 animate-spin" />
                  <span>Auto-classifying...</span>
                </span>
              )}
            </div>
            <textarea
              id="complaintText"
              rows={3}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="e.g. Dadar TT Circle underpass mein paani bhar gaya hai gaadiyaan phas rahi hain..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-terracotta bg-brand-linen/30 font-sans"
              required
            />
          </div>

          {/* Classifier Real-Time Preview Badge */}
          {classification && (
            <div className="bg-brand-emerald-light/60 border border-brand-emerald/30 p-3 rounded-xl flex items-center justify-between text-xs animate-in fade-in duration-150">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-brand-emerald" />
                <div>
                  <span className="font-semibold text-brand-dark">Auto-Classifier Result: </span>
                  <span className="font-bold text-brand-emerald capitalize">{classification.category.replace('_', ' ')}</span>
                  <span className="text-brand-stone text-[11px] ml-1">({classification.department})</span>
                </div>
              </div>
              <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded-md border border-brand-emerald/20 text-brand-emerald font-semibold">
                {(classification.confidence * 100).toFixed(0)}% Match
              </span>
            </div>
          )}

          {/* Zone Location Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="wardSelect" className="text-xs font-bold text-brand-dark flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-terracotta" />
                <span>Select BMC Ward / Zone *</span>
              </label>
              {autoDetectedWard && (
                <span className="text-[11px] text-brand-emerald font-bold bg-brand-emerald-light px-2 py-0.5 rounded-full border border-brand-emerald/20 flex items-center space-x-1">
                  <Check className="w-3 h-3" />
                  <span>Auto-matched from text</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Dropdown Menu */}
              <div className="relative">
                <select
                  id="wardSelect"
                  value={selectedZone}
                  onChange={(e) => handleZoneChange(e.target.value)}
                  className="w-full pl-3 pr-8 py-2.5 text-xs rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-terracotta bg-white font-medium cursor-pointer shadow-2xs hover:border-brand-stone/60 transition-all text-brand-dark"
                >
                  {activeZones.map(z => (
                    <option key={z.id || z.name} value={z.name}>
                      {z.name} {z.sector_code ? `(${z.sector_code})` : ''}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-3 pointer-events-none text-brand-stone">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              {/* GPS Coordinates Indicator */}
              <div className="flex items-center justify-between px-3.5 py-2.5 text-xs bg-brand-linen rounded-xl border border-brand-border">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-brand-stone uppercase font-bold block">GPS Coordinates</span>
                  <span className="font-mono text-xs font-semibold text-brand-dark">
                    {locationCoords.lat.toFixed(4)}° N, {locationCoords.lng.toFixed(4)}° E
                  </span>
                </div>
                <span className="text-[10px] bg-brand-emerald-light text-brand-emerald px-2 py-1 rounded-md font-bold border border-brand-emerald/20 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse"></span>
                  <span>GPS Synced</span>
                </span>
              </div>
            </div>

            {/* Quick Ward Chips for Top Areas */}
            <div className="pt-1">
              <span className="text-[10px] font-bold text-brand-stone uppercase tracking-wider block mb-1">
                Quick Ward Jump:
              </span>
              <div className="flex flex-wrap gap-1">
                {POPULAR_WARDS.map((pw, i) => {
                  const isCurrent = selectedZone === pw.fullName;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleZoneChange(pw.fullName)}
                      className={`text-[10px] px-2 py-0.5 rounded-md border transition-all cursor-pointer font-medium ${
                        isCurrent
                          ? 'bg-brand-emerald text-white border-brand-emerald shadow-2xs'
                          : 'bg-white hover:bg-brand-linen text-brand-dark border-brand-border'
                      }`}
                    >
                      {pw.shortName}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Photo Upload (Optional) */}
          <div>
            <label className="block text-xs font-bold text-brand-dark mb-1.5">Attach Photo Evidence (Optional)</label>
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold border border-brand-border bg-brand-muted hover:bg-brand-border cursor-pointer text-brand-dark transition-all">
                <Camera className="w-4 h-4 text-brand-terracotta" />
                <span>{photoPreview ? "Change Photo" : "Upload / Take Photo"}</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>

              {photoPreview && (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-brand-border shadow-xs">
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotoPreview(null)}
                    className="absolute top-0 right-0 bg-red-600 text-white w-4 h-4 text-[10px] flex items-center justify-center font-bold cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !rawText.trim()}
            className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-brand-terracotta hover:bg-brand-terracotta-hover text-white transition-all flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Submitting Grievance...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Civic Grievance</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-brand-stone text-center">
            Anonymous citizen reporting • No account required • Instant priority assignment
          </p>
        </form>
      )}

    </div>
  );
}
