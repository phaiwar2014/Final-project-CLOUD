import React, { useState, useEffect, useCallback } from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import '@aws-amplify/ui-react/styles.css';
import { Calendar, CheckCircle, ChevronRight, Car, Wrench, RefreshCw, Database, Trash2, Plus, X, ArrowLeft } from 'lucide-react';

// นำเข้าคำสั่ง GraphQL ที่ Amplify สร้างให้
import * as mutations from './graphql/mutations';
import * as queries from './graphql/queries';

// --- Configuration Setup ---
let config;
try {
  config = require('./aws-exports').default;
  Amplify.configure(config);
} catch (e) {
  console.warn("No aws-exports.js found. Running in offline/demo mode.");
}

const client = generateClient();

// --- ข้อมูลสำหรับเติมลง Database อัตโนมัติ (Seed Data) ---
const INITIAL_SEED_DATA = [
  // หมวดน้ำมันเครื่อง
  { categoryKey: 'engineOil', categoryName: 'น้ำมันเครื่อง', name: 'Eneos X', price: 1000, isFixed: false },
  { categoryKey: 'engineOil', categoryName: 'น้ำมันเครื่อง', name: 'Shell Helix HX8', price: 1200, isFixed: false },
  // หมวดไส้กรอง
  { categoryKey: 'oilFilter', categoryName: 'ไส้กรองน้ำมันเครื่อง', name: 'Acdelco', price: 140, isFixed: false },
  { categoryKey: 'oilFilter', categoryName: 'ไส้กรองน้ำมันเครื่อง', name: 'MG Authentic', price: 250, isFixed: false },
  // หมวดกรองอากาศ
  { categoryKey: 'airFilter', categoryName: 'กรองอากาศ', name: 'Acdelco', price: 250, isFixed: false },
  { categoryKey: 'airFilter', categoryName: 'กรองอากาศ', name: 'MG Authentic', price: 355, isFixed: false },
  // หมวดกรองแอร์
  { categoryKey: 'acFilter', categoryName: 'กรองแอร์', name: 'Acdelco', price: 250, isFixed: false },
  { categoryKey: 'acFilter', categoryName: 'กรองแอร์', name: 'MG Authentic', price: 700, isFixed: false },
  // หมวดหัวเทียน
  { categoryKey: 'sparkPlug', categoryName: 'หัวเทียน', name: 'NGK', price: 400, isFixed: false },
  { categoryKey: 'sparkPlug', categoryName: 'หัวเทียน', name: 'MG Authentic', price: 770, isFixed: false },
  // หมวดน้ำมันเกียร์
  { categoryKey: 'gearOil', categoryName: 'น้ำมันเกียร์', name: 'Aisin AFW+', price: 950, isFixed: false },
  { categoryKey: 'gearOil', categoryName: 'น้ำมันเกียร์', name: 'MG Authentic', price: 2700, isFixed: false },
  // ของบังคับ (Fixed Items)
  { categoryKey: 'brakeFluid', categoryName: 'น้ำมันเบรค', name: 'น้ำมันเบรคมาตรฐาน', price: 250, isFixed: true },
  { categoryKey: 'drainWasher', categoryName: 'แหวนรองถ่ายน้ำมันเครื่อง', name: 'แหวนรองแท้', price: 10, isFixed: true },
  { categoryKey: 'gearFilter', categoryName: 'กรองน้ำมันเกียร์', name: 'กรองเกียร์แท้', price: 840, isFixed: true },
  { categoryKey: 'gearOring', categoryName: 'โอริงกรองน้ำมันเกียร์', name: 'โอริงแท้', price: 10, isFixed: true },
  { categoryKey: 'gearGasket', categoryName: 'ประเก็นอ่างน้ำมันเกียร์', name: 'ประเก็นแท้', price: 245, isFixed: true },
  { categoryKey: 'gearDrainWasher', categoryName: 'แหวนรองน๊อตถ่ายน้ำมันเกียร์', name: 'แหวนรองน๊อตถ่ายฯ', price: 50, isFixed: true },
  { categoryKey: 'gearFillWasher', categoryName: 'แหวนรองเติมน้ำมันเกียร์', name: 'แหวนรองเติมฯ', price: 64, isFixed: true },
  { categoryKey: 'fuelFilter', categoryName: 'กรองน้ำมันเชื้อเพลิง', name: 'กรองเชื้อเพลิง', price: 500, isFixed: true },
];

const CATEGORY_OPTIONS = [
    { key: 'engineOil', name: 'น้ำมันเครื่อง' },
    { key: 'oilFilter', name: 'ไส้กรองน้ำมันเครื่อง' },
    { key: 'airFilter', name: 'กรองอากาศ' },
    { key: 'acFilter', name: 'กรองแอร์' },
    { key: 'sparkPlug', name: 'หัวเทียน' },
    { key: 'gearOil', name: 'น้ำมันเกียร์' },
    { key: 'brakeFluid', name: 'น้ำมันเบรค (Fixed)' },
    { key: 'drainWasher', name: 'แหวนรองถ่ายน้ำมันเครื่อง (Fixed)' },
    { key: 'gearFilter', name: 'กรองน้ำมันเกียร์ (Fixed)' },
    { key: 'gearOring', name: 'โอริงกรองน้ำมันเกียร์ (Fixed)' },
    { key: 'gearGasket', name: 'ประเก็นอ่างน้ำมันเกียร์ (Fixed)' },
    { key: 'gearDrainWasher', name: 'แหวนรองน๊อตถ่ายน้ำมันเกียร์ (Fixed)' },
    { key: 'gearFillWasher', name: 'แหวนรองเติมน้ำมันเกียร์ (Fixed)' },
    { key: 'fuelFilter', name: 'กรองน้ำมันเชื้อเพลิง (Fixed)' },
];

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
  const [partsCatalog, setPartsCatalog] = useState({});
  const [isInitializing, setIsInitializing] = useState(false);
  const [data, setData] = useState({ mileage: '', carBrand: '', carYear: '', licensePlate: '', selectedParts: {}, date: '', time: '' });
  
  // Admin State
  const [newPart, setNewPart] = useState({ categoryKey: 'engineOil', name: '', price: '' });

  // ใช้ useCallback เพื่อป้องกันการสร้างฟังก์ชันใหม่ทุกครั้งที่ render
  const fetchPartsAndAutoInit = useCallback(async () => {
    try {
      if (!config) return; 
      
      let partData = await client.graphql({ query: queries.listParts });
      let rawParts = partData.data.listParts.items;
      
      // LOGIC: ถ้า Database ว่างเปล่า ให้เติมข้อมูลอัตโนมัติทันที
      if (rawParts.length === 0) {
        console.log("Database ว่างเปล่า... กำลังติดตั้งข้อมูลเริ่มต้นอัตโนมัติ...");
        setIsInitializing(true);
        
        // Seed ข้อมูล
        try {
            for (const item of INITIAL_SEED_DATA) {
                await client.graphql({
                    query: mutations.createPart,
                    variables: { input: item }
                });
            }
            console.log("Seeding complete. Fetching data again...");
            // ดึงข้อมูลใหม่อีกครั้งหลังจาก Seed เสร็จ
            partData = await client.graphql({ query: queries.listParts });
            rawParts = partData.data.listParts.items;
        } catch (seedError) {
            console.error("Auto seed failed:", seedError);
            alert("เกิดปัญหาในการเตรียมข้อมูลสินค้า: " + seedError.message);
        }
      }

      console.log("Loaded Parts:", rawParts);
      setIsInitializing(false);

      const formattedCatalog = {};
      
      rawParts.forEach(part => {
        if (!formattedCatalog[part.categoryKey]) {
          formattedCatalog[part.categoryKey] = {
            name: part.categoryName,
            fixed: part.isFixed,
            options: [],
            price: part.isFixed ? part.price : 0 
          };
        }
        
        // เก็บทุกรายการไว้ใน options เสมอ เพื่อให้หน้า Admin เห็นครบทุกอัน (แม้จะชื่อซ้ำ)
        // แต่สำหรับหน้า Select (User) เราจะกรองซ้ำทีหลัง หรือใช้ Logic เดิม
        formattedCatalog[part.categoryKey].options.push({
            id: part.id, 
            name: part.name,
            price: part.price
        });
      });

      setPartsCatalog(formattedCatalog);
    } catch (err) {
      console.error("Error fetching parts:", err);
      setIsInitializing(false);
    }
  }, []); // dependency array ว่างเปล่าเพราะใช้ค่าคงที่ภายนอกทั้งหมด

  // 1. โหลดข้อมูลสินค้าเมื่อเข้าเว็บ (Mount)
  useEffect(() => {
    fetchPartsAndAutoInit();
  }, [fetchPartsAndAutoInit]); // ใส่ dependency ได้แล้วเพราะครอบด้วย useCallback

  // --- Admin Functions ---
  const handleAddPart = async (e) => {
    e.preventDefault();
    if(!newPart.name || !newPart.price) return;
    setLoading(true);

    const categoryInfo = CATEGORY_OPTIONS.find(c => c.key === newPart.categoryKey);
    const isFixedItem = newPart.categoryKey.includes('Fixed') || 
                        ['brakeFluid','drainWasher','gearFilter','gearOring','gearGasket','gearDrainWasher','gearFillWasher','fuelFilter'].includes(newPart.categoryKey);

    const input = {
        categoryKey: newPart.categoryKey,
        categoryName: categoryInfo ? categoryInfo.name.replace(' (Fixed)', '') : 'อื่นๆ',
        name: newPart.name,
        price: parseInt(newPart.price),
        isFixed: isFixedItem
    };

    try {
        await client.graphql({
            query: mutations.createPart,
            variables: { input }
        });
        alert('เพิ่มสินค้าเรียบร้อย!');
        setNewPart({ categoryKey: 'engineOil', name: '', price: '' });
        fetchPartsAndAutoInit(); // โหลดข้อมูลใหม่
    } catch (err) {
        alert('Error adding part: ' + err.message);
    } finally {
        setLoading(false);
    }
  };

  const handleDeletePart = async (id) => {
    if(!window.confirm('ยืนยันการลบสินค้านี้?')) return;
    setLoading(true);
    try {
        await client.graphql({
            query: mutations.deletePart,
            variables: { input: { id } }
        });
        fetchPartsAndAutoInit(); // โหลดข้อมูลใหม่
    } catch (err) {
        alert('Error deleting part: ' + err.message);
    } finally {
        setLoading(false);
    }
  };

  // --- User Functions ---

  const handleMileage = (km) => {
    const parts = {};
    if (MILEAGE_RULES[km]) {
      MILEAGE_RULES[km].items.forEach(k => {
        const cat = partsCatalog[k];
        if (cat) {
            parts[k] = cat.fixed ? 'fixed' : (cat.options[0]?.id || '');
        }
      });
    }
    setData({ ...data, mileage: km, selectedParts: parts });
  };

  const calcTotal = () => {
    if (!data.mileage) return { total: 0 };
    let partsPrice = 0;
    
    Object.keys(data.selectedParts).forEach(k => {
      const cat = partsCatalog[k];
      if (!cat) return;

      if (cat.fixed) {
        // กรณี Fixed ราคาจะมาจากตัวหมวดหมู่ (ซึ่งจริงๆควรมาจาก Item ตัวแรกในหมวดนั้นถ้าใน DB)
        // เพื่อความชัวร์ ดึงราคาจาก Option ตัวแรกที่เจอในหมวด Fixed
        const fixedItem = cat.options[0];
        if(fixedItem) partsPrice += fixedItem.price;
      } else {
        const selectedOption = cat.options.find(o => o.id === data.selectedParts[k]);
        if (selectedOption) partsPrice += selectedOption.price;
      }
    });
    
    const labor = MILEAGE_RULES[data.mileage].hours * 300;
    return { parts: partsPrice, labor, total: partsPrice + labor };
  };

  const submitBooking = async () => {
    setLoading(true);
    const total = calcTotal();
    const formattedTime = data.time.length === 5 ? `${data.time}:00` : data.time;

    const readableItems = {};
    Object.keys(data.selectedParts).forEach(key => {
        const cat = partsCatalog[key];
        if(cat){
             if(cat.fixed) {
                const fixedItem = cat.options[0];
                if(fixedItem) readableItems[cat.name] = `${cat.name} (${fixedItem.price})`;
            } else {
                const opt = cat.options.find(o => o.id === data.selectedParts[key]);
                if(opt) readableItems[cat.name] = `${opt.name} (${opt.price})`;
            }
        }
    });

    const input = {
      customerName: user?.username || "Guest",
      phoneNumber: user?.attributes?.phone_number || "-",
      carBrand: data.carBrand,
      carYear: data.carYear,
      licensePlate: data.licensePlate,
      mileage: parseInt(data.mileage),
      selectedItems: JSON.stringify(readableItems),
      totalPrice: total.total,
      bookingDate: data.date,
      bookingTime: formattedTime,
      status: "PENDING"
    };

    try {
      if (config) {
        await client.graphql({ query: mutations.createBooking, variables: { input } });
        setPage('success');
      } else {
        alert("โหมด Offline: บันทึกจำลองสำเร็จ");
        setPage('success');
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Views ---

  if (page === 'landing') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <nav className="bg-slate-900 text-white p-4 flex justify-between items-center">
          <div className="font-bold text-lg flex gap-2"><Wrench className="text-orange-500"/> AutoServe</div>
          <div className="flex gap-2">
             <button onClick={() => setPage('admin')} className="bg-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-600 flex items-center gap-1">
                <Database size={14}/> จัดการสินค้า (Admin)
             </button>
             <button onClick={signOut} className="bg-red-600 px-3 py-1 rounded text-sm">Logout</button>
          </div>
        </nav>
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <h1 className="text-3xl font-bold mb-4 text-slate-800">ศูนย์บริการครบวงจร</h1>
          <button onClick={() => setPage('select')} className="bg-orange-500 text-white px-8 py-3 rounded-lg text-xl font-bold shadow hover:bg-orange-600 flex gap-2 transition transform hover:scale-105">
            <Calendar/> จองคิวเลย
          </button>
        </div>
      </div>
    );
  }

  if (page === 'admin') {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-white p-4 shadow sticky top-0 z-10 flex gap-4 items-center rounded-lg mb-4">
                <button onClick={() => setPage('landing')} className="font-bold text-gray-500 flex items-center gap-1"><ArrowLeft size={18}/> กลับ</button>
                <h2 className="font-bold text-lg">จัดการสินค้าใน Database</h2>
            </div>

            <div className="max-w-4xl mx-auto p-4 space-y-6">
                
                {/* Form เพิ่มสินค้า */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-700"><Plus size={20}/> เพิ่มสินค้าใหม่</h3>
                    <form onSubmit={handleAddPart} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่</label>
                            <select 
                                className="w-full p-2 border rounded"
                                value={newPart.categoryKey}
                                onChange={e => setNewPart({...newPart, categoryKey: e.target.value})}
                            >
                                {CATEGORY_OPTIONS.map(opt => <option key={opt.key} value={opt.key}>{opt.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อสินค้า / ยี่ห้อ</label>
                            <input 
                                className="w-full p-2 border rounded" 
                                placeholder="เช่น Mobil 1, Bosch"
                                value={newPart.name}
                                onChange={e => setNewPart({...newPart, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ราคา (บาท)</label>
                            <input 
                                type="number"
                                className="w-full p-2 border rounded" 
                                placeholder="0"
                                value={newPart.price}
                                onChange={e => setNewPart({...newPart, price: e.target.value})}
                            />
                        </div>
                        <button type="submit" disabled={loading} className="bg-green-600 text-white p-2 rounded font-bold hover:bg-green-700">
                            {loading ? 'Processing...' : 'บันทึก'}
                        </button>
                    </form>
                </div>

                {/* List รายการสินค้า */}
                <div className="space-y-4">
                    {Object.keys(partsCatalog).map(catKey => {
                        const cat = partsCatalog[catKey];
                        return (
                            <div key={catKey} className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="bg-slate-100 p-3 font-bold border-b flex justify-between">
                                    <span>{cat.name}</span>
                                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">{catKey}</span>
                                </div>
                                <div className="divide-y">
                                    {cat.options.length === 0 && <div className="p-3 text-gray-400 text-sm text-center">ไม่มีรายการ</div>}
                                    {cat.options.map(item => (
                                        <div key={item.id} className="p-3 flex justify-between items-center hover:bg-gray-50">
                                            <div>
                                                <div className="font-medium text-gray-800">{item.name}</div>
                                                <div className="text-sm text-gray-500">{item.price} บาท</div>
                                            </div>
                                            <button 
                                                onClick={() => handleDeletePart(item.id)}
                                                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                                                title="ลบรายการนี้"
                                            >
                                                <Trash2 size={18}/>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>

            </div>
        </div>
    );
  }

  if (page === 'select') {
    const sum = calcTotal();
    const isDataLoaded = Object.keys(partsCatalog).length > 0;

    return (
      <div className="min-h-screen bg-gray-50 p-4 pb-20">
        <div className="bg-white p-4 shadow sticky top-0 z-10 flex gap-4 items-center rounded-lg mb-4">
          <button onClick={() => setPage('landing')} className="font-bold text-gray-500">&larr; กลับ</button>
          <h2 className="font-bold text-lg">เลือกระยะทาง</h2>
        </div>
        
        {isInitializing ? (
            <div className="text-center p-10 bg-white rounded shadow text-gray-500">
                <RefreshCw className="animate-spin w-8 h-8 mx-auto mb-4 text-orange-500"/>
                <p className="font-bold text-lg">กำลังเตรียมระบบครั้งแรก...</p>
                <p className="text-sm text-gray-400">ระบบกำลังนำเข้าข้อมูลสินค้าอัตโนมัติ กรุณารอสักครู่</p>
            </div>
        ) : !isDataLoaded ? (
            <div className="text-center p-10 bg-white rounded shadow text-gray-500">
                <RefreshCw className="animate-spin w-8 h-8 mx-auto mb-4"/>
                <p>กำลังโหลดข้อมูลสินค้า...</p>
            </div>
        ) : (
            <div className="max-w-xl mx-auto space-y-4">
            <select className="w-full p-3 border-2 border-orange-500 rounded text-lg bg-white" value={data.mileage} onChange={e => handleMileage(parseInt(e.target.value))}>
                <option value="">-- เลือกระยะทาง --</option>
                {[10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000].map(k => <option key={k} value={k}>{k.toLocaleString()} km</option>)}
            </select>

            {data.mileage && (
                <div className="bg-white p-4 rounded shadow space-y-3 animate-fade-in">
                {MILEAGE_RULES[data.mileage].items.map(k => {
                    const cat = partsCatalog[k];
                    if (!cat) return <div key={k} className="text-red-500 text-xs">ไม่พบข้อมูล: {k}</div>;

                    if (cat.fixed) {
                         const fixedItem = cat.options[0];
                         const price = fixedItem ? fixedItem.price : cat.price;
                         return <div key={k} className="flex justify-between text-sm bg-gray-100 p-2 rounded"><span>{cat.name}</span><b>{price}</b></div>
                    }
                    
                    // กรองชื่อซ้ำสำหรับหน้า User Select (แสดงเฉพาะชื่อที่ไม่ซ้ำ)
                    // เราจะแสดง options โดยใช้ Map เพื่อกำจัดชื่อซ้ำ
                    const uniqueOptions = [];
                    const map = new Map();
                    cat.options.forEach(item => {
                        if(!map.has(item.name)){
                            map.set(item.name, true);
                            uniqueOptions.push(item);
                        }
                    });

                    return (
                    <div key={k} className="p-2 border border-blue-200 bg-blue-50 rounded">
                        <div className="text-xs font-bold text-blue-800 mb-1">{cat.name}</div>
                        <select className="w-full p-2 border rounded bg-white" value={data.selectedParts[k]} onChange={e => setData({...data, selectedParts: {...data.selectedParts, [k]: e.target.value}})}>
                        {uniqueOptions.map(o => <option key={o.id} value={o.id}>{o.name} ({o.price}.-)</option>)}
                        </select>
                    </div>
                    )
                })}
                <div className="flex justify-between items-center border-t pt-4">
                    <span className="text-gray-600">ค่าแรง ({MILEAGE_RULES[data.mileage].hours} ชม.)</span>
                    <span className="text-gray-600">{MILEAGE_RULES[data.mileage].hours * 300}.-</span>
                </div>
                <div className="flex justify-between items-center font-bold text-xl text-orange-600">
                    <span>รวมทั้งสิ้น</span>
                    <span>{sum.total.toLocaleString()} บาท</span>
                </div>
                </div>
            )}

            {data.mileage && (
                <div className="bg-white p-4 rounded shadow space-y-3">
                <h3 className="font-bold flex gap-2"><Car size={18}/> ข้อมูลรถ</h3>
                <input placeholder="ยี่ห้อ" className="w-full p-2 border rounded" value={data.carBrand} onChange={e => setData({...data, carBrand: e.target.value})}/>
                <input placeholder="ปีรถ" className="w-full p-2 border rounded" value={data.carYear} onChange={e => setData({...data, carYear: e.target.value})}/>
                <input placeholder="ทะเบียน" className="w-full p-2 border rounded" value={data.licensePlate} onChange={e => setData({...data, licensePlate: e.target.value})}/>
                {data.carBrand && data.licensePlate && 
                    <button onClick={() => setPage('schedule')} className="w-full bg-slate-900 text-white py-3 rounded font-bold flex justify-center items-center gap-2 mt-2 hover:bg-slate-800">ถัดไป <ChevronRight/></button>
                }
                </div>
            )}
            </div>
        )}
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
                <button key={t} onClick={() => setData({...data, time: t})} className={`p-2 rounded border ${data.time === t ? 'bg-orange-500 text-white' : 'bg-gray-50 hover:bg-gray-100'}`}>{t}</button>
              ))}
            </div>
          )}
          {data.time && (
            <button onClick={submitBooking} disabled={loading} className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700">
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
        <p className="mb-6 text-gray-600">ระบบบันทึกข้อมูลเรียบร้อยแล้ว</p>
        <button onClick={() => window.location.reload()} className="bg-slate-900 text-white px-6 py-2 rounded hover:bg-slate-800">กลับหน้าหลัก</button>
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