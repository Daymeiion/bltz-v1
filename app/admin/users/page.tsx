import { StatCard } from "@/components/admin/StatCard";
import { UserManagement } from "@/components/admin/UserManagement";

export const metadata = {
  title: "Admin • Users | BLTZ",
  description: "Manage users across roles and review recent activity.",
};

export default function AdminUsersPage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Stat Cards: Recent activity snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="New Signups"
          value="342"
          trend="+18%"
          trendDirection="up"
          subtitle="vs last period"
          description="Spike from campaign"
        />
        <StatCard
          title="Active Users"
          value="12,480"
          trend="+3%"
          trendDirection="up"
          subtitle="7d average"
          description="Stable engagement"
        />
        <StatCard
          title="Messages Sent"
          value="4,102"
          trend="-5%"
          trendDirection="down"
          subtitle="week-over-week"
          description="Normal variance"
        />
        <StatCard
          title="Blocks"
          value="27"
          trend="+2%"
          trendDirection="up"
          subtitle="moderation actions"
          description="All reviewed"
        />
      </div>

      {/* Users Table (same design as dashboard) */}
      <UserManagement />
    </div>
  );
}


