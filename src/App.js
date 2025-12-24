import React, { useState } from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import '@aws-amplify/ui-react/styles.css';
import { Calendar, CheckCircle, ChevronRight, Car, Wrench } from 'lucide-react';
import * as mutations from './graphql/mutations';

// --- Configuration Setup ---
let config;
try {
  config = require('./aws-exports').default;
  Amplify.configure(config);
} catch (e) {
  console.warn("No aws-exports.js found. Running in offline/demo mode.");
}

const client = generateClient();

// --- Data ---
const PARTS_CATALOG = {
  engineOil: { name: "น้ำมันเครื่อง", options: [{ id: 'eneos', name: "Eneos X", price: 1000 }, { id: 'shell', name: "Shell Helix HX8", price: 1200 }] },
  oilFilter: { name: "ไส้กรองน้ำมันเครื่อง", options: [{ id: 'acdelco', name: "Acdelco", price: 140 }, { id: 'mg', name: "MG Authentic", price: 250 }] },
  airFilter: { name: "กรองอากาศ", options: [{ id: 'acdelco', name: "Acdelco", price: 250 }, { id: 'mg', name: "MG Authentic", price: 355 }] },
  acFilter: { name: "กรองแอร์", options: [{ id: 'acdelco', name: "Acdelco", price: 250 }, { id: 'mg', name: "MG Authentic", price: 700 }] },
  sparkPlug: { name: "หัวเทียน", options: [{ id: 'ngk', name: "NGK", price: 400 }, { id: 'mg', name: "MG Authentic", price: 770 }] },
  gearOil: { name: "น้ำมันเกียร์", options: [{ id: 'aisin', name: "Aisin AFW+", price: 950 }, { id: 'mg', name: "MG Authentic", price: 2700 }] },
  brakeFluid: { name: "น้ำมันเบรค", price: 250, fixed: true },
  drainWasher: { name: "แหวนรองถ่ายน้ำมันเครื่อง", price: 10, fixed: true },
  gearFilter: { name: "กรองน้ำมันเกียร์", price: 840, fixed: true },
  gearOring: { name: "โอริงกรองน้ำมันเกียร์", price: 10, fixed: true },
  gearGasket: { name: "ประเก็นอ่างน้ำมันเกียร์", price: 245, fixed: true },
  gearDrainWasher: { name: "แหวนรองน๊อตถ่ายน้ำมันเกียร์", price: 50, fixed: true },
  gearFillWasher: { name: "แหวนรองเติมน้ำมันเกียร์", price: 64, fixed: true },
  fuelFilter: { name: "กรองน้ำมันเชื้อเพลิง", price: 500, fixed: true }
};

const MILEAGE_RULES = {
  10000: { hours: 1, items: ['engineOil', 'oilFilter', 'drainWasher'] },
  20000: { hours: 1, items: ['engineOil', 'oilFilter', 'drainWasher'] },
  30000: { hours: 2, items: ['engineOil', 'oilFilter', 'drainWasher', 'airFilter', 'sparkPlug'] },
  40000: { hours: 1, items: ['engineOil', 'oilFilter', 'drainWasher', 'acFilter', 'fuelFilter'] },
  50000: { hours: 1, items: ['engineOil', 'oilFilter', 'drainWasher'] },
  60000: { hours: 3, items: ['engineOil', 'oilFilter', 'drainWasher', 'airFilter', 'brakeFluid', 'sparkPlug'] },
  70000: { hours: 1, items: ['engineOil', 'oilFilter', 'drainWasher'] },
  80000: { hours: 4, items: ['engineOil', 'oilFilter', 'drainWasher', 'acFilter', 'gearOil', 'gearFilter', 'gearOring', 'gearGasket', 'gearDrainWasher', 'gearFillWasher'] },
  90000: { hours: 2, items: ['engineOil', 'oilFilter', 'drainWasher'] },
  100000: { hours: 3, items: ['engineOil', 'oilFilter', 'drainWasher'] }
};

function GarageApp({ signOut, user }) {
  const [page, setPage] = useState('landing');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ mileage: '', carBrand: '', carYear: '', licensePlate: '', selectedParts: {}, date: '', time: '' });

  const handleMileage = (km) => {
    const parts = {};
    if (MILEAGE_RULES[km]) {
      MILEAGE_RULES[km].items.forEach(k => parts[k] = PARTS_CATALOG[k].fixed ? 'fixed' : PARTS_CATALOG[k].options[0].id);
    }
    setData({ ...data, mileage: km, selectedParts: parts });
  };

  const calcTotal = () => {
    if (!data.mileage) return { total: 0 };
    let partsPrice = 0;
    Object.keys(data.selectedParts).forEach(k => {
      const p = PARTS_CATALOG[k];
      if (p.fixed) partsPrice += p.price;
      else partsPrice += p.options.find(o => o.id === data.selectedParts[k])?.price || 0;
    });
    const labor = MILEAGE_RULES[data.mileage].hours * 300;
    return { parts: partsPrice, labor, total: partsPrice + labor };
  };

  const submitBooking = async () => {
    setLoading(true);
    const total = calcTotal();
    
    // Fix: AWS AWSTime requires HH:mm:ss format. We append ":00" to the time string.
    const formattedTime = data.time.length === 5 ? `${data.time}:00` : data.time;

    const input = {
      customerName: user?.username || "Guest",
      phoneNumber: user?.attributes?.phone_number || "-",
      carBrand: data.carBrand,
      carYear: data.carYear,
      licensePlate: data.licensePlate,
      mileage: parseInt(data.mileage),
      selectedItems: JSON.stringify(data.selectedParts),
      totalPrice: total.total,
      bookingDate: data.date, // Format YYYY-MM-DD is correct for AWSDate
      bookingTime: formattedTime, // Fix: Sent as HH:mm:ss
      status: "PENDING"
    };

    console.log("Submitting Booking:", input);

    try {
      if (config) {
        await client.graphql({ query: mutations.createBooking, variables: { input } });
        setPage('success');
      } else {
        // Mock success for offline testing
        alert("Offline Mode: Booking Simulated Success! (Data not saved to Cloud)");
        setPage('success');
      }
    } catch (err) {
      console.error("Booking Error:", err);
      // Show detailed error to user
      let errorMessage = err.message;
      if (err.errors && err.errors.length > 0) {
        errorMessage = err.errors[0].message;
      }
      alert("ไม่สามารถจองได้: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (page === 'landing') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <nav className="bg-slate-900 text-white p-4 flex justify-between">
          <div className="font-bold text-lg flex gap-2"><Wrench className="text-orange-500"/> AutoServe</div>
          <button onClick={signOut} className="bg-red-600 px-3 py-1 rounded text-sm">Logout</button>
        </nav>
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <h1 className="text-3xl font-bold mb-4 text-center">บริการเช็คระยะครบวงจร</h1>
          <button onClick={() => setPage('select')} className="bg-orange-500 text-white px-8 py-3 rounded-lg text-xl font-bold shadow hover:bg-orange-600 flex gap-2">
            <Calendar/> จองคิวเลย
          </button>
        </div>
      </div>
    );
  }

  if (page === 'select') {
    const sum = calcTotal();
    return (
      <div className="min-h-screen bg-gray-50 p-4 pb-20">
        <div className="bg-white p-4 shadow sticky top-0 z-10 flex gap-4 items-center rounded-lg mb-4">
          <button onClick={() => setPage('landing')}>&larr;</button>
          <h2 className="font-bold">เลือกระยะทาง</h2>
        </div>
        
        <div className="max-w-xl mx-auto space-y-4">
          <select className="w-full p-3 border-2 border-orange-500 rounded text-lg" value={data.mileage} onChange={e => handleMileage(parseInt(e.target.value))}>
            <option value="">-- เลือกระยะทาง --</option>
            {[10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000].map(k => <option key={k} value={k}>{k.toLocaleString()} km</option>)}
          </select>

          {data.mileage && (
            <div className="bg-white p-4 rounded shadow space-y-3">
              {MILEAGE_RULES[data.mileage].items.map(k => {
                const p = PARTS_CATALOG[k];
                if (p.fixed) return <div key={k} className="flex justify-between text-sm bg-gray-100 p-2 rounded"><span>{p.name}</span><b>{p.price}</b></div>
                return (
                  <div key={k} className="p-2 border border-blue-200 bg-blue-50 rounded">
                    <div className="text-xs font-bold text-blue-800 mb-1">{p.name}</div>
                    <select className="w-full p-1 border rounded" value={data.selectedParts[k]} onChange={e => setData({...data, selectedParts: {...data.selectedParts, [k]: e.target.value}})}>
                      {p.options.map(o => <option key={o.id} value={o.id}>{o.name} ({o.price})</option>)}
                    </select>
                  </div>
                )
              })}
              <div className="text-right font-bold text-lg text-orange-600 border-t pt-2">รวม {sum.total.toLocaleString()} บาท</div>
            </div>
          )}

          {data.mileage && (
            <div className="bg-white p-4 rounded shadow space-y-3">
              <h3 className="font-bold flex gap-2"><Car size={18}/> ข้อมูลรถ</h3>
              <input placeholder="ยี่ห้อ" className="w-full p-2 border rounded" value={data.carBrand} onChange={e => setData({...data, carBrand: e.target.value})}/>
              <input placeholder="ปีรถ" className="w-full p-2 border rounded" value={data.carYear} onChange={e => setData({...data, carYear: e.target.value})}/>
              <input placeholder="ทะเบียน" className="w-full p-2 border rounded" value={data.licensePlate} onChange={e => setData({...data, licensePlate: e.target.value})}/>
              {data.carBrand && data.licensePlate && 
                <button onClick={() => setPage('schedule')} className="w-full bg-slate-900 text-white py-3 rounded font-bold flex justify-center items-center gap-2 mt-2">ถัดไป <ChevronRight/></button>
              }
            </div>
          )}
        </div>
      </div>
    );
  }

  if (page === 'schedule') {
    return (
      <div className="min-h-screen bg-gray-50 p-4 pt-10 flex flex-col items-center">
        <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
          <div className="flex gap-4 mb-4"><button onClick={() => setPage('select')}>&larr;</button><h2 className="font-bold">เลือกวันเวลา</h2></div>
          <input type="date" className="w-full p-3 border rounded mb-4" onChange={e => setData({...data, date: e.target.value})}/>
          {data.date && (
            <div className="grid grid-cols-4 gap-2 mb-6">
              {["08:00","09:00","10:00","11:00","13:00","14:00","15:00","16:00"].map(t => (
                <button key={t} onClick={() => setData({...data, time: t})} className={`p-2 rounded border ${data.time === t ? 'bg-orange-500 text-white' : 'bg-gray-50'}`}>{t}</button>
              ))}
            </div>
          )}
          {data.time && (
            <button onClick={submitBooking} disabled={loading} className="w-full bg-green-600 text-white py-3 rounded font-bold">
              {loading ? 'Processing...' : 'ยืนยันการจอง'}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (page === 'success') {
    return (
      <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6 text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mb-4"/>
        <h2 className="text-2xl font-bold mb-2">จองคิวสำเร็จ!</h2>
        <p className="mb-6 text-gray-600">ตรวจสอบอีเมลยืนยันการจอง</p>
        <button onClick={() => window.location.reload()} className="bg-slate-900 text-white px-6 py-2 rounded">กลับหน้าหลัก</button>
      </div>
    );
  }
  return null;
}

export default function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => <GarageApp signOut={signOut} user={user} />}
    </Authenticator>
  );
}