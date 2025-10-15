import { StatCard } from "@/components/admin/StatCard";
import { VisitorsChart } from "@/components/admin/VisitorsChart";
import { UserManagement } from "@/components/admin/UserManagement";

export const metadata = {
  title: "Admin Dashboard | BLTZ",
  description: "BLTZ Platform Administration Dashboard",
};

export default function AdminDashboardPage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Revenue"
          value="$1,250.00"
          trend="+12.5%"
          trendDirection="up"
          subtitle="Trending up this month"
          description="Visitors for the last 6 months"
        />
        <StatCard
          title="New Customers"
          value="1,234"
          trend="-20%"
          trendDirection="down"
          subtitle="Down 20% this period"
          description="Acquisition needs attention"
        />
        <StatCard
          title="Active Accounts"
          value="45,678"
          trend="+12.5%"
          trendDirection="up"
          subtitle="Strong user retention"
          description="Engagement exceed targets"
        />
        <StatCard
          title="Growth Rate"
          value="4.5%"
          trend="+4.5%"
          trendDirection="up"
          subtitle="Steady performance increase"
          description="Meets growth projections"
        />
      </div>

      {/* Visitors Chart */}
      <VisitorsChart />

      {/* User Management */}
      <UserManagement />
    </div>
  );
}
