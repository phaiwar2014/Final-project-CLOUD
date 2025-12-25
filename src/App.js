import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import '@aws-amplify/ui-react/styles.css';
import { 
  Calendar, CheckCircle, ChevronRight, Car, Wrench, RefreshCw, 
  Database, Trash2, Plus, ArrowLeft, Lock, Filter, Clock, 
  LayoutDashboard, ClipboardList, Search, User, Phone, Eraser, DownloadCloud
} from 'lucide-react';

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
    'admin', 
    'admin@example.com'           
];

const INITIAL_SEED_DATA = [
  { categoryKey: 'engineOil', categoryName: 'น้ำมันเครื่อง', name: 'Eneos X', price: 1000, isFixed: false },
  { categoryKey: 'engineOil', categoryName: 'น้ำมันเครื่อง', name: 'Shell Helix HX8', price: 1200, isFixed: false },
  { categoryKey: 'oilFilter', categoryName: 'ไส้กรองน้ำมันเครื่อง', name: 'Acdelco', price: 140, isFixed: false },
  { categoryKey: 'oilFilter', categoryName: 'ไส้กรองน้ำมันเครื่อง', name: 'MG Authentic', price: 250, isFixed: false },
  { categoryKey: 'airFilter', categoryName: 'กรองอากาศ', name: 'Acdelco', price: 250, isFixed: false },
  { categoryKey: 'airFilter', categoryName: 'กรองอากาศ', name: 'MG Authentic', price: 355, isFixed: false },
  { categoryKey: 'acFilter', categoryName: 'กรองแอร์', name: 'Acdelco', price: 250, isFixed: false },
  { categoryKey: 'acFilter', categoryName: 'กรองแอร์', name: 'MG Authentic', price: 700, isFixed: false },
  { categoryKey: 'sparkPlug', categoryName: 'หัวเทียน', name: 'NGK', price: 400, isFixed: false },
  { categoryKey: 'sparkPlug', categoryName: 'หัวเทียน', name: 'MG Authentic', price: 770, isFixed: false },
  { categoryKey: 'gearOil', categoryName: 'น้ำมันเกียร์', name: 'Aisin AFW+', price: 950, isFixed: false },
  { categoryKey: 'gearOil', categoryName: 'น้ำมันเกียร์', name: 'MG Authentic', price: 2700, isFixed: false },
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
  80000: { hours: 4, items: ['engineOil', 'oilFilter', 'drainWasher', 'acFilter', 'gearOil', 'gearFilter'] },
  90000: { hours: 2, items: ['engineOil', 'oilFilter', 'drainWasher'] },
  100000: { hours: 3, items: ['engineOil', 'oilFilter', 'drainWasher'] }
};

const MAX_HOURS_PER_SLOT = 4; // ความจุสูงสุด 4 ชม. ต่อรอบ

function GarageApp({ signOut, user }) {
  const [page, setPage] = useState('landing');
  const [loading, setLoading] = useState(false);
  const [partsCatalog, setPartsCatalog] = useState({});
  const [allBookings, setAllBookings] = useState([]);
  const [isInitializing, setIsInitializing] = useState(false);
  
  // State หลัก: ดึงเบอร์และชื่อจาก Cognito มาใส่เป็นค่าเริ่มต้น
  const [data, setData] = useState({ 
    mileage: '', 
    carBrand: '', 
    carYear: '', 
    licensePlate: '', 
    phoneNumber: user?.attributes?.phone_number || '', // พยายามดึงเบอร์ตั้งแต่แรก
    selectedParts: {}, 
    date: '', 
    time: '' 
  });

  // อัปเดตข้อมูลอัตโนมัติหาก User Profile โหลดช้า หรือเข้ามาทีหลัง
  useEffect(() => {
    // ถ้าใน State ยังไม่มีเบอร์ แต่ใน Cognito มี -> ให้เอามาใส่
    if (user?.attributes?.phone_number && !data.phoneNumber) {
      setData(prev => ({ ...prev, phoneNumber: user.attributes.phone_number }));
    }
  }, [user, data.phoneNumber]);

  // ฟังก์ชันดึงเบอร์จากโปรไฟล์ด้วยตัวเอง (Manual Fetch)
  const pullPhoneFromProfile = () => {
      if (user?.attributes?.phone_number) {
          setData(prev => ({ ...prev, phoneNumber: user.attributes.phone_number }));
      } else {
          alert("ไม่พบข้อมูลเบอร์โทรศัพท์ในบัญชีของคุณ");
      }
  };
  
  // Admin UI State
  const [adminTab, setAdminTab] = useState('bookings'); 
  const [newPart, setNewPart] = useState({ categoryKey: 'engineOil', name: '', price: '' });
  const [adminCategoryFilter, setAdminCategoryFilter] = useState('ALL');
  const [adminBookingSearch, setAdminBookingSearch] = useState('');

  // Capacity Checking State
  const [slotStatus, setSlotStatus] = useState(null);
  const [checkingSlots, setCheckingSlots] = useState(false);

  const isAdmin = useMemo(() => 
    ADMIN_LIST.includes(user?.username) || (user?.attributes?.email && ADMIN_LIST.includes(user.attributes.email))
  , [user]);

  // --- FETCH DATA ---

  const fetchData = useCallback(async () => {
    try {
      if (!config) return; 
      
      // 1. โหลดข้อมูลสินค้า
      const partData = await client.graphql({ query: queries.listParts });
      const rawParts = partData.data.listParts.items;
      
      if (rawParts.length === 0) {
        setIsInitializing(true);
        for (const item of INITIAL_SEED_DATA) {
          await client.graphql({ query: mutations.createPart, variables: { input: item } });
        }
        window.location.reload();
      }

      const formattedParts = {};
      rawParts.forEach(part => {
        if (!formattedParts[part.categoryKey]) {
          formattedParts[part.categoryKey] = { name: part.categoryName, options: [] };
        }
        
        // --- จุดแก้ที่ 1: กรองตัวซ้ำใน Frontend ก่อนแสดงผล (Safety Net) ---
        // เช็คว่ามีของชื่อนี้ราคาเท่านี้ในลิสต์หรือยัง ถ้ามีแล้วไม่ใส่เพิ่ม
        const isDuplicate = formattedParts[part.categoryKey].options.some(
            o => o.name === part.name && o.price === part.price
        );

        if (!isDuplicate) {
            formattedParts[part.categoryKey].options.push(part);
        }
      });
      setPartsCatalog(formattedParts);

      // 2. โหลดข้อมูลการจอง (ถ้าเป็น Admin)
      if (isAdmin) {
        const bookingData = await client.graphql({ query: queries.listBookings });
        const items = bookingData.data.listBookings.items;
        setAllBookings(items.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)));
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- CAPACITY LOGIC ---

  const checkAvailability = async (selectedDate) => {
    setCheckingSlots(true);
    try {
        const resp = await client.graphql({
            query: queries.listBookings,
            variables: { filter: { bookingDate: { eq: selectedDate }, status: { ne: "CANCELLED" } } }
        });
        const dayBookings = resp.data.listBookings.items;
        
        let morningUsed = 0;
        let afternoonUsed = 0;

        dayBookings.forEach(b => {
            const duration = MILEAGE_RULES[b.mileage]?.hours || 1;
            if (b.bookingTime.startsWith('08')) morningUsed += duration;
            if (b.bookingTime.startsWith('13')) afternoonUsed += duration;
        });

        const currentTaskHours = MILEAGE_RULES[data.mileage]?.hours || 0;

        setSlotStatus({
            morning: {
                used: morningUsed,
                available: (morningUsed + currentTaskHours) <= MAX_HOURS_PER_SLOT,
                remaining: MAX_HOURS_PER_SLOT - morningUsed
            },
            afternoon: {
                used: afternoonUsed,
                available: (afternoonUsed + currentTaskHours) <= MAX_HOURS_PER_SLOT,
                remaining: MAX_HOURS_PER_SLOT - afternoonUsed
            }
        });
    } catch (e) {
        console.error(e);
    } finally {
        setCheckingSlots(false);
    }
  };

  const handleDateChange = (e) => {
      const val = e.target.value;
      setData({...data, date: val, time: ''});
      if(val) checkAvailability(val);
  };

  // --- ADMIN ACTIONS ---

  const handleAddPart = async (e) => {
    e.preventDefault();
    if(!newPart.name || !newPart.price) return;
    setLoading(true);
    const catInfo = CATEGORY_OPTIONS.find(c => c.key === newPart.categoryKey);
    try {
        await client.graphql({
            query: mutations.createPart,
            variables: { input: { 
                categoryKey: newPart.categoryKey, 
                categoryName: catInfo?.name || 'อื่นๆ', 
                name: newPart.name, 
                price: parseInt(newPart.price), 
                isFixed: false 
            } }
        });
        setNewPart({ categoryKey: 'engineOil', name: '', price: '' });
        fetchData();
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  const handleDeletePart = async (id) => {
    if(!window.confirm('ลบสินค้านี้?')) return;
    try {
        await client.graphql({ query: mutations.deletePart, variables: { input: { id } } });
        fetchData();
    } catch (e) { alert(e.message); }
  };

  // --- จุดแก้ที่ 2: ฟังก์ชันล้างข้อมูลซ้ำใน Database ---
  const handleCleanupDuplicates = async () => {
    if(!window.confirm("⚠️ คำเตือน: ระบบจะค้นหาและ 'ลบ' สินค้าที่ชื่อและราคาซ้ำกันออกจาก Database ทั้งหมด\n\nยืนยันที่จะทำต่อหรือไม่?")) return;
    setLoading(true);
    try {
        // 1. ดึงข้อมูลทั้งหมดมาตรวจสอบ
        const partData = await client.graphql({ query: queries.listParts });
        const allParts = partData.data.listParts.items;
        
        const seen = new Set();
        const duplicates = [];
        
        allParts.forEach(part => {
            // สร้าง Key เพื่อเช็คความซ้ำ (หมวด+ชื่อ+ราคา)
            const uniqueKey = `${part.categoryKey}|${part.name}|${part.price}`;
            if (seen.has(uniqueKey)) {
                // ถ้าเคยเจอแล้ว แสดงว่าเป็นตัวซ้ำ ให้เก็บ ID ไว้ลบ
                duplicates.push(part.id);
            } else {
                seen.add(uniqueKey);
            }
        });

        if (duplicates.length === 0) {
            alert("✅ ไม่พบข้อมูลซ้ำครับ Database ปกติดี");
            setLoading(false);
            return;
        }

        // 2. ลบตัวซ้ำออกทีละตัว
        let count = 0;
        for (const id of duplicates) {
             await client.graphql({ query: mutations.deletePart, variables: { input: { id } } });
             count++;
        }
        
        alert(`🧹 ล้างข้อมูลซ้ำเรียบร้อย! ลบออกไปทั้งหมด ${count} รายการ`);
        fetchData(); // โหลดหน้าจอใหม่
    } catch (e) {
        console.error(e);
        alert("เกิดข้อผิดพลาดในการลบ: " + e.message);
    } finally {
        setLoading(false);
    }
  };

  // --- USER ACTIONS ---

  const handleMileage = (km) => {
    const parts = {};
    if (MILEAGE_RULES[km]) {
      MILEAGE_RULES[km].items.forEach(k => {
        if (partsCatalog[k]) parts[k] = partsCatalog[k].options[0]?.id || '';
      });
    }
    setData({ ...data, mileage: km, selectedParts: parts });
  };

  const calcTotal = () => {
    if (!data.mileage) return { total: 0 };
    let pPrice = 0;
    Object.keys(data.selectedParts).forEach(k => {
      const opt = partsCatalog[k]?.options.find(o => o.id === data.selectedParts[k]);
      if (opt) pPrice += opt.price;
    });
    const labor = (MILEAGE_RULES[data.mileage]?.hours || 0) * 300;
    return { parts: pPrice, labor, total: pPrice + labor };
  };

  const submitBooking = async () => {
    setLoading(true);
    const total = calcTotal();
    const formattedItems = {};
    Object.keys(data.selectedParts).forEach(k => {
        const opt = partsCatalog[k]?.options.find(o => o.id === data.selectedParts[k]);
        if(opt) formattedItems[partsCatalog[k].name] = `${opt.name} (${opt.price})`;
    });

    const finalCustomerName = user?.attributes?.name || user?.username || "Guest";
    const finalPhoneNumber = data.phoneNumber || user?.attributes?.phone_number || "-";

    const input = {
      customerName: finalCustomerName,
      phoneNumber: finalPhoneNumber,
      carBrand: data.carBrand,
      carYear: data.carYear,
      licensePlate: data.licensePlate,
      mileage: parseInt(data.mileage),
      selectedItems: JSON.stringify(formattedItems),
      totalPrice: total.total,
      bookingDate: data.date,
      bookingTime: data.time === '08:00' ? '08:00:00' : '13:00:00',
      status: "PENDING"
    };

    try {
      await client.graphql({ query: mutations.createBooking, variables: { input } });
      setPage('success');
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  // --- VIEWS ---

  if (page === 'landing') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <nav className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-lg">
          <div className="font-bold text-xl flex gap-2 items-center"><Wrench className="text-orange-500"/> AutoServe Pro</div>
          <div className="flex gap-2">
             {isAdmin && (
                <button onClick={() => setPage('admin')} className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition">
                    <Lock size={16}/> สำหรับผู้ดูแล
                </button>
             )}
             <button onClick={signOut} className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm transition">Logout</button>
          </div>
        </nav>
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100 max-w-2xl">
            <Car size={80} className="text-slate-300 mx-auto mb-6"/>
            {/* แก้ชื่อร้านตามที่คุณต้องการ */}
            <h1 className="text-3xl font-bold mb-4 text-slate-800">ศูนย์บริการ RepairShop sexy</h1>
            <p className="text-slate-500 mb-10 text-lg">จองคิวออนไลน์ง่ายๆ เช็คตารางงานช่างได้ทันที พร้อมเลือกอะไหล่คุณภาพตามงบประมาณของคุณ</p>
            <button onClick={() => setPage('select')} className="bg-orange-500 text-white px-12 py-5 rounded-2xl text-2xl font-black shadow-2xl hover:bg-orange-600 transform hover:scale-105 transition flex items-center gap-4 mx-auto">
              <Calendar size={28}/> จองคิวเลย
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (page === 'admin') {
    if (!isAdmin) return <div className="p-20 text-center">Access Denied</div>;
    
    const filteredBookings = allBookings.filter(b => 
        b.customerName.toLowerCase().includes(adminBookingSearch.toLowerCase()) || 
        b.licensePlate.toLowerCase().includes(adminBookingSearch.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-100 pb-20">
            <div className="bg-slate-900 text-white p-4 sticky top-0 z-50 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-4">
                    <button onClick={() => setPage('landing')} className="p-2 hover:bg-slate-800 rounded-lg"><ArrowLeft/></button>
                    <h2 className="font-bold text-xl">Admin Control Center</h2>
                </div>
                <div className="flex bg-slate-800 p-1 rounded-xl">
                    <button onClick={() => setAdminTab('bookings')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${adminTab === 'bookings' ? 'bg-orange-500 text-white' : 'text-slate-400'}`}>
                        <ClipboardList size={18}/> คิวงานลูกค้า
                    </button>
                    <button onClick={() => setAdminTab('parts')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${adminTab === 'parts' ? 'bg-orange-500 text-white' : 'text-slate-400'}`}>
                        <Database size={18}/> จัดการสินค้า
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-4 md:p-8">
                {adminTab === 'bookings' ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-3xl shadow-sm border-l-4 border-blue-500">
                                <div className="text-slate-400 text-xs font-bold uppercase mb-1">คิวงานทั้งหมด</div>
                                <div className="text-3xl font-black">{allBookings.length} รายการ</div>
                            </div>
                            <div className="bg-white p-6 rounded-3xl shadow-sm border-l-4 border-orange-500 col-span-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                                    <input 
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500" 
                                        placeholder="ค้นหาชื่อลูกค้า หรือ ทะเบียนรถ..."
                                        value={adminBookingSearch}
                                        onChange={e => setAdminBookingSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase border-b">
                                        <th className="p-6">วัน / รอบเวลา</th>
                                        <th className="p-6">ลูกค้า</th>
                                        <th className="p-6">ข้อมูลรถ</th>
                                        <th className="p-6 text-right">ยอดรวม</th>
                                        <th className="p-6 text-center">สถานะ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-sm">
                                    {filteredBookings.map(b => (
                                        <tr key={b.id} className="hover:bg-orange-50/30 transition">
                                            <td className="p-6">
                                                <div className="font-bold text-slate-800">{b.bookingDate}</div>
                                                <div className={`text-xs font-bold flex items-center gap-1 ${b.bookingTime.startsWith('08') ? 'text-orange-500' : 'text-blue-500'}`}>
                                                    <Clock size={12}/> {b.bookingTime.startsWith('08') ? 'รอบเช้า' : 'รอบบ่าย'} ({b.bookingTime.substring(0,5)} น.)
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="font-bold flex items-center gap-2"><User size={14}/> {b.customerName}</div>
                                                <div className="text-slate-400 flex items-center gap-2"><Phone size={14}/> {b.phoneNumber}</div>
                                            </td>
                                            <td className="p-6">
                                                <div className="font-black text-slate-700">{b.licensePlate}</div>
                                                <div className="text-xs text-slate-400">{b.carBrand} ({b.carYear}) | {b.mileage.toLocaleString()} km</div>
                                            </td>
                                            <td className="p-6 text-right font-black text-slate-900">{b.totalPrice.toLocaleString()}.-</td>
                                            <td className="p-6 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${b.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                                    {b.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredBookings.length === 0 && <div className="p-20 text-center text-slate-300 italic">ไม่พบข้อมูลการจอง</div>}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* ส่วนหัวสำหรับจัดการสินค้า */}
                        <div className="flex justify-between items-center bg-red-50 border border-red-200 p-4 rounded-2xl">
                            <div className="flex items-center gap-2 text-red-700 text-sm font-bold">
                                <RefreshCw size={20}/>
                                <span>เครื่องมือจัดการฐานข้อมูล (ใช้เมื่อข้อมูลซ้ำ)</span>
                            </div>
                            <button 
                                onClick={handleCleanupDuplicates}
                                disabled={loading}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition"
                            >
                                <Eraser size={16}/> 🧹 ล้างข้อมูลซ้ำ
                            </button>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                            <h3 className="font-black text-xl mb-6 flex items-center gap-2"><Plus className="text-green-500"/> เพิ่มสินค้าใหม่เข้าสต็อก</h3>
                            <form onSubmit={handleAddPart} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">หมวดหมู่</label>
                                    <select className="w-full p-3 bg-gray-50 border rounded-xl" value={newPart.categoryKey} onChange={e => setNewPart({...newPart, categoryKey: e.target.value})}>
                                        {CATEGORY_OPTIONS.map(opt => <option key={opt.key} value={opt.key}>{opt.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">ชื่อสินค้า</label>
                                    <input className="w-full p-3 bg-gray-50 border rounded-xl" placeholder="เช่น Mobil 1" value={newPart.name} onChange={e => setNewPart({...newPart, name: e.target.value})}/>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">ราคา (บาท)</label>
                                    <input type="number" className="w-full p-3 bg-gray-50 border rounded-xl" placeholder="0" value={newPart.price} onChange={e => setNewPart({...newPart, price: e.target.value})}/>
                                </div>
                                <button type="submit" disabled={loading} className="bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg">บันทึกลง Database</button>
                            </form>
                        </div>
                        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
                            <h4 className="font-bold flex items-center gap-2"><Filter size={18}/> กรองรายการสินค้า:</h4>
                            <select className="p-2 border rounded-xl text-sm" value={adminCategoryFilter} onChange={e => setAdminCategoryFilter(e.target.value)}>
                                <option value="ALL">แสดงทั้งหมด</option>
                                {CATEGORY_OPTIONS.map(opt => <option key={opt.key} value={opt.key}>{opt.name}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.keys(partsCatalog).filter(k => adminCategoryFilter === 'ALL' || k === adminCategoryFilter).map(k => (
                                <div key={k} className="bg-white rounded-3xl shadow-sm overflow-hidden">
                                    <div className="bg-slate-800 text-white p-4 font-black text-sm">{partsCatalog[k].name}</div>
                                    <div className="divide-y">
                                        {partsCatalog[k].options.map(item => (
                                            <div key={item.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                                                <div><div className="font-bold">{item.name}</div><div className="text-xs text-slate-400">{item.price} บาท</div></div>
                                                <button onClick={() => handleDeletePart(item.id)} className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50"><Trash2 size={18}/></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
  }

  if (page === 'select') {
    const totals = calcTotal();
    return (
      <div className="min-h-screen bg-slate-50 p-4 pb-20">
        <div className="bg-white p-4 shadow sticky top-0 z-50 flex gap-4 items-center rounded-2xl mb-6">
          <button onClick={() => setPage('landing')} className="font-bold text-slate-400"><ArrowLeft/></button>
          <h2 className="font-black text-lg">ขั้นตอนที่ 1: เลือกระยะและอะไหล่</h2>
        </div>
        <div className="max-w-xl mx-auto space-y-4">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm space-y-6">
            <label className="text-xs font-black text-slate-400 uppercase">กรุณาเลือกระยะทางรถยนต์</label>
            <select className="w-full p-4 border-2 border-orange-500 rounded-2xl text-xl font-black bg-white" value={data.mileage} onChange={e => handleMileage(parseInt(e.target.value))}>
                <option value="">-- เลือกระยะทาง --</option>
                {[10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000].map(k => <option key={k} value={k}>{k.toLocaleString()} km</option>)}
            </select>
            {data.mileage && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <h3 className="font-black text-slate-800 border-b pb-2">รายการอะไหล่ตามระยะ</h3>
                    {MILEAGE_RULES[data.mileage].items.map(k => (
                        <div key={k} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">{partsCatalog[k]?.name || k}</label>
                            <select className="w-full bg-transparent font-bold outline-none" value={data.selectedParts[k]} onChange={e => setData({...data, selectedParts: {...data.selectedParts, [k]: e.target.value}})}>
                                {partsCatalog[k]?.options.map(o => <option key={o.id} value={o.id}>{o.name} ({o.price}.-)</option>)}
                            </select>
                        </div>
                    ))}
                    <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex justify-between items-center">
                        <div><div className="text-xs font-bold text-orange-400">ค่าแรงช่าง</div><div className="font-black text-xl text-orange-600">{totals.labor}.-</div></div>
                        <div className="text-right"><div className="text-xs font-bold text-orange-400">ยอดรวมทั้งสิ้น</div><div className="font-black text-3xl text-orange-600">{totals.total.toLocaleString()}.-</div></div>
                    </div>
                </div>
            )}
          </div>
          {data.mileage && (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm space-y-4">
                <h3 className="font-black text-slate-800 flex gap-2"><Car/> ข้อมูลรถยนต์ของคุณ</h3>
                <div className="grid grid-cols-2 gap-3">
                    <input placeholder="ยี่ห้อรถ" className="p-4 bg-gray-50 border-none rounded-xl" value={data.carBrand} onChange={e => setData({...data, carBrand: e.target.value})}/>
                    <input placeholder="ปีจดทะเบียน" className="p-4 bg-gray-50 border-none rounded-xl" value={data.carYear} onChange={e => setData({...data, carYear: e.target.value})}/>
                    <input placeholder="เลขทะเบียนรถ" className="p-4 bg-gray-50 border-none rounded-xl font-bold" value={data.licensePlate} onChange={e => setData({...data, licensePlate: e.target.value})}/>
                    
                    {/* --- จุดเพิ่ม: ช่องกรอกเบอร์โทรศัพท์ (มีปุ่ม Manual Fetch) --- */}
                    <div className="relative">
                        <input 
                          placeholder="เบอร์โทรศัพท์ติดต่อ" 
                          className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold" 
                          value={data.phoneNumber} 
                          onChange={e => setData({...data, phoneNumber: e.target.value})}
                        />
                        {/* ปุ่มเล็กๆ สำหรับดึงเบอร์จากโปรไฟล์ ถ้าไม่ขึ้นอัตโนมัติ */}
                        {user?.attributes?.phone_number && (
                            <button 
                                onClick={pullPhoneFromProfile}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-blue-500 hover:text-blue-700 bg-white px-2 py-1 rounded shadow-sm border border-blue-100 flex items-center gap-1"
                                title={`คลิกเพื่อใช้เบอร์: ${user.attributes.phone_number}`}
                            >
                                <DownloadCloud size={12}/> ใช้เบอร์ที่ลงทะเบียน
                            </button>
                        )}
                    </div>
                </div>
                {data.carBrand && data.licensePlate && data.phoneNumber && 
                    <button onClick={() => setPage('schedule')} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl flex justify-center items-center gap-2 mt-4 hover:bg-slate-800 transition shadow-xl">ไปเลือกวันเวลา <ChevronRight/></button>
                }
            </div>
          )}
        </div>
      </div>
    );
  }

  if (page === 'schedule') {
    const today = new Date().toISOString().split('T')[0];
    const sHours = MILEAGE_RULES[data.mileage]?.hours || 0;
    return (
      <div className="min-h-screen bg-slate-50 p-4 pt-10 flex flex-col items-center">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-lg">
          <div className="flex gap-4 mb-8"><button onClick={() => setPage('select')} className="text-slate-300"><ArrowLeft/></button><h2 className="font-black text-2xl">เลือกวันเข้าบริการ</h2></div>
          <div className="mb-8">
            <label className="block text-xs font-black text-slate-400 uppercase mb-2">1. เลือกวันที่สะดวก</label>
            <input type="date" min={today} className="w-full p-5 border-2 border-slate-100 rounded-2xl text-xl font-bold bg-slate-50 focus:border-orange-500 outline-none" onChange={handleDateChange}/>
          </div>
          {data.date && (
            <div className="space-y-4">
                <label className="block text-xs font-black text-slate-400 uppercase">2. เลือกรอบที่ว่าง (งานของคุณใช้ {sHours} ชม.)</label>
                {checkingSlots ? <div className="text-center p-10"><RefreshCw className="animate-spin mx-auto text-orange-500"/></div> : slotStatus && (
                    <div className="grid gap-4">
                        {['08:00', '13:00'].map((t, idx) => {
                            const slot = idx === 0 ? slotStatus.morning : slotStatus.afternoon;
                            return (
                                <button key={t} disabled={!slot.available} onClick={() => setData({...data, time: t})} 
                                    className={`p-6 rounded-3xl border-2 text-left flex justify-between items-center transition
                                        ${data.time === t ? 'border-orange-500 bg-orange-50' : 'border-white bg-slate-50'}
                                        ${!slot.available ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:shadow-md'}
                                    `}>
                                    <div>
                                        <div className="font-black text-lg">{idx === 0 ? 'รอบเช้า' : 'รอบบ่าย'}</div>
                                        <div className="text-xs text-slate-400">{t === '08:00' ? '08:00 - 12:00' : '13:00 - 17:00'}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-xs font-bold ${slot.available ? 'text-green-500' : 'text-red-500'}`}>
                                            {slot.available ? `ว่าง ${slot.remaining} ชม.` : 'คิวเต็ม'}
                                        </div>
                                        {data.time === t && <CheckCircle className="text-orange-500 mt-1 ml-auto"/>}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>
          )}
          {data.time && (
            <button onClick={submitBooking} disabled={loading} className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-xl shadow-2xl hover:bg-green-700 transition mt-10">
              {loading ? 'กำลังบันทึก...' : 'ยืนยันการจองคิว'}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (page === 'success') {
    return (
      <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl mb-8 animate-bounce"><CheckCircle size={50} className="text-green-500"/></div>
        <h2 className="text-4xl font-black text-slate-800 mb-4">จองคิวสำเร็จ!</h2>
        <p className="mb-10 text-slate-500 max-w-sm">ข้อมูลการจองของคุณถูกบันทึกเข้าระบบแล้ว เจ้าหน้าที่จะเตรียมอะไหล่และสถานที่รอท่านตามวันเวลาที่นัดหมาย</p>
        <button onClick={() => window.location.reload()} className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition">กลับหน้าหลัก</button>
      </div>
    );
  }
  return null;
}

export default function App() {
  return (
    <div className="font-sans antialiased text-slate-900">
        <Authenticator>
            {({ signOut, user }) => <GarageApp signOut={signOut} user={user} />}
        </Authenticator>
    </div>
  );
}