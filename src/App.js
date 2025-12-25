import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import '@aws-amplify/ui-react/styles.css';
import { 
  Calendar, CheckCircle, ChevronRight, Car, Wrench, RefreshCw, 
  Database, Trash2, Plus, ArrowLeft, Lock, Filter, Clock, 
  LayoutDashboard, ClipboardList, Search, User, Phone, Eraser, 
  DownloadCloud, History, MinusCircle, PlusCircle, Briefcase, 
  PlayCircle, CheckSquare, AlertTriangle, Package, DollarSign, FileText, X, Save, Settings, Ban
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

// --- 🔒 CONFIGURATION: ROLES & USERS ---
const ADMIN_LIST = ['phai', 'karn', 'aj']; 
const MECHANIC_LIST = ['machanic1']; 
const ACCOUNTANT_LIST = ['account1']; 

const INITIAL_SEED_DATA = [
  { categoryKey: 'engineOil', categoryName: 'น้ำมันเครื่อง', name: 'Eneos X', price: 1000, isFixed: false, stock: 50 },
  { categoryKey: 'engineOil', categoryName: 'น้ำมันเครื่อง', name: 'Shell Helix HX8', price: 1200, isFixed: false, stock: 50 },
  { categoryKey: 'oilFilter', categoryName: 'ไส้กรองน้ำมันเครื่อง', name: 'Acdelco', price: 140, isFixed: false, stock: 100 },
  { categoryKey: 'oilFilter', categoryName: 'ไส้กรองน้ำมันเครื่อง', name: 'MG Authentic', price: 250, isFixed: false, stock: 100 },
  { categoryKey: 'airFilter', categoryName: 'กรองอากาศ', name: 'Acdelco', price: 250, isFixed: false, stock: 50 },
  { categoryKey: 'airFilter', categoryName: 'กรองอากาศ', name: 'MG Authentic', price: 355, isFixed: false, stock: 50 },
  { categoryKey: 'acFilter', categoryName: 'กรองแอร์', name: 'Acdelco', price: 250, isFixed: false, stock: 50 },
  { categoryKey: 'acFilter', categoryName: 'กรองแอร์', name: 'MG Authentic', price: 700, isFixed: false, stock: 50 },
  { categoryKey: 'sparkPlug', categoryName: 'หัวเทียน', name: 'NGK', price: 400, isFixed: false, stock: 200 },
  { categoryKey: 'sparkPlug', categoryName: 'หัวเทียน', name: 'MG Authentic', price: 770, isFixed: false, stock: 200 },
  { categoryKey: 'gearOil', categoryName: 'น้ำมันเกียร์', name: 'Aisin AFW+', price: 950, isFixed: false, stock: 30 },
  { categoryKey: 'gearOil', categoryName: 'น้ำมันเกียร์', name: 'MG Authentic', price: 2700, isFixed: false, stock: 30 },
  { categoryKey: 'brakeFluid', categoryName: 'น้ำมันเบรค', name: 'น้ำมันเบรคมาตรฐาน', price: 250, isFixed: false, stock: 50 },
  { categoryKey: 'drainWasher', categoryName: 'แหวนรองถ่ายน้ำมันเครื่อง', name: 'แหวนรองแท้', price: 10, isFixed: false, stock: 500 },
  { categoryKey: 'gearFilter', categoryName: 'กรองน้ำมันเกียร์', name: 'กรองเกียร์แท้', price: 840, isFixed: false, stock: 20 },
  { categoryKey: 'gearOring', categoryName: 'โอริงกรองน้ำมันเกียร์', name: 'โอริงแท้', price: 10, isFixed: false, stock: 50 },
  { categoryKey: 'gearGasket', categoryName: 'ประเก็นอ่างน้ำมันเกียร์', name: 'ประเก็นแท้', price: 245, isFixed: false, stock: 20 },
  { categoryKey: 'gearDrainWasher', categoryName: 'แหวนรองน๊อตถ่ายน้ำมันเกียร์', name: 'แหวนรองน๊อตถ่ายฯ', price: 50, isFixed: false, stock: 100 },
  { categoryKey: 'gearFillWasher', categoryName: 'แหวนรองเติมน้ำมันเกียร์', name: 'แหวนรองเติมฯ', price: 64, isFixed: false, stock: 100 },
  { categoryKey: 'fuelFilter', categoryName: 'กรองน้ำมันเชื้อเพลิง', name: 'กรองเชื้อเพลิง', price: 500, isFixed: false, stock: 30 },
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
    { key: 'laborCost', name: 'ค่าแรง' },
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

const MAX_HOURS_PER_SLOT = 4;

// --- Helper: Parse Items ---
const parseSelectedItems = (jsonString) => {
    try {
      const items = JSON.parse(jsonString);
      const displayData = items.display || items;
      return Object.entries(displayData).map(([key, val]) => `${key}: ${val}`);
    } catch (e) { return ["ไม่สามารถอ่านรายการได้"]; }
};

// --- Component: Mechanic Job Modal ---
const MechanicJobModal = ({ job, isOpen, onClose, onConfirmStart, partsCatalog }) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [additionalPartId, setAdditionalPartId] = useState("");
    
    useEffect(() => {
        if (isOpen && job) {
            try {
                const parsed = JSON.parse(job.selectedItems);
                let initialItems = [];
                const allParts = Object.values(partsCatalog).flatMap(c => c.options);

                if (parsed.ids && Array.isArray(parsed.ids)) {
                    initialItems = parsed.ids.map(id => {
                        const part = allParts.find(p => p.id === id);
                        return part ? { ...part } : null;
                    }).filter(Boolean);
                }
                setSelectedItems(initialItems);
            } catch (e) {
                console.error("Error parsing job items", e);
            }
        }
    }, [isOpen, job, partsCatalog]);

    const handleRemoveItem = (index) => {
        const newItems = [...selectedItems];
        newItems.splice(index, 1);
        setSelectedItems(newItems);
    };

    const handleAddItem = () => {
        if (!additionalPartId) return;
        const allParts = Object.values(partsCatalog).flatMap(c => c.options);
        const part = allParts.find(p => p.id === additionalPartId);
        if (part) {
            setSelectedItems([...selectedItems, part]);
            setAdditionalPartId("");
        }
    };

    const laborCost = (MILEAGE_RULES[job?.mileage]?.hours || 0) * 300;
    const partsCost = selectedItems.reduce((sum, item) => sum + item.price, 0);
    const totalCost = laborCost + partsCost;

    if (!isOpen || !job) return null;

    return (
        // ปรับ CSS: ใช้ z-[9999] และ h-screen w-screen เพื่อให้ Pop-up อยู่บนสุดและเต็มหน้าจอ
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 h-screen w-screen">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-2xl font-black text-slate-800">เตรียมเริ่มงาน / เบิกอะไหล่</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={24}/></button>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-50 p-3 rounded-xl">
                        <div className="text-slate-400 text-xs">ลูกค้า</div>
                        <div className="font-bold">{job.customerName}</div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl">
                        <div className="text-slate-400 text-xs">รถยนต์</div>
                        <div className="font-bold">{job.carBrand} ({job.licensePlate})</div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2"><CheckSquare/> รายการอะไหล่ที่ใช้ (ปรับเปลี่ยนได้)</h3>
                    <div className="space-y-2 mb-4">
                        {selectedItems.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 border rounded-xl bg-white hover:border-orange-200">
                                <div>
                                    <div className="font-bold text-slate-700">{item.categoryName} : {item.name}</div>
                                    <div className="text-xs text-slate-400">{item.price} บาท | คงเหลือ: <span className={item.stock < 5 ? "text-red-500 font-bold" : "text-green-600"}>{item.stock}</span></div>
                                </div>
                                <button onClick={() => handleRemoveItem(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-full"><Trash2 size={18}/></button>
                            </div>
                        ))}
                        {selectedItems.length === 0 && <div className="text-center p-4 text-gray-400 italic">ไม่มีรายการอะไหล่</div>}
                    </div>

                    <div className="flex gap-2 items-center bg-gray-50 p-2 rounded-xl">
                        <select 
                            className="flex-1 p-2 bg-transparent outline-none text-sm"
                            value={additionalPartId}
                            onChange={(e) => setAdditionalPartId(e.target.value)}
                        >
                            <option value="">+ เพิ่มอะไหล่อื่นๆ...</option>
                            {Object.keys(partsCatalog).map(catKey => (
                                <optgroup key={catKey} label={partsCatalog[catKey].name}>
                                    {partsCatalog[catKey].options.map(opt => (
                                        <option key={opt.id} value={opt.id} disabled={opt.stock <= 0}>
                                            {opt.name} ({opt.price}.-) {opt.stock <= 0 ? '(หมด)' : ''}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                        <button onClick={handleAddItem} className="bg-slate-800 text-white p-2 rounded-lg text-sm font-bold hover:bg-slate-700">เพิ่ม</button>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t mb-6">
                    <div className="text-sm text-slate-500">ค่าแรง: {laborCost} + ค่าอะไหล่: {partsCost}</div>
                    <div className="text-2xl font-black text-orange-600">{totalCost.toLocaleString()} บาท</div>
                </div>

                <button 
                    onClick={() => onConfirmStart(job.id, selectedItems, totalCost)}
                    className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 shadow-lg flex justify-center items-center gap-2"
                >
                    <PlayCircle/> ยืนยันเบิกของและเริ่มงาน
                </button>
            </div>
        </div>
    );
};

// --- Component: Accounting Close Job Modal ---
const AccountingCloseModal = ({ job, isOpen, onClose, onConfirmClose }) => {
    const [adjustedTotal, setAdjustedTotal] = useState(0);

    useEffect(() => {
        if (job) {
            setAdjustedTotal(job.totalPrice);
        }
    }, [job]);

    if (!isOpen || !job) return null;

    return (
        // ปรับ CSS: ใช้ z-[9999] และ h-screen w-screen
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 h-screen w-screen">
            <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black text-slate-800 flex items-center gap-2"><DollarSign className="text-green-600"/> สรุปยอด/ปิดงาน</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
                </div>
                
                <div className="space-y-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-xl text-sm space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-500">ลูกค้า:</span>
                            <span className="font-bold">{job.customerName}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-gray-500">ทะเบียน:</span>
                            <span className="font-bold">{job.licensePlate}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-gray-500">ยอดเดิม:</span>
                            <span className="font-bold">{job.totalPrice.toLocaleString()}.-</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">ยอดชำระสุทธิ (ปรับแก้ได้)</label>
                        <input 
                            type="number" 
                            className="w-full p-3 border-2 border-green-500 rounded-xl text-2xl font-black text-green-700 text-right focus:outline-none focus:ring-4 focus:ring-green-100"
                            value={adjustedTotal}
                            onChange={(e) => setAdjustedTotal(parseInt(e.target.value) || 0)}
                        />
                         <p className="text-xs text-red-400 mt-1">* เมื่อกดปิดงานแล้วจะไม่สามารถแก้ไขยอดได้อีก</p>
                    </div>
                </div>

                <button 
                    onClick={() => onConfirmClose(job.id, adjustedTotal)}
                    className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 shadow-lg flex justify-center items-center gap-2"
                >
                    <CheckCircle size={18}/> ยืนยันปิดงาน
                </button>
            </div>
        </div>
    );
};

// --- Component: Mechanic Job Card ---
const MechanicJobCard = ({ job, partsCatalog, onUpdateStatus }) => {
  const { parsedItems, isStockSufficient, insufficientParts } = useMemo(() => {
    let isStockSufficient = true;
    const insufficientParts = [];
    let parsedItems = [];

    try {
      const parsed = JSON.parse(job.selectedItems);
      const allParts = Object.values(partsCatalog).flatMap(c => c.options);

      // Case 1: New Format with IDs
      if (parsed.ids && Array.isArray(parsed.ids)) {
        parsedItems = parsed.ids.map(id => {
          const part = allParts.find(p => p.id === id);
          if (part && (part.stock || 0) <= 0) {
            isStockSufficient = false;
            insufficientParts.push(part.name);
          }
          return {
            categoryName: part ? part.categoryName : 'Unknown',
            name: part ? part.name : 'Unknown Item',
            price: part ? part.price : 0,
            stock: part ? (part.stock || 0) : null,
            isMissing: part ? (part.stock || 0) <= 0 : true
          };
        });
      } else {
        // Case 2: Old Format (Text only) - Fuzzy Match Logic
        const displayData = parsed.display || parsed;
        parsedItems = Object.entries(displayData).map(([key, val]) => {
          const nameMatch = val.match(/^(.*?)\s\(\d+\)$/);
          const cleanName = nameMatch ? nameMatch[1] : val;

          const part = allParts.find(p => p.name === cleanName || val.includes(p.name));
          const stock = part ? (part.stock || 0) : null;

          if (stock !== null && stock <= 0) {
            isStockSufficient = false;
            insufficientParts.push(cleanName);
          }

          return {
            categoryName: part ? part.categoryName : 'สินค้า',
            name: val,
            price: 0,
            stock: stock,
            isMissing: stock !== null && stock <= 0
          };
        });
      }
    } catch (e) { }
    return { parsedItems, isStockSufficient, insufficientParts };
  }, [job.selectedItems, partsCatalog]);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-bold text-slate-600">{job.bookingDate} | {job.bookingTime.substring(0, 5)} น.</div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${job.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700 animate-pulse' : 'bg-green-100 text-green-700'}`}>
            {job.status}
          </div>
        </div>
        <h4 className="text-xl font-black text-slate-800 mb-1">{job.carBrand} ({job.licensePlate})</h4>
        <p className="text-sm text-slate-500 mb-4">เช็คระยะ {job.mileage.toLocaleString()} km</p>

        <div className="bg-gray-50 p-4 rounded-xl mb-4">
          <h5 className="font-bold text-xs text-gray-400 uppercase mb-2 flex items-center gap-1"><CheckSquare size={12} /> รายการอะไหล่ที่ต้องเบิก</h5>
          <ul className="text-sm space-y-2">
            {parsedItems.map((item, idx) => (
              <li key={idx} className="flex justify-between items-center bg-white p-2 rounded border border-gray-100">
                <span className={`text-slate-700 font-medium ${item.isMissing ? 'text-red-500' : ''}`}>
                    <span className="text-xs text-gray-400 mr-1">{item.categoryName} :</span> {item.name}
                </span>
                {item.stock !== null ? (
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${item.stock === 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    <span className="inline-block w-4"></span>
                    {item.stock === 0 ? 'ของขาด Stock' : `มีในสต็อก: ${item.stock}`}
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded">ไม่พบข้อมูลสต็อก</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        {job.status === 'CONFIRMED' && (
          <>
            <button
              onClick={() => onUpdateStatus(job.id, 'IN_PROGRESS')}
              disabled={!isStockSufficient}
              className={`flex-1 py-3 rounded-xl font-bold flex justify-center items-center gap-2 ${isStockSufficient ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              <PlayCircle size={18} /> เริ่มงาน (ตัดสต็อก)
            </button>
            {!isStockSufficient && (
              <div className="text-center text-xs text-red-500 bg-red-50 p-2 rounded border border-red-100">
                ❌ ไม่สามารถเริ่มงานได้: ของขาด ({insufficientParts.join(', ')})
              </div>
            )}
          </>
        )}
        {job.status === 'IN_PROGRESS' && (
          <button
            onClick={() => onUpdateStatus(job.id, 'COMPLETED')}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2"
          >
            <CheckCircle size={18} /> ปิดงาน (เสร็จสิ้น)
          </button>
        )}
      </div>
    </div>
  );
};

function GarageApp({ signOut, user }) {
  const [page, setPage] = useState('landing');
  const [loading, setLoading] = useState(false);
  const [partsCatalog, setPartsCatalog] = useState({});
  const [allBookings, setAllBookings] = useState([]);
  const [userBookings, setUserBookings] = useState([]); 
  const [isInitializing, setIsInitializing] = useState(false);
  
  // State หลัก
  const [data, setData] = useState({ 
    mileage: '', carBrand: '', carYear: '', licensePlate: '', 
    phoneNumber: user?.attributes?.phone_number || '', 
    selectedParts: {}, date: '', time: '' 
  });

  // Admin UI State
  const [adminTab, setAdminTab] = useState('bookings'); 
  const [newPart, setNewPart] = useState({ categoryKey: 'engineOil', name: '', price: '', stock: '10' });
  const [adminCategoryFilter, setAdminCategoryFilter] = useState('ALL');
  const [adminBookingSearch, setAdminBookingSearch] = useState('');
  const [adminDateFilter, setAdminDateFilter] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState(5);

  // Accounting UI State
  const [accountingViewType, setAccountingViewType] = useState('monthly'); 
  const [accountingDate, setAccountingDate] = useState(new Date().toISOString().substring(0, 7)); 
  const [accountingModalOpen, setAccountingModalOpen] = useState(false);
  const [selectedJobForAccounting, setSelectedJobForAccounting] = useState(null);

  // Config UI State
  const [blockedDates, setBlockedDates] = useState([]);
  const [newBlockedDate, setNewBlockedDate] = useState('');

  const [slotStatus, setSlotStatus] = useState(null);
  const [checkingSlots, setCheckingSlots] = useState(false);

  // Mechanic Modal State
  const [mechanicModalOpen, setMechanicModalOpen] = useState(false);
  const [selectedJobForMechanic, setSelectedJobForMechanic] = useState(null);

  // --- 👮‍♂️ CHECK ROLES & IDENTIFY USER ---
  const username = user?.username || "Unknown";
  const userEmail = user?.attributes?.email;
  
  const isAdmin = useMemo(() => ADMIN_LIST.includes(username) || (userEmail && ADMIN_LIST.includes(userEmail)), [username, userEmail]);
  const isMechanic = useMemo(() => MECHANIC_LIST.includes(username), [username]);
  const isAccountant = useMemo(() => ACCOUNTANT_LIST.includes(username), [username]);
  const isStaff = isAdmin || isMechanic || isAccountant; 

  const userRoleDisplay = useMemo(() => {
      if (isAdmin) return "Admin";
      if (isMechanic) return "Mechanic";
      if (isAccountant) return "Accountant";
      return "User";
  }, [isAdmin, isMechanic, isAccountant]);

  useEffect(() => {
    if (user?.attributes?.phone_number && !data.phoneNumber) {
      setData(prev => ({ ...prev, phoneNumber: user.attributes.phone_number }));
    }
  }, [user, data.phoneNumber]);

  const pullPhoneFromProfile = () => {
      if (user?.attributes?.phone_number) {
          setData(prev => ({ ...prev, phoneNumber: user.attributes.phone_number }));
      } else {
          alert("ไม่พบข้อมูลเบอร์โทรศัพท์ในบัญชีของคุณ");
      }
  };

  // --- FETCH DATA ---
  const fetchData = useCallback(async () => {
    try {
      if (!config) return; 
      
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
        const isDuplicate = formattedParts[part.categoryKey].options.some(
            o => o.name === part.name && o.price === part.price
        );
        if (!isDuplicate) {
            formattedParts[part.categoryKey].options.push(part);
        }
      });
      setPartsCatalog(formattedParts);

      const listBookingsQuery = `
        query ListBookings {
            listBookings {
                items {
                    id
                    customerName
                    phoneNumber
                    carBrand
                    carYear
                    licensePlate
                    mileage
                    selectedItems
                    totalPrice
                    bookingDate
                    bookingTime
                    status
                    mechanicName
                }
            }
        }
      `;
      const bookingData = await client.graphql({ query: listBookingsQuery });
      const items = bookingData.data.listBookings.items;
      setAllBookings(items.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)));

      const myName = user?.attributes?.name || user?.username || "Guest";
      const myHistory = items.filter(b => b.customerName === myName || b.owner === user.username);
      setUserBookings(myHistory.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)));
      
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }, [user]); 

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- CAPACITY LOGIC ---
  const checkAvailability = useCallback(async (selectedDate) => {
    if (!selectedDate) return;
    if (blockedDates.includes(selectedDate)) return; // Don't check if blocked

    setCheckingSlots(true);
    setSlotStatus(null); 
    try {
        const resp = await client.graphql({
            query: queries.listBookings,
            variables: { filter: { bookingDate: { eq: selectedDate }, status: { ne: "CANCELLED" } } }
        });
        const dayBookings = resp.data.listBookings.items;
        let morningUsed = 0; let afternoonUsed = 0;
        dayBookings.forEach(b => {
            const m = parseInt(b.mileage);
            const rule = MILEAGE_RULES[m];
            const duration = rule ? rule.hours : 1; 
            if (b.bookingTime.startsWith('08')) morningUsed += duration;
            if (b.bookingTime.startsWith('13')) afternoonUsed += duration;
        });
        const currentMileage = parseInt(data.mileage); 
        const currentRule = MILEAGE_RULES[currentMileage];
        const currentTaskHours = (currentRule && currentRule.hours > 0) ? currentRule.hours : 1;
        setSlotStatus({
            morning: {
                used: morningUsed,
                available: (morningUsed + currentTaskHours) <= MAX_HOURS_PER_SLOT,
                remaining: MAX_HOURS_PER_SLOT - morningUsed,
                max: MAX_HOURS_PER_SLOT,
                needed: currentTaskHours
            },
            afternoon: {
                used: afternoonUsed,
                available: (afternoonUsed + currentTaskHours) <= MAX_HOURS_PER_SLOT,
                remaining: MAX_HOURS_PER_SLOT - afternoonUsed,
                max: MAX_HOURS_PER_SLOT,
                needed: currentTaskHours
            }
        });
    } catch (e) { console.error(e); } finally { setCheckingSlots(false); }
  }, [data.mileage, blockedDates]); 

  useEffect(() => {
    if (page === 'schedule' && data.date) { checkAvailability(data.date); }
  }, [page, data.date, checkAvailability]);

  const handleDateChange = (e) => {
      const val = e.target.value;
      if (blockedDates.includes(val)) {
          alert("ขออภัย วันที่นี้ร้านปิดให้บริการ");
          return;
      }
      setData(prev => ({...prev, date: val, time: ''}));
  };

  // --- ACTIONS ---
  const handleUpdateStatus = async (id, newStatus) => {
    const booking = allBookings.find(b => b.id === id);
    if (!booking) return;

    // Open Modals based on status
    if (newStatus === 'IN_PROGRESS') {
        setSelectedJobForMechanic(booking);
        setMechanicModalOpen(true);
        return;
    }
    if (newStatus === 'CLOSED') {
        setSelectedJobForAccounting(booking);
        setAccountingModalOpen(true);
        return;
    }

    if (!window.confirm(`ยืนยันเปลี่ยนสถานะเป็น ${newStatus}?`)) return;

    setLoading(true);
    try {
        await client.graphql({ query: mutations.updateBooking, variables: { input: { id, status: newStatus } } });
        fetchData(); 
    } catch (err) { alert('Error: ' + err.message); } finally { setLoading(false); }
  };

  const handleMechanicStartJob = async (jobId, finalItems, finalPrice) => {
      setLoading(true);
      try {
          const updatePromises = finalItems.map(async (item) => {
             if (item && item.id) {
                 const currentStock = item.stock || 0;
                 const newStock = currentStock > 0 ? currentStock - 1 : 0;
                 return client.graphql({
                    query: mutations.updatePart,
                    variables: { input: { id: item.id, stock: newStock } }
                 });
             }
          });
          await Promise.all(updatePromises);

          const displayObj = {};
          const idsArr = [];
          finalItems.forEach(item => {
              displayObj[item.name] = `${item.name} (${item.price})`;
              idsArr.push(item.id);
          });

          await client.graphql({
              query: mutations.updateBooking,
              variables: { 
                  input: { 
                      id: jobId, 
                      status: 'IN_PROGRESS',
                      selectedItems: JSON.stringify({ display: displayObj, ids: idsArr }),
                      totalPrice: finalPrice,
                      mechanicName: user.username 
                  } 
              }
          });

          setMechanicModalOpen(false);
          fetchData();
          alert("เริ่มงานเรียบร้อย! ระบบได้ตัดสต็อกและอัปเดตงานแล้ว");

      } catch (err) {
          alert("เกิดข้อผิดพลาด: " + err.message);
      } finally {
          setLoading(false);
      }
  };

  const handleAccountingCloseJob = async (jobId, finalPrice) => {
      setLoading(true);
      try {
          await client.graphql({
              query: mutations.updateBooking,
              variables: { 
                  input: { 
                      id: jobId, 
                      status: 'CLOSED',
                      totalPrice: finalPrice
                  } 
              }
          });
          setAccountingModalOpen(false);
          fetchData();
          alert("ปิดงานเรียบร้อย! บันทึกยอดเงินแล้ว");
      } catch (err) {
          alert("เกิดข้อผิดพลาด: " + err.message);
      } finally {
          setLoading(false);
      }
  };

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
                stock: parseInt(newPart.stock) || 0,
                isFixed: false 
            } }
        });
        setNewPart({ categoryKey: 'engineOil', name: '', price: '', stock: '10' });
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

  const handleUpdateStock = async (id, currentStock, change) => {
    const newStock = (currentStock || 0) + change;
    if (newStock < 0) return; 
    try {
        await client.graphql({ query: mutations.updatePart, variables: { input: { id, stock: newStock } } });
        fetchData(); 
    } catch (err) { alert("ไม่สามารถอัปเดตสต็อกได้"); }
  };

  const handleConfirmBooking = async (id) => {
    if(!window.confirm('ยืนยันรับงานจองนี้หรือไม่?')) return;
    setLoading(true);
    try {
        await client.graphql({ query: mutations.updateBooking, variables: { input: { id, status: "CONFIRMED" } } });
        fetchData(); 
    } catch (err) { alert('เกิดข้อผิดพลาด: ' + (err.message || JSON.stringify(err))); } finally { setLoading(false); }
  };

  const handleDeleteBooking = async (id) => {
    if(!window.confirm('ยืนยันการลบรายการจองนี้? ข้อมูลจะถูกลบออกจาก Database ถาวร')) return;
    setLoading(true);
    try {
        await client.graphql({ query: mutations.deleteBooking, variables: { input: { id } } });
        fetchData(); 
    } catch (err) { alert('เกิดข้อผิดพลาดในการลบ'); } finally { setLoading(false); }
  };

  const handleCleanupDuplicates = async () => {
    if(!window.confirm("⚠️ ยืนยันลบข้อมูลซ้ำ?")) return;
    setLoading(true);
    try {
        const partData = await client.graphql({ query: queries.listParts });
        const allParts = partData.data.listParts.items;
        const seen = new Set();
        const duplicates = [];
        allParts.forEach(part => {
            const uniqueKey = `${part.categoryKey}|${part.name}|${part.price}`;
            if (seen.has(uniqueKey)) { duplicates.push(part.id); } else { seen.add(uniqueKey); }
        });
        if (duplicates.length === 0) { alert("✅ ไม่พบข้อมูลซ้ำ"); setLoading(false); return; }
        for (const id of duplicates) { await client.graphql({ query: mutations.deletePart, variables: { input: { id } } }); }
        alert(`🧹 ลบข้อมูลซ้ำเรียบร้อย!`);
        fetchData(); 
    } catch (e) { alert("Error: " + e.message); } finally { setLoading(false); }
  };
  
  // 🆕 Config Handlers
  const handleBlockDate = () => {
      if(newBlockedDate && !blockedDates.includes(newBlockedDate)) {
          setBlockedDates([...blockedDates, newBlockedDate]);
          setNewBlockedDate('');
      }
  };

  const handleUnblockDate = (dateToRemove) => {
      setBlockedDates(blockedDates.filter(d => d !== dateToRemove));
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
    const itemIds = []; 
    Object.keys(data.selectedParts).forEach(k => {
        const opt = partsCatalog[k]?.options.find(o => o.id === data.selectedParts[k]);
        if(opt) {
            formattedItems[partsCatalog[k].name] = `${opt.name} (${opt.price})`;
            itemIds.push(opt.id);
        }
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
      selectedItems: JSON.stringify({ display: formattedItems, ids: itemIds }),
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

  const getLowStockItems = () => {
    const lowItems = [];
    Object.keys(partsCatalog).forEach(catKey => {
       partsCatalog[catKey].options.forEach(item => {
           if ((item.stock || 0) < lowStockThreshold) {
               lowItems.push({ ...item, categoryName: partsCatalog[catKey].name });
           }
       });
    });
    return lowItems;
  };

  // --- HELPER: Parse Item List String ---
  const parseItemString = (jsonString) => {
    try {
        const parsed = JSON.parse(jsonString);
        const displayData = parsed.display || parsed;
        return Object.entries(displayData).map(([key, val]) => `${key}: ${val}`);
    } catch (e) {
        return ["รายละเอียดสินค้าไม่ถูกต้อง"];
    }
  };

  // --- VIEWS ---

  if (page === 'landing') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <nav className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-lg">
          <div className="font-bold text-xl flex gap-2 items-center"><Wrench className="text-orange-500"/> AutoServe Pro</div>
          <div className="flex gap-2 items-center">
             <div className="hidden md:flex flex-col items-end mr-2 text-xs">
                <span className="font-bold text-orange-400">{username}</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-gray-300">{userRoleDisplay}</span>
             </div>
             {isStaff && (
                <button onClick={() => setPage('admin')} className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition">
                    <Lock size={16}/> Staff Portal
                </button>
             )}
             <button onClick={signOut} className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm transition">Logout</button>
          </div>
        </nav>
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100 max-w-2xl">
            <Car size={80} className="text-slate-300 mx-auto mb-6"/>
            <h1 className="text-3xl font-bold mb-4 text-slate-800">ศูนย์บริการ RepairShop sexy</h1>
            <p className="text-slate-500 mb-10 text-lg">จองคิวออนไลน์ง่ายๆ เช็คตารางงานช่างได้ทันที พร้อมเลือกอะไหล่คุณภาพตามงบประมาณของคุณ</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button onClick={() => setPage('select')} className="bg-orange-500 text-white px-12 py-5 rounded-2xl text-2xl font-black shadow-2xl hover:bg-orange-600 transform hover:scale-105 transition flex items-center gap-4">
                <Calendar size={28}/> จองคิวเลย
                </button>
                <button onClick={() => setPage('history')} className="bg-slate-100 text-slate-700 border-2 border-slate-200 px-8 py-5 rounded-2xl text-xl font-bold shadow-sm hover:bg-slate-200 transition flex items-center gap-3">
                <History size={24}/> ประวัติการจอง
                </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (page === 'history') {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-white p-4 shadow sticky top-0 z-50 flex gap-4 items-center rounded-lg mb-6">
                <button onClick={() => setPage('landing')} className="font-bold text-gray-500 flex items-center gap-1"><ArrowLeft size={18}/> กลับหน้าหลัก</button>
                <h2 className="font-bold text-lg flex items-center gap-2"><History size={20} className="text-orange-500"/> ประวัติการจองของฉัน</h2>
            </div>
            <div className="max-w-3xl mx-auto p-4 space-y-4">
                {userBookings.length === 0 ? (
                    <div className="text-center p-10 text-gray-400 bg-white rounded-2xl shadow-sm border border-dashed"><p>คุณยังไม่มีประวัติการจอง</p></div>
                ) : (
                    userBookings.map(b => (
                        <div key={b.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="text-sm text-gray-400 font-bold mb-1">วันนัดหมาย</div>
                                    <div className="text-xl font-black text-slate-800 flex items-center gap-2">
                                        {b.bookingDate} <span className={`text-sm px-2 py-1 rounded-lg ${b.bookingTime.startsWith('08') ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>{b.bookingTime.substring(0,5)} น.</span>
                                    </div>
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-gray-100">{b.status}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm mb-4 bg-slate-50 p-4 rounded-xl">
                                <div><div className="text-slate-400 text-xs">รถยนต์</div><div className="font-bold">{b.carBrand} ({b.licensePlate})</div></div>
                                <div><div className="text-slate-400 text-xs">ระยะทาง</div><div className="font-bold">{b.mileage.toLocaleString()} km</div></div>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                                <div className="text-lg font-bold text-slate-900">฿{b.totalPrice.toLocaleString()}</div>
                                {['PENDING', 'CONFIRMED'].includes(b.status) && (
                                    <button onClick={() => handleDeleteBooking(b.id)} className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition"><Trash2 size={16}/> ยกเลิกการจอง</button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
  }

  if (page === 'admin') {
    if (!isStaff) return <div className="p-20 text-center">Access Denied</div>;
    
    const uniqueDates = [...new Set(allBookings.map(b => b.bookingDate))].sort().reverse();
    const filteredBookings = allBookings.filter(b => {
        const matchesSearch = b.customerName.toLowerCase().includes(adminBookingSearch.toLowerCase()) || 
                              b.licensePlate.toLowerCase().includes(adminBookingSearch.toLowerCase());
        const matchesDate = adminDateFilter ? b.bookingDate === adminDateFilter : true;
        return matchesSearch && matchesDate;
    });

    const mechanicJobs = allBookings.filter(b => ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'].includes(b.status) && (adminDateFilter ? b.bookingDate === adminDateFilter : true));
    
    const filteredAccountingBookings = allBookings.filter(b => {
        if (!['COMPLETED', 'CLOSED'].includes(b.status)) return false; 
        if (accountingViewType === 'daily') {
            return b.bookingDate === accountingDate;
        } else {
            return b.bookingDate.startsWith(accountingDate);
        }
    });

    const lowStockItems = getLowStockItems();

    return (
        <div className="min-h-screen bg-gray-100 pb-20">
            {/* --- Modals are placed here to ensure they are on top of z-index stack --- */}
            <MechanicJobModal 
                isOpen={mechanicModalOpen} 
                onClose={() => setMechanicModalOpen(false)} 
                job={selectedJobForMechanic} 
                partsCatalog={partsCatalog}
                onConfirmStart={handleMechanicStartJob}
            />

            <AccountingCloseModal
                isOpen={accountingModalOpen}
                onClose={() => setAccountingModalOpen(false)}
                job={selectedJobForAccounting}
                onConfirmClose={handleAccountingCloseJob}
            />

            <div className="bg-slate-900 text-white p-4 sticky top-0 z-50 flex justify-between items-center shadow-md overflow-x-auto">
                <div className="flex items-center gap-4 min-w-max">
                    <button onClick={() => setPage('landing')} className="p-2 hover:bg-slate-800 rounded-lg"><ArrowLeft/></button>
                    <h2 className="font-bold text-xl">Staff Control Center</h2>
                </div>
                <div className="flex bg-slate-800 p-1 rounded-xl min-w-max ml-4">
                    {/* เมนูสำหรับทุกคนที่เป็น Staff ให้เห็นคิวงาน */}
                    {isStaff && (
                        <button onClick={() => setAdminTab('bookings')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${adminTab === 'bookings' ? 'bg-orange-500 text-white' : 'text-slate-400'}`}>
                            <ClipboardList size={18}/> คิวงานลูกค้า
                        </button>
                    )}
                    {(isAdmin || isMechanic) && (
                        <button onClick={() => setAdminTab('mechanic')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${adminTab === 'mechanic' ? 'bg-orange-500 text-white' : 'text-slate-400'}`}>
                            <Briefcase size={18}/> งานช่าง
                        </button>
                    )}
                    {(isAdmin || isAccountant) && (
                        <button onClick={() => setAdminTab('accounting')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${adminTab === 'accounting' ? 'bg-orange-500 text-white' : 'text-slate-400'}`}>
                            <DollarSign size={18}/> บัญชี
                        </button>
                    )}
                    {(isAdmin || isMechanic) && (
                        <>
                            <button onClick={() => setAdminTab('parts')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${adminTab === 'parts' ? 'bg-orange-500 text-white' : 'text-slate-400'}`}>
                                <Database size={18}/> สต็อก
                            </button>
                            <button onClick={() => setAdminTab('lowstock')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${adminTab === 'lowstock' ? 'bg-red-500 text-white' : 'text-slate-400'}`}>
                                <AlertTriangle size={18}/> เตือน {lowStockItems.length > 0 && <span className="bg-white text-red-600 px-1.5 rounded-full text-xs">{lowStockItems.length}</span>}
                            </button>
                        </>
                    )}
                     {/* 🆕 Config Tab for Admin Only */}
                    {isAdmin && (
                        <button onClick={() => setAdminTab('config')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${adminTab === 'config' ? 'bg-purple-500 text-white' : 'text-slate-400'}`}>
                            <Settings size={18}/> ตั้งค่า
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-4 md:p-8">
                {/* --- 1. หน้าคิวงาน (Reception) --- */}
                {adminTab === 'bookings' && isStaff && (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border-l-4 border-blue-500 mb-6">
                           <div className="flex gap-4">
                                <div className="relative flex-1">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                                    <select className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-2xl outline-none" value={adminDateFilter} onChange={e => setAdminDateFilter(e.target.value)}>
                                        <option value="">-- ทุกวันที่ --</option>
                                        {uniqueDates.map(date => (<option key={date} value={date}>{date}</option>))}
                                    </select>
                                </div>
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                                    <input className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl outline-none" placeholder="ค้นหาลูกค้า..." value={adminBookingSearch} onChange={e => setAdminBookingSearch(e.target.value)}/>
                                </div>
                           </div>
                        </div>

                        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase border-b">
                                        <th className="p-6">วัน/เวลา</th>
                                        <th className="p-6">ลูกค้า</th>
                                        <th className="p-6">รถยนต์</th>
                                        <th className="p-6 text-center">สถานะ</th>
                                        <th className="p-6 text-center">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-sm">
                                    {filteredBookings.map(b => (
                                        <tr key={b.id} className="hover:bg-orange-50/30 transition">
                                            <td className="p-6">
                                                <div className="font-bold text-slate-800">{b.bookingDate}</div>
                                                <div className="text-xs text-blue-500">{b.bookingTime.substring(0,5)} น.</div>
                                            </td>
                                            <td className="p-6">
                                                <div className="font-bold">{b.customerName}</div>
                                                <div className="text-xs text-slate-400">{b.phoneNumber}</div>
                                            </td>
                                            <td className="p-6">
                                                <div className="font-black">{b.licensePlate}</div>
                                                <div className="text-xs text-slate-400">{b.carBrand}</div>
                                            </td>
                                            <td className="p-6 text-center"><span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-gray-100">{b.status}</span></td>
                                            <td className="p-6 text-center">
                                                <div className="flex justify-center gap-2">
                                                    {b.status === 'PENDING' && (
                                                        <button onClick={() => handleConfirmBooking(b.id)} className="text-green-500 hover:bg-green-50 p-2 rounded-full"><CheckCircle size={18}/></button>
                                                    )}
                                                    <button onClick={() => handleDeleteBooking(b.id)} className="text-red-400 hover:bg-red-50 p-2 rounded-full"><Trash2 size={18}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- 2. หน้าช่าง (Mechanic) --- */}
                {adminTab === 'mechanic' && (isAdmin || isMechanic) && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm mb-4">
                            <h3 className="font-bold flex items-center gap-2"><Briefcase/> งานที่รอซ่อม</h3>
                            <select className="p-2 border rounded-xl text-sm" value={adminDateFilter} onChange={e => setAdminDateFilter(e.target.value)}>
                                <option value="">-- ทุกวันที่ --</option>
                                {uniqueDates.map(date => (<option key={date} value={date}>{date}</option>))}
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {mechanicJobs.length === 0 && <div className="col-span-2 p-10 text-center text-gray-400">ไม่มีงานค้าง</div>}
                            {mechanicJobs.map(job => (
                                <MechanicJobCard key={job.id} job={job} partsCatalog={partsCatalog} onUpdateStatus={handleUpdateStatus} />
                            ))}
                        </div>
                    </div>
                )}

                {/* --- 5. หน้าบัญชี (Accounting) 🆕 - เพิ่มตัวเลือกรายวัน/รายเดือน และตารางละเอียด --- */}
                {adminTab === 'accounting' && (isAdmin || isAccountant) && (
                     <div className="space-y-6">
                        {/* 📊 ส่วนควบคุมการกรอง (รายวัน/รายเดือน) */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="flex bg-slate-100 p-1 rounded-xl">
                                    <button 
                                        onClick={() => setAccountingViewType('daily')}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold ${accountingViewType === 'daily' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
                                    >
                                        รายวัน
                                    </button>
                                    <button 
                                        onClick={() => setAccountingViewType('monthly')}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold ${accountingViewType === 'monthly' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
                                    >
                                        รายเดือน
                                    </button>
                                </div>
                                <input 
                                    type={accountingViewType === 'daily' ? 'date' : 'month'}
                                    className="p-2 border rounded-xl bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                                    value={accountingDate}
                                    onChange={(e) => setAccountingDate(e.target.value)}
                                />
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-slate-400 uppercase font-bold">ยอดขายรวม ({accountingViewType === 'daily' ? 'รายวัน' : 'รายเดือน'})</div>
                                <div className="text-3xl font-black text-green-600">
                                    {filteredAccountingBookings.reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString()} บาท
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden">
                                 <div className="p-4 bg-slate-50 border-b font-bold flex gap-2 items-center"><FileText/> ประวัติงานและยอดขาย (Closed Jobs)</div>
                                 <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 text-[10px] uppercase text-slate-400">
                                            <tr>
                                                <th className="p-4">วันที่</th>
                                                <th className="p-4">ลูกค้า</th>
                                                <th className="p-4">รายการอะไหล่ที่ใช้จริง</th>
                                                <th className="p-4">ช่างผู้ซ่อม</th>
                                                <th className="p-4 text-right">ยอดชำระ</th>
                                                <th className="p-4 text-center">สถานะ</th>
                                                <th className="p-4 text-center">จัดการ</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y text-sm">
                                            {filteredAccountingBookings.length === 0 && (
                                                <tr><td colSpan="7" className="p-8 text-center text-slate-300">ไม่มีรายการในช่วงเวลานี้</td></tr>
                                            )}
                                            {filteredAccountingBookings.map(b => (
                                                <tr key={b.id} className="hover:bg-slate-50">
                                                    <td className="p-4 whitespace-nowrap align-top">{b.bookingDate}</td>
                                                    <td className="p-4 font-bold align-top">
                                                        {b.customerName}
                                                        <div className="text-xs text-slate-400 font-normal">{b.licensePlate}</div>
                                                    </td>
                                                    <td className="p-4 text-xs text-slate-500 align-top">
                                                        <ul className="list-disc list-inside">
                                                            {parseItemString(b.selectedItems).map((i,x) => <li key={x}>{i.split(' (')[0]}</li>)}
                                                        </ul>
                                                    </td>
                                                    <td className="p-4 align-top">
                                                        {b.mechanicName ? (
                                                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">{b.mechanicName}</span>
                                                        ) : <span className="text-gray-400 text-xs italic">ไม่ระบุ</span>}
                                                    </td>
                                                    <td className="p-4 text-right font-black align-top">{b.totalPrice.toLocaleString()}</td>
                                                    <td className="p-4 text-center align-top"><span className={`px-2 py-1 rounded text-xs ${b.status === 'CLOSED' ? 'bg-gray-200' : 'bg-green-100 text-green-700'}`}>{b.status}</span></td>
                                                    <td className="p-4 text-center align-top">
                                                        {b.status === 'COMPLETED' && (
                                                            <button onClick={() => handleUpdateStatus(b.id, 'CLOSED')} className="bg-green-600 text-white px-3 py-1 rounded shadow-sm text-xs hover:bg-green-700 whitespace-nowrap">
                                                                💰 รับเงิน/ปิดงาน
                                                            </button>
                                                        )}
                                                        {b.status === 'CLOSED' && <span className="text-green-500 text-xs font-bold"><CheckCircle size={14} className="inline"/> เรียบร้อย</span>}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                 </div>
                            </div>
                     </div>
                )}

                 {/* --- 4. 🆕 สินค้าใกล้หมด (Low Stock) --- */}
                 {adminTab === 'lowstock' && (isAdmin || isMechanic) && (
                    <div className="space-y-6">
                        <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <h3 className="font-black text-red-700 text-lg flex items-center gap-2"><AlertTriangle/> แจ้งเตือนสินค้าใกล้หมด</h3>
                                <p className="text-red-500 text-sm">รายการสินค้าที่มีจำนวนคงเหลือน้อยกว่ากำหนด</p>
                            </div>
                            <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm">
                                <span className="text-xs font-bold text-slate-500 ml-2">แจ้งเตือนเมื่อต่ำกว่า:</span>
                                <input 
                                    type="number" 
                                    className="w-16 p-2 border rounded-lg text-center font-bold outline-none focus:ring-2 focus:ring-red-500"
                                    value={lowStockThreshold}
                                    onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 0)}
                                />
                                <span className="text-xs font-bold text-slate-500 mr-2">ชิ้น</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {getLowStockItems().length === 0 && (
                                <div className="col-span-2 p-12 text-center bg-white rounded-3xl border border-dashed border-green-200">
                                    <CheckCircle size={48} className="mx-auto text-green-500 mb-3 opacity-50"/>
                                    <div className="text-green-700 font-bold">สินค้าเพียงพอ</div>
                                    <div className="text-green-500 text-sm">ไม่มีรายการที่ต่ำกว่า {lowStockThreshold} ชิ้น</div>
                                </div>
                            )}
                            {getLowStockItems().map(item => (
                                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-red-500 flex justify-between items-center hover:shadow-md transition">
                                    <div>
                                        <div className="text-xs text-slate-400 mb-1">{item.categoryName}</div>
                                        <div className="font-bold text-slate-800">{item.name}</div>
                                        <div className="text-xs text-slate-500">{item.price} บาท</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-center">
                                            <div className="text-[10px] font-bold text-red-500 uppercase">คงเหลือ</div>
                                            <div className="text-2xl font-black text-red-600">{item.stock}</div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <button onClick={() => handleUpdateStock(item.id, item.stock, 5)} className="bg-slate-100 hover:bg-green-100 text-slate-600 hover:text-green-700 p-1.5 rounded-lg transition" title="เติม 5 ชิ้น">
                                                <PlusCircle size={16}/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- 3. จัดการสินค้า (Inventory) --- */}
                {adminTab === 'parts' && (isAdmin || isMechanic) && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                            <div className="flex items-center gap-2 text-slate-700 text-sm font-bold">
                                <RefreshCw size={20}/>
                                <span>เครื่องมือจัดการฐานข้อมูล (ใช้เมื่อข้อมูลซ้ำ)</span>
                            </div>
                            <button onClick={handleCleanupDuplicates} disabled={loading} className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition">
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
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">จำนวนสต็อก</label>
                                    <input type="number" className="w-full p-3 bg-gray-50 border rounded-xl" placeholder="10" value={newPart.stock} onChange={e => setNewPart({...newPart, stock: e.target.value})}/>
                                </div>
                                <button type="submit" disabled={loading} className="bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg md:col-span-4">บันทึกลง Database</button>
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
                                    <div className="bg-slate-800 text-white p-4 font-black text-sm flex justify-between">
                                        <span>{partsCatalog[k].name}</span>
                                        <span className="bg-slate-700 px-2 rounded-full text-xs py-0.5">{partsCatalog[k].options.length} รายการ</span>
                                    </div>
                                    <div className="divide-y">
                                        {partsCatalog[k].options.map(item => (
                                            <div key={item.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                                                <div>
                                                    <div className="font-bold">{item.name}</div>
                                                    <div className="text-xs text-slate-400">{item.price} บาท</div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                                        <button onClick={() => handleUpdateStock(item.id, item.stock, -1)} className="text-slate-500 hover:text-red-500"><MinusCircle size={18}/></button>
                                                        <span className={`font-bold text-sm w-8 text-center ${item.stock < lowStockThreshold ? 'text-red-500' : ''}`}>{item.stock || 0}</span>
                                                        <button onClick={() => handleUpdateStock(item.id, item.stock, 1)} className="text-slate-500 hover:text-green-500"><PlusCircle size={18}/></button>
                                                    </div>
                                                    <button onClick={() => handleDeletePart(item.id)} className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50"><Trash2 size={18}/></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* --- 6. 🆕 ตั้งค่า (Config) --- */}
                {adminTab === 'config' && isAdmin && (
                    <div className="space-y-6">
                        <div className="bg-purple-50 p-6 rounded-3xl border border-purple-100">
                             <h3 className="font-black text-purple-800 text-lg flex items-center gap-2 mb-4"><Ban/> ตั้งค่าวันหยุดร้าน (ปิดรับจอง)</h3>
                             
                             <div className="flex gap-2 mb-6">
                                <input 
                                    type="date" 
                                    className="p-3 border rounded-xl flex-1 outline-none"
                                    value={newBlockedDate}
                                    onChange={(e) => setNewBlockedDate(e.target.value)}
                                />
                                <button onClick={handleBlockDate} className="bg-purple-600 text-white px-6 rounded-xl font-bold hover:bg-purple-700">เพิ่มวันหยุด</button>
                             </div>

                             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {blockedDates.length === 0 && <div className="text-gray-400 text-sm italic col-span-4">ยังไม่ได้กำหนดวันหยุด</div>}
                                {blockedDates.map(date => (
                                    <div key={date} className="bg-white p-3 rounded-lg border border-purple-200 flex justify-between items-center text-sm shadow-sm">
                                        <span className="font-bold text-purple-700">{date}</span>
                                        <button onClick={() => handleUnblockDate(date)} className="text-red-400 hover:text-red-600"><X size={16}/></button>
                                    </div>
                                ))}
                             </div>
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
                    
                    <div className="relative">
                        <input 
                          placeholder="เบอร์โทรศัพท์ติดต่อ" 
                          className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold" 
                          value={data.phoneNumber} 
                          onChange={e => setData({...data, phoneNumber: e.target.value})}
                        />
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
                                        
                                        {!slot.available && (
                                            <div className="text-[10px] text-red-400 mt-1">
                                                (ใช้เวลา {slot.needed} ชม.)
                                            </div>
                                        )}

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