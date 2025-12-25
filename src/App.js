import React, { useState, useEffect, useCallback } from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import '@aws-amplify/ui-react/styles.css';
import { Calendar, CheckCircle, ChevronRight, Car, Wrench, RefreshCw, Database, Trash2, Plus, X, ArrowLeft, Lock, Filter, Clock } from 'lucide-react';

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

// --- 🔒 กำหนดรายชื่อผู้ดูแลระบบ (Admin) ---
const ADMIN_LIST = [
    'phai',           
    'aj', 
    'karn',
    'phai2',           
];

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
  // ของที่เคยบังคับ (ตอนนี้ปลดล็อคให้เลือกได้แล้ว)
  { categoryKey: 'brakeFluid', categoryName: 'น้ำมันเบรค', name: 'น้ำมันเบรคมาตรฐาน', price: 250, isFixed: false },
  { categoryKey: 'drainWasher', categoryName: 'แหวนรองถ่ายน้ำมันเครื่อง', name: 'แหวนรองแท้', price: 10, isFixed: false },
  { categoryKey: 'gearFilter', categoryName: 'กรองน้ำมันเกียร์', name: 'กรองเกียร์แท้', price: 840, isFixed: false },
  { categoryKey: 'gearOring', categoryName: 'โอริงกรองน้ำมันเกียร์', name: 'โอริงแท้', price: 10, isFixed: false },
  { categoryKey: 'gearGasket', categoryName: 'ประเก็นอ่างน้ำมันเกียร์', name: 'ประเก็นแท้', price: 245, isFixed: false },
  { categoryKey: 'gearDrainWasher', categoryName: 'แหวนรองน๊อตถ่ายน้ำมันเกียร์', name: 'แหวนรองน๊อตถ่ายฯ', price: 50, isFixed: false },
  { categoryKey: 'gearFillWasher', categoryName: 'แหวนรองเติมน้ำมันเกียร์', name: 'แหวนรองเติมฯ', price: 64, isFixed: false },
  { categoryKey: 'fuelFilter', categoryName: 'กรองน้ำมันเชื้อเพลิง', name: 'กรองเชื้อเพลิง', price: 500, isFixed: false },
];

const CATEGORY_OPTIONS = [
    { key: 'engineOil', name: 'น้ำมันเครื่อง' },
    { key: 'oilFilter', name: 'ไส้กรองน้ำมันเครื่อง' },
    { key: 'airFilter', name: 'กรองอากาศ' },
    { key: 'acFilter', name: 'กรองแอร์' },
    { key: 'sparkPlug', name: 'หัวเทียน' },
    { key: 'gearOil', name: 'น้ำมันเกียร์' },
    { key: 'brakeFluid', name: 'น้ำมันเบรค' },
    { key: 'drainWasher', name: 'แหวนรองถ่ายน้ำมันเครื่อง' },
    { key: 'gearFilter', name: 'กรองน้ำมันเกียร์' },
    { key: 'gearOring', name: 'โอริงกรองน้ำมันเกียร์' },
    { key: 'gearGasket', name: 'ประเก็นอ่างน้ำมันเกียร์' },
    { key: 'gearDrainWasher', name: 'แหวนรองน๊อตถ่ายน้ำมันเกียร์' },
    { key: 'gearFillWasher', name: 'แหวนรองเติมน้ำมันเกียร์' },
    { key: 'fuelFilter', name: 'กรองน้ำมันเชื้อเพลิง' },
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
  
  // Slot Checking State
  const [slotStatus, setSlotStatus] = useState(null); // { morning: {used, available, remaining}, afternoon: {...} }
  const [checkingSlots, setCheckingSlots] = useState(false);

  // Admin State
  const [newPart, setNewPart] = useState({ categoryKey: 'engineOil', name: '', price: '' });
  const [adminCategoryFilter, setAdminCategoryFilter] = useState('ALL'); 

  const isAdmin = ADMIN_LIST.includes(user?.username) || 
                  (user?.attributes?.email && ADMIN_LIST.includes(user.attributes.email));

  const fetchPartsAndAutoInit = useCallback(async () => {
    try {
      if (!config) return; 
      
      let partData = await client.graphql({ query: queries.listParts });
      let rawParts = partData.data.listParts.items;
      
      if (rawParts.length === 0) {
        console.log("Database ว่างเปล่า... กำลังติดตั้งข้อมูลเริ่มต้นอัตโนมัติ...");
        setIsInitializing(true);
        try {
            for (const item of INITIAL_SEED_DATA) {
                await client.graphql({
                    query: mutations.createPart,
                    variables: { input: item }
                });
            }
            console.log("Seeding complete. Fetching data again...");
            partData = await client.graphql({ query: queries.listParts });
            rawParts = partData.data.listParts.items;
        } catch (seedError) {
            console.error("Auto seed failed:", seedError);
        }
      }

      console.log("Loaded Parts:", rawParts);
      setIsInitializing(false);

      const formattedCatalog = {};
      rawParts.forEach(part => {
        if (!formattedCatalog[part.categoryKey]) {
          formattedCatalog[part.categoryKey] = {
            name: part.categoryName,
            fixed: false, 
            options: [],
            price: 0 
          };
        }
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
  }, []); 

  useEffect(() => {
    fetchPartsAndAutoInit();
  }, [fetchPartsAndAutoInit]);

  // --- Capacity Checking Function ---
  const checkAvailability = async (selectedDate) => {
    setCheckingSlots(true);
    setSlotStatus(null);
    try {
        if(!config) return;

        // ดึงข้อมูลการจองทั้งหมดของวันนั้น
        const response = await client.graphql({
            query: queries.listBookings,
            variables: { 
                filter: { 
                    bookingDate: { eq: selectedDate },
                    status: { ne: "CANCELLED" } // ไม่นับรายการที่ยกเลิก
                } 
            }
        });
        
        const bookings = response.data.listBookings.items;
        
        // คำนวณชั่วโมงที่ใช้ไปแล้วในแต่ละรอบ
        let morningUsed = 0;
        let afternoonUsed = 0;

        bookings.forEach(b => {
            const rule = MILEAGE_RULES[b.mileage];
            const duration = rule ? rule.hours : 0;
            // 08:00 คือรอบเช้า
            if (b.bookingTime.startsWith('08')) morningUsed += duration;
            // 13:00 คือรอบบ่าย
            if (b.bookingTime.startsWith('13')) afternoonUsed += duration;
        });

        const currentServiceDuration = MILEAGE_RULES[data.mileage]?.hours || 0;
        const MAX_CAPACITY = 4; // ชั่วโมงสูงสุดต่อรอบ

        setSlotStatus({
            morning: {
                used: morningUsed,
                available: (morningUsed + currentServiceDuration) <= MAX_CAPACITY,
                remaining: MAX_CAPACITY - morningUsed,
                max: MAX_CAPACITY
            },
            afternoon: {
                used: afternoonUsed,
                available: (afternoonUsed + currentServiceDuration) <= MAX_CAPACITY,
                remaining: MAX_CAPACITY - afternoonUsed,
                max: MAX_CAPACITY
            }
        });

    } catch (error) {
        console.error("Error checking availability:", error);
    } finally {
        setCheckingSlots(false);
    }
  };

  const handleDateChange = (e) => {
      const selectedDate = e.target.value;
      setData({...data, date: selectedDate, time: ''});
      if(selectedDate) {
          checkAvailability(selectedDate);
      }
  };

  // --- Admin Functions ---
  const handleAddPart = async (e) => {
    e.preventDefault();
    if(!newPart.name || !newPart.price) return;
    setLoading(true);

    const categoryInfo = CATEGORY_OPTIONS.find(c => c.key === newPart.categoryKey);
    
    const input = {
        categoryKey: newPart.categoryKey,
        categoryName: categoryInfo ? categoryInfo.name : 'อื่นๆ',
        name: newPart.name,
        price: parseInt(newPart.price),
        isFixed: false 
    };

    try {
        await client.graphql({
            query: mutations.createPart,
            variables: { input }
        });
        alert('เพิ่มสินค้าเรียบร้อย!');
        setNewPart({ categoryKey: 'engineOil', name: '', price: '' });
        fetchPartsAndAutoInit(); 
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
        fetchPartsAndAutoInit(); 
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
      const selectedOption = cat.options.find(o => o.id === data.selectedParts[k]);
      if (selectedOption) partsPrice += selectedOption.price;
    });
    
    const labor = MILEAGE_RULES[data.mileage].hours * 300;
    return { parts: partsPrice, labor, total: partsPrice + labor };
  };

  const submitBooking = async () => {
    setLoading(true);
    const total = calcTotal();
    
    // บันทึกเวลาเป็น 08:00 หรือ 13:00 ตามรอบที่เลือก
    const formattedTime = data.time.length === 5 ? `${data.time}:00` : data.time;

    const readableItems = {};
    Object.keys(data.selectedParts).forEach(key => {
        const cat = partsCatalog[key];
        if(cat){
             const opt = cat.options.find(o => o.id === data.selectedParts[key]);
             if(opt) readableItems[cat.name] = `${opt.name} (${opt.price})`;
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
             {/* 🔒 แสดงปุ่มนี้เฉพาะเมื่อเป็น Admin เท่านั้น */}
             {isAdmin && (
                <button onClick={() => setPage('admin')} className="bg-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-600 flex items-center gap-1 border border-gray-500">
                    <Database size={14}/> จัดการสินค้า (Admin)
                </button>
             )}
             <button onClick={signOut} className="bg-red-600 px-3 py-1 rounded text-sm">Logout</button>
          </div>
        </nav>
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <h1 className="text-3xl font-bold mb-4 text-slate-800">ศูนย์บริการ RepairShop sexy</h1>
          <button onClick={() => setPage('select')} className="bg-orange-500 text-white px-8 py-3 rounded-lg text-xl font-bold shadow hover:bg-orange-600 flex gap-2 transition transform hover:scale-105">
            <Calendar/> จองคิวเลย
          </button>
        </div>
      </div>
    );
  }

  if (page === 'admin') {
    if (!isAdmin) {
        setTimeout(() => setPage('landing'), 2000);
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center p-8 bg-white rounded shadow-lg">
                    <Lock className="w-16 h-16 text-red-500 mx-auto mb-4"/>
                    <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
                    <p className="text-gray-600 mt-2">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
                </div>
            </div>
        );
    }

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

                {/* List รายการสินค้า - ปรับปรุงใหม่ให้มี Filter */}
                <div>
                    <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                        <h3 className="font-bold text-lg text-slate-700 flex items-center gap-2">
                            <Database size={20}/> รายการสินค้าปัจจุบัน
                        </h3>
                        {/* 🔍 ตัวกรองหมวดหมู่ */}
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <Filter size={18} className="text-gray-500"/>
                            <select 
                                className="p-2 border rounded border-gray-300 shadow-sm w-full md:min-w-[250px] bg-white"
                                value={adminCategoryFilter}
                                onChange={(e) => setAdminCategoryFilter(e.target.value)}
                            >
                                <option value="ALL">-- แสดงทุกหมวดหมู่ --</option>
                                {CATEGORY_OPTIONS.map(opt => (
                                    <option key={opt.key} value={opt.key}>{opt.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {Object.keys(partsCatalog)
                            .filter(catKey => adminCategoryFilter === 'ALL' || catKey === adminCategoryFilter)
                            .map(catKey => {
                                const cat = partsCatalog[catKey];
                                if (!cat) return null;
                                return (
                                    <div key={catKey} className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
                                        <div className="bg-slate-100 p-3 font-bold border-b flex justify-between items-center">
                                            <span className="text-slate-800">{cat.name}</span>
                                            <span className="text-xs text-gray-500 bg-white border px-2 py-1 rounded">{catKey}</span>
                                        </div>
                                        <div className="divide-y divide-gray-100">
                                            {(() => {
                                                // Logic ใหม่: รวมรายการที่ชื่อและราคาซ้ำกันให้แสดงบรรทัดเดียว พร้อมบอกจำนวน
                                                const groupedItems = [];
                                                const map = new Map();
                                                cat.options.forEach(item => {
                                                    const key = `${item.name}-${item.price}`;
                                                    if(map.has(key)){
                                                        const existing = map.get(key);
                                                        existing.count++;
                                                        existing.ids.push(item.id);
                                                    } else {
                                                        const newItem = { ...item, count: 1, ids: [item.id] };
                                                        map.set(key, newItem);
                                                        groupedItems.push(newItem);
                                                    }
                                                });

                                                if (groupedItems.length === 0) return <div className="p-4 text-gray-400 text-sm text-center italic">ไม่มีรายการในหมวดนี้</div>;

                                                return groupedItems.map(item => (
                                                    <div key={item.ids[0]} className="p-3 flex justify-between items-center hover:bg-orange-50 transition duration-150">
                                                        <div>
                                                            <div className="font-medium text-gray-800 flex items-center gap-2">
                                                                {item.name}
                                                                {item.count > 1 && (
                                                                    <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full font-bold">
                                                                        มี {item.count} ชิ้น
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-sm text-gray-500">{item.price} บาท</div>
                                                        </div>
                                                        <button 
                                                            onClick={() => handleDeletePart(item.ids[0])} // ลบตัวแรกสุดในกลุ่ม
                                                            className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition"
                                                            title={item.count > 1 ? "ลบออก 1 ชิ้น" : "ลบรายการนี้"}
                                                        >
                                                            <Trash2 size={18}/>
                                                        </button>
                                                    </div>
                                                ));
                                            })()}
                                        </div>
                                    </div>
                                )
                            })}
                            
                        {/* กรณีไม่เจอข้อมูลเลยจากการ filter */}
                        {Object.keys(partsCatalog).filter(catKey => adminCategoryFilter === 'ALL' || catKey === adminCategoryFilter).length === 0 && (
                             <div className="text-center p-8 text-gray-400 bg-white rounded-lg border border-dashed">
                                ไม่พบหมวดหมู่สินค้านี้ในระบบ (หรือยังไม่มีสินค้า)
                             </div>
                        )}
                    </div>
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

                    // ปรับแก้: แสดงเป็น Dropdown เสมอ (กรองชื่อซ้ำสำหรับการแสดงผล)
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
    const serviceHours = MILEAGE_RULES[data.mileage]?.hours || 0;
    // คำนวณวันที่ปัจจุบันเพื่อใช้เป็นค่า min ในช่อง input date
    const today = new Date().toISOString().split('T')[0];

    return (
      <div className="min-h-screen bg-gray-50 p-4 pt-10 flex flex-col items-center">
        <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
          <div className="flex gap-4 mb-6"><button onClick={() => setPage('select')}>&larr;</button><h2 className="font-bold text-xl">เลือกวันและรอบบริการ</h2></div>
          
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">1. เลือกวันที่</label>
            <input 
                type="date" 
                min={today} // 🔒 ตั้งค่า min เพื่อห้ามเลือกวันย้อนหลัง
                className="w-full p-4 border rounded-lg text-lg bg-gray-50" 
                onChange={handleDateChange} 
            />
          </div>

          {/* แสดงผลการเช็คคิวเมื่อเลือกวันที่แล้ว */}
          {data.date && (
            <div className="space-y-4">
                <div className="text-sm font-bold text-gray-700 mb-2">2. เลือกรอบบริการ (เวลาซ่อม: {serviceHours} ชม.)</div>
                
                {checkingSlots ? (
                    <div className="text-center py-8 text-gray-500 flex flex-col items-center">
                        <RefreshCw className="animate-spin mb-2"/>
                        กำลังตรวจสอบตารางงานช่าง...
                    </div>
                ) : slotStatus && (
                    <div className="grid gap-4">
                        {/* --- รอบเช้า --- */}
                        <button 
                            disabled={!slotStatus.morning.available}
                            onClick={() => setData({...data, time: '08:00'})}
                            className={`p-4 rounded-xl border-2 text-left transition relative overflow-hidden group
                                ${data.time === '08:00' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}
                                ${!slotStatus.morning.available ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'hover:border-orange-300 bg-white'}
                            `}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="font-bold text-lg flex items-center gap-2">
                                    <Clock size={20} className="text-orange-500"/> รอบเช้า (08:00 - 12:00)
                                </div>
                                {data.time === '08:00' && <CheckCircle className="text-orange-500" size={24}/>}
                            </div>
                            
                            <div className="text-sm space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">ความจุสูงสุด:</span>
                                    <span>{slotStatus.morning.max} ชม.</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">จองแล้ว:</span>
                                    <span>{slotStatus.morning.used} ชม.</span>
                                </div>
                                <div className={`flex justify-between font-bold ${slotStatus.morning.available ? 'text-green-600' : 'text-red-500'}`}>
                                    <span>คงเหลือ:</span>
                                    <span>{slotStatus.morning.remaining} ชม.</span>
                                </div>
                            </div>
                            
                            {!slotStatus.morning.available && (
                                <div className="mt-3 text-xs text-red-500 bg-red-50 p-2 rounded">
                                    ❌ เต็ม / เวลาไม่พอ (ต้องการ {serviceHours} ชม.)
                                </div>
                            )}
                        </button>

                        {/* --- รอบบ่าย --- */}
                        <button 
                            disabled={!slotStatus.afternoon.available}
                            onClick={() => setData({...data, time: '13:00'})}
                            className={`p-4 rounded-xl border-2 text-left transition relative overflow-hidden group
                                ${data.time === '13:00' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}
                                ${!slotStatus.afternoon.available ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'hover:border-orange-300 bg-white'}
                            `}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="font-bold text-lg flex items-center gap-2">
                                    <Clock size={20} className="text-blue-500"/> รอบบ่าย (13:00 - 17:00)
                                </div>
                                {data.time === '13:00' && <CheckCircle className="text-orange-500" size={24}/>}
                            </div>
                            
                            <div className="text-sm space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">ความจุสูงสุด:</span>
                                    <span>{slotStatus.afternoon.max} ชม.</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">จองแล้ว:</span>
                                    <span>{slotStatus.afternoon.used} ชม.</span>
                                </div>
                                <div className={`flex justify-between font-bold ${slotStatus.afternoon.available ? 'text-green-600' : 'text-red-500'}`}>
                                    <span>คงเหลือ:</span>
                                    <span>{slotStatus.afternoon.remaining} ชม.</span>
                                </div>
                            </div>

                            {!slotStatus.afternoon.available && (
                                <div className="mt-3 text-xs text-red-500 bg-red-50 p-2 rounded">
                                    ❌ เต็ม / เวลาไม่พอ (ต้องการ {serviceHours} ชม.)
                                </div>
                            )}
                        </button>
                    </div>
                )}
            </div>
          )}

          {data.time && (
            <button onClick={submitBooking} disabled={loading} className="w-full mt-8 bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 shadow-lg transition transform hover:scale-105">
              {loading ? 'กำลังบันทึกข้อมูล...' : 'ยืนยันการจอง'}
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