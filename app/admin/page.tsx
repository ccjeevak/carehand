import StatCard from "@/components/StatCard";
import { columns, Payment } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";


import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";
import Image from "next/image";
import Link from "next/link";



const AdminPage = async() => {
const appointments = await getRecentAppointmentList();
  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="sticky top-3 z-20 mx-3 flex justify-between items-center bg-dark-200 py-5 px-[5%] rounded-2xl shadow-lg xl:px-12">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="Logo"
            width={162}
            height={32}
            className="h-8 w-fit"
          />
        </Link>
        <p className="text-16-semibold">Admin Dashboard</p>
      </header>
      <main className="admin-main">
        <section className="space-y-4 w-full">
          <h1 className="header">Welcome, Admin</h1>
          <p className="text-dark-700">
            Start day with managing new appointments
          </p>
        </section>
        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={appointments?.scheduledCount}
            label="Scheduled appointments"
            icon="/assets/icons/appointments.svg"
          />
           <StatCard
            type="pending"
            count={appointments?.pendingCount}
            label="Pending appointments"
            icon="/assets/icons/pending.svg"
          />
           <StatCard
            type="cancelled"
            count={appointments?.cancelledCount}
            label="Cancelled appointments"
            icon="/assets/icons/cancelled.svg"
          />
        </section>
        <DataTable data={appointments.documents} columns={columns}/>
      </main>
    </div>
  );
};

export default AdminPage;
