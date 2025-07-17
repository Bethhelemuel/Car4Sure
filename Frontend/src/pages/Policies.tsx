import React, { useEffect, useState } from 'react';
import { Trash2, Search, Plus, MoreHorizontal, Edit2, Eye, RefreshCw ,LoaderCircle} from 'lucide-react';
import { Heading } from '../components/Heading'; // Assuming this path is correct for your Heading component
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { useToast } from '../components/ToastProvider';
import ViewPolicyModal from '../components/ViewPolicyModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


import jsPDF from 'jspdf'; 
import 'jspdf-autotable';

const PAGE_SIZE_OPTIONS = [10, 50, 100]; 
  
export default function Policies() {
  const [policies, setPolicies] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("created_at");
  const [sortDir, setSortDir] = useState("desc");

  // Debounce search input
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(handler);
  }, [search]);

  const { user, token } = useAuth();

  // Move fetchPolicies out of useEffect so it can be called manually
  const fetchPolicies = React.useCallback(async () => {
    setLoading(true);
    try {
      const body = {
        page,
        per_page: pageSize,
        search: debouncedSearch,
        sort,
        sortDir,
        user_id: user?.id,
        timestamp: Date.now(),
      };
      const res = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/getallpolicies`,
        {
          method: 'POST',
          headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          body: JSON.stringify(body),
        }
      );
      const json = await res.json();
      setPolicies(json.data || []);
      setCount(json.count || 0);
    } catch (err) {
      // handle error
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, sort, sortDir, user, token]);

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  const totalPages = Math.ceil(count / pageSize) || 1;

  const getStatusColor = (status:string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800'; 
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Add state for open action menu
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; policyNumber: string | null; policyId: number | null, loading?: boolean }>({ open: false, policyNumber: null, policyId: null });
  const [viewModal, setViewModal] = useState<{ open: boolean; data: any | null; loading: boolean }>({ open: false, data: null, loading: false });
  const toast = useToast();
  const navigate = useNavigate();

  async function handleDeletePolicy() { 
    if (!deleteModal.policyId) return;
    setDeleteModal((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/policies/${deleteModal.policyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      if (!res.ok) throw new Error('Failed to delete');
      setDeleteModal({ open: false, policyNumber: null, policyId: null });
      fetchPolicies();
      toast.success('Policy deleted successfully!', { description: `Policy #${deleteModal.policyNumber} was deleted.` });
    } catch (err) {
      setDeleteModal((prev) => ({ ...prev, loading: false }));
      toast.error('Delete failed', { description: err instanceof Error ? err.message : 'An error occurred.' });
    }
  }

  async function handleViewPolicy(policyId: number) {
    setViewModal({ open: true, data: null, loading: true });
    try {
      const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/getpolicy/${policyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      if (!res.ok) throw new Error('Failed to fetch policy details');
      const data = await res.json();
      setViewModal({ open: true, data, loading: false });
    } catch (err) {
      setViewModal({ open: true, data: null, loading: false });
      // Optionally show a toast or error
    }
  }

  // Helper to load image as base64
  const getBase64ImageFromURL = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = function (error) {
        reject(error);
      };
      img.src = url;
    });
  };

  const handleExportPDF = async () => {
    const doc = new jsPDF();
    const columns = [
      'Policy Number',
      'Policy Type',
      'Status',
      'Effective Date',
      'Expiration Date',
      'Holder Name',
      'Vehicle',
      'Created At',
    ];
    const rows = policies.map((p: any) => [
      p.policyNumber,
      p.policyType,
      p.status,
      p.effectiveDate, 
      p.expirationDate,
      p.holderName,
      p.vehicle,
      p.createdAt ? new Date(p.createdAt).toLocaleString() : '-',
    ]); 
    // Add logo to top right
    try {
      const logoData = await getBase64ImageFromURL(process.env.PUBLIC_URL + '/logo.png');
      doc.addImage(logoData, 'PNG', 160, 8, 30, 15); 
    } catch (e) {
      console.log(e);
    }
    doc.text('Policies', 14, 16);
    (doc as any).autoTable({
      head: [columns],
      body: rows, 
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
    });
    doc.save('policies.pdf');
  };

  const handleExportCSV = () => {
    const columns = [
      'Policy Number',
      'Policy Type',
      'Status',
      'Effective Date',
      'Expiration Date',
      'Holder Name',
      'Vehicle',
      'Created At',
    ];
    const rows = policies.map((p: any) => [
      p.policyNumber,
      p.policyType,
      p.status,
      p.effectiveDate,
      p.expirationDate,
      p.holderName,
      p.vehicle,
      p.createdAt ? new Date(p.createdAt).toLocaleString() : '-',
    ]);
    const csvContent =
      columns.join(',') +
      '\n' +
      rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'policies.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Define columns for PrintableTable
  const printableColumns = [
    'Policy Number',
    'Policy Type',
    'Status',
    'Effective Date',
    'Expiration Date',
    'Holder Name',
    'Vehicle',
    'Created At',
  ];

  // For testing: always print an empty table
  const getPrintableData = () => [];

  return (
    <div>
      <Heading name="Policies" description="Browse and manage all your insurance policies in one place." />

<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
  <div className="flex items-center gap-2 mb-2 sm:mb-0">
    <label htmlFor="pageSize" className="text-sm text-gray-600">Rows per page:</label>
    <select
      id="pageSize"
      className="block w-20 px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      value={pageSize}
      onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
    >
      {PAGE_SIZE_OPTIONS.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    <button
      type="button"
      className="ml-2 p-2 rounded bg-primary hover:bg-primary/90 text-white focus:outline-none"
      onClick={fetchPolicies}
      title="Refresh"
      disabled={loading}
    >
      <RefreshCw className={loading ? 'animate-spin' : ''} size={18} color="white" />
    </button>
    <button
      type="button"
      className="ml-2 p-1 rounded bg-primary hover:bg-primary/90 text-white focus:outline-none"
      onClick={() => handleExportPDF()}
      title="Export as PDF"
    >
      Export PDF
    </button>
    <button 
      type="button"
      className="ml-2 p-1 rounded bg-primary hover:bg-primary/90 text-white focus:outline-none"
      onClick={handleExportCSV}
      title="Export as CSV"
    >
      Export CSV
    </button>
                  </div>
  <div className="relative w-full sm:w-72">
    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <Search className="w-5 h-5 text-gray-400" />
    </span>
                  <input
                    type="text"
      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
      placeholder="Search by policy #, holder, or vehicle..."
      value={search}
      onChange={e => { setSearch(e.target.value); setPage(1); }}
                  />
                </div>
  <div className="flex items-center gap-2">
    <label htmlFor="sort" className="text-sm text-gray-600">Sort by:</label>
    <select
      id="sort"
      className="block w-36 px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      value={sort}
      onChange={e => { setSort(e.target.value); setPage(1); }}
    >
      <option value="policy_no">Policy Number</option>
      <option value="policy_effective_date">Effective Date</option>
      <option value="policy_status">Status</option>
      <option value="created_at">Created At</option>
    </select>
                <button
                  type="button"
      className="ml-1 px-3 py-2 border rounded text-sm text-gray-600 bg-white focus:bg-white active:bg-white hover:bg-white"
      onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
      title={`Sort ${sortDir === "asc" ? "Descending" : "Ascending"}`}
    >
      {sortDir === "asc" ? "↑" : "↓"}
                  </button>
                      </div>
                    </div>

      {loading ? (
          <div className="flex justify-center items-center py-8">
          <LoaderCircle className="animate-spin h-8 w-8 text-primary" />
                </div>
      ) : (
        <>
     
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Policy Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Policy Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Effective Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiration Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Holder Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                    </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {policies.map((p: any) => (
                <tr key={p.policyNumber} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {p.policyNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {p.policyType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {p.effectiveDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {p.expirationDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                    {p.holderName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {p.vehicle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {p.createdAt ? new Date(p.createdAt).toLocaleString() : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                        <button
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => setOpenMenu(openMenu === p.policyNumber ? null : p.policyNumber)}
                      aria-label="Actions"
                    >
                      <MoreHorizontal size={20} />
                        </button>
                    {openMenu === p.policyNumber && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-10">
                        <button className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-50" onClick={() => { setOpenMenu(null); handleViewPolicy(p.policyId); }}><Eye className="mr-2 w-4 h-4" />View</button>
                        <button className="flex items-center w-full px-4 py-2 text-sm text-yellow-600 hover:bg-gray-50" onClick={() => { setOpenMenu(null); navigate(`/edit-policy?id=${p.policyId}`); }}><Edit2 className="mr-2 w-4 h-4" />Edit</button>
                        <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50" onClick={() => { setOpenMenu(null); setDeleteModal({ open: true, policyNumber: p.policyNumber, policyId: p.policyId }); }}><Trash2 className="mr-2 w-4 h-4" />Delete</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{((page - 1) * pageSize) + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(page * pageSize, count)}</span> of{' '}
                        <span className="font-medium">{count}</span> results
                      </p>
            </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => setPage(page - 1)}
                          disabled={page === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                    <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                        </button>
                        
                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600">
                          {page}
                        </span>
                        
                        <button
                          onClick={() => setPage(page + 1)}
                          disabled={page === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                    <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                        </button>
            </nav>
          </div>
        </div>
                </div>
              </div>

              <ConfirmDeleteModal
                open={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, policyNumber: null, policyId: null })}
                onConfirm={handleDeletePolicy}
                policyNumber={deleteModal.policyNumber || ''}
                loading={!!deleteModal.loading}
              />
    
              <ViewPolicyModal
                open={viewModal.open}
                onClose={() => setViewModal({ open: false, data: null, loading: false })}
                data={viewModal.data}
                onEdit={id => navigate(`/edit-policy?id=${id}`)}
                policyId={viewModal.data?.policyNo || viewModal.data?.policyId}
              />
    
        </>
      )}
    </div>
  );
}
