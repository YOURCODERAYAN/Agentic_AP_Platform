import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { KpiCards } from '../components/KpiCards';
import { InvoiceFunnel } from '../components/Chart1'
import { useDashboardStats } from '../queries/useDashboard'
import { ExceptionDonutChart } from '../components/Chart2';
import { VolumeTrendChart } from '../components/Chart3';
import { useInvoices } from '../queries/useInvoices';
import {toast} from 'sonner'

export default function Dashboard() {

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: stats, isLoading } = useDashboardStats();
  const { data: invoices } = useInvoices();

  // Refresh — re-fetch all dashboard-related queries, simulating a live re-pull
  function handleRefresh() {
    queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    queryClient.invalidateQueries({ queryKey: ['volumeTrend'] });
    queryClient.invalidateQueries({ queryKey: ['exceptionBreakdown'] });
    queryClient.invalidateQueries({ queryKey: ['invoiceFunnel'] });
    toast.success("Dashboard Refreshed"); // swap for toast.success once sonner is set up
  }

  // Export Reports — client-side CSV download from currently loaded invoice data
  function handleExportReport() {
    if (!invoices || invoices.length === 0) {
      toast.error('Report is not exported');
      return;
    }

    const headers = ['Invoice #', 'Vendor', 'Amount', 'Match Status', 'Stage'];
    const rows = invoices.map((inv) => [inv.id, inv.vendor, inv.amount, inv.matchStatus, inv.stage]);
    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ap-report.csv';
    link.click();
    URL.revokeObjectURL(url);

    toast.success("Report Exported"); 
  }

  if (isLoading) return (
    <div className="min-h-screen bg-white text-black dark:bg-slate-950 dark:text-slate-200 p-2">
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="h-7 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          <div className="flex items-center gap-2">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-10 w-28 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="h-80 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-80 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
      </div>

      <div className="mt-4 h-80 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
    </div>
  );
  if (!stats) return null
  return (
    <div className="h-screen bg-white text-black dark:bg-slate-950 dark:text-slate-200 p-2">
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xl font-semibold   font-serif text-slate-950 dark:text-gray-400 ">AP Controller Tower</span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/Exception')}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
            >
              View Exceptions
            </button>
            <button
              onClick={() => navigate('/inbox?stage=human_review')}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
            >
              Pending Approvals
            </button>
            <button
              onClick={handleRefresh}
              className="rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white"
            >
              Refresh
            </button>
            <button
              onClick={handleExportReport}
              className="rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold text-white"
            >
              Export Report
            </button>
          </div>
        </div>
      </div>


       {/* Here we have to define six differnt grid sections or like tab like sections */}

    <div className="flex flex-wrap items-center gap-5  w-full  " style={{height:'200px'}}>

        <div className="grid grid-cols-6 gap-6  w-full " style={{height:'50%'}}>
                        <div  className=" rounded-3xl  w-full   ">
                                <KpiCards   label="Total Invoices" value={stats.totalInvoices} />
                        </div>

                        <div >
                                <KpiCards  label=" Processed" value={stats.processedInvoices} />
                        </div>

                        <div className=" rounded-3xl  w-full ">
                                  <KpiCards  label= "Pending Approval" value={stats.pendingApprovals} />
                        </div>

                        <div className=" rounded-3xl  w-full ">
                              <KpiCards  label="Active Exceptions"  value={stats.activeExceptions} />
                        </div>

                        <div className=" rounded-3xl w-full ">
                            <KpiCards  label="STP Rate"  value={`${stats.stpRate}%`}/>
                        </div>

                        <div className="  rounded-3xl w-full ">
                            <KpiCards  label="Avg Processing Time" value={`${stats.avgProcessingTimeHrs} hrs`} />
                        </div>
        </div>
    </div>
    <div  className="flex  flex-row  gap-6  items-center justify-center  w-full mt-1 " style={{height:'320px'}} >
        <div className="grid grid-cols-2 gap-40 w-full  " style={{height:'100%'}}>

                <div className="rounded-2xl  " style={{width:'120%'}}>
                        <InvoiceFunnel />
                </div>


                 <div className=" rounded-2xl " style={{width:'100%'}}>
                      <ExceptionDonutChart />
                </div>  
        </div>
    </div>
    <div className="rounded-2xl mt-3" style={{width:'100%' , height:'30%'}}>
            <VolumeTrendChart />
    </div>
    </div>
  )
}